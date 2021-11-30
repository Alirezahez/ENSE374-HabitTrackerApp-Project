const fs = require("fs");

const express = require ( "express" );
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator')
// this is a canonical alias to make your life easier, like jQuery to $.
const app = express(); 

const port = 3000; 
app.listen (port, () => {
   // template literal
   console.log (`Server is running on http://localhost:${port}`);
});

const mongoose = require( "mongoose" );

// 1. Require dependencies /////////////////////////////////////////
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
require("dotenv").config();
////////////////////////////////////////////////////////////////////

// 2. Create a session. The secret is used to sign the session ID.
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use (passport.initialize());
app.use (passport.session());
////////////////////////////////////////////////////////////////////


// connect to mongoose on port 27017
mongoose.connect( "mongodb://localhost:27017/project", 
                { useNewUrlParser: true, 
                  useUnifiedTopology: true});

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true}));
const urlencodedParser = bodyParser.urlencoded({ extended: false })
// create a mongoose schema for a user
const userSchema = new mongoose.Schema ({
    username:   String,
    password:   String
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model ( "User", userSchema );


const habitSchema = new mongoose.Schema ({
    title: String,
    user: String,
    period: String,
    frequency: Number,
    progress: Number,
    status: Number,
    category: String,
    startDate: Date,
    nextDate: Date,
    endDate: Date,
    description: String
});
const habit = mongoose.model ( "habit", habitSchema );


// 4. Add our strategy for using Passport, using the local user from MongoDB
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
////////////////////////////////////////////////////////////////////

app.get("/", (req, res) => { 
    res.sendFile(__dirname + "/index.html", ( err ) => {
        if ( err ) {
            console.log( err );
            return;
        }
        else {console.log("A user requested the root route");}
    })
});
app.get("/register", (req, res) => { 
  res.render("register");
    console.log("A user requested the register route");
});

app.get("/dashboard", async(req, res) => { 
    console.log("A user is accessing the dashboard route using get, and...");
    if ( req.isAuthenticated() ){
        try {
            console.log(req.user.username, "was authorized and found:" );
            const Allresults = await habit.find();
            console.log("Habits:\n", Allresults );

            const Hresults = await habit.find({user: req.user.username});
            console.log("user specific:\n", Hresults);

            const curr = new Date(Date.now());
            Hresults.forEach(habit => { 
                console.log(habit.title, " - " , habit.id);
            if (habit.nextDate < curr){
                console.log(habit.title, " has passed limit...resetting progress");

                habit.updateOne({ id: habit.id }, 
                                    { $set: { progress: 0 } });
                const d = new Date(habit.nextDate);
                while(d < curr)
                {
                    console.log("type: ", habit.period)
                    console.log("new Nextdate:", d);
                    if (habit.period === "Daily")
                        d.setDate(d.getDate()+1);
                    
                    if (habit.period === "Weekly")
                        d.setDate(d.getDate()+7);
                    
                    if (habit.period === "Monthly")
                        d.setMonth(d.getMonth()+1);
                    console.log("next date: ", d);
                    console.log("current date: " , curr);
                }
                habit.updateOne({ _id: habit._id }, 
                    { $set: { nextDate: d } });
            }
            if (Date.now() > habit.end)
            {
                console.log("Habit ", habit.title, " has passed the end date")
                habit.deleteOne({ id: habit.id });
            }
            });

            console.log("final: \n", Hresults)

            res.render( "index", {user: req.user.username, Hresults : Hresults });
        } catch ( error ) {
            console.log( error );
        }
    } else {
        console.log( "was not authorized." );
        res.redirect( "/" );
    }
});

app.get("/createHabit", (req, res) => {
    console.log( "A user is accessing the createHabit page, and..." );
    if (req.isAuthenticated()) {
        console.log( "was authorized" );
        res.render( "createHabit" );
    } else {
        console.log( "was not authorized" );
        res.redirect( "/" ) 
    }
 })

app.post( "/login", ( req, res ) => {
    console.log( "User " + req.body.username + " is attempting to log in" );
    
    const user = new User ({
        username: req.body.username,
        password: req.body.password
    });
    req.login ( user, ( err ) => {
        if ( err ) {
            console.log( err );
            res.redirect( "/" );
        } else {
            console.log("signing in");
            passport.authenticate( "local" )( req, res, () => {
                res.redirect( "/dashboard" ); 
            });
        }
    });
});

app.post("/register", urlencodedParser, [
    check('username', "Username can't be empty")
        .exists()
        .isLength({ min: 1 }),
    check('password', "password can't be empty").exists().isLength({ min: 1 }),
    check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
              throw new Error('Password Confirmation does not match password');
              //return false?
         }
         return true;
    })
], (req, res) => {
    console.log(req.body);
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        // return res.status(422).jsonp(errors.array())
        const alert = errors.array()
        res.render('register', {
            alert
        })
    }
    else {
        console.log('in');
    console.log( "User " + req.body.username + " is attempting to register" );
    User.register({ username : req.body.username }, 
                    req.body.password, 
                    ( err, user ) => {
        if ( err ) {
        console.log( err );
            res.redirect( "/" );
        } else {
            passport.authenticate( "local" )( req, res, () => {
                res.redirect( "/" );
            });
        }
    });
}
   
}) 

 app.post("/createHabit", async(req, res)=>{
    console.log(req.body)
    console.log("adding a task: ", req.body.habitName)
       
    console.log("start date: ", req.body.start);

    const d = new Date(req.body.start);
    console.log(d);

    if (req.body.period === "Daily")
        d.setDate(d.getDate()+1);
    
    if (req.body.period === "Weekly")
        d.setDate(d.getDate()+7);
    
    if (req.body.period === "Monthly")
        d.setMonth(d.getMonth()+1);
    console.log("next date: ", d);

 const addHabit = new habit ({
    title: req.body.habitName,
    user: req.user.username,
    period: req.body.period,
    frequency: req.body.frequency,
    progress: 0,
    status: 0,
    category: req.body.habitCatagory,
    startDate: req.body.start,
    nextDate: d,
    endDate: req.body.end,
    description: req.body.reason
    })

     addHabit.save().then( ()=>console.log("habit added"));
     //console.log(addHabit);

     res.redirect("/dashboard")
 })

app.get("/logout", (req, res) => {
    console.log( "A user is logging out" );
    req.logout();
    res.redirect("/");
 });


 app.post("/updateHabit", async(req, res)=>{

    let id = req.body.id;
    let frequency = req.body.frequency;
    let progress = req.body.progress; 
    progress++;
    if (progress > frequency) {
      progress = frequency;
    }
    console.log(req.body)
    try {
        await habit.updateOne({ _id: id }, 
        { $set: { progress: progress,
                frequency: frequency} });
        res.redirect("/dashboard");
    } catch (error) {
        console.log(error);
    }

 })
 
 
 app.get('/calendarHabits', async(req, res) => {
    const habitData= await habit.find({user: req.user.username});
    res.send({ data: habitData })
});