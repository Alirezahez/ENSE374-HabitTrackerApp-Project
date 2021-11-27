const fs = require("fs");

const express = require ( "express" );

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

// create a mongoose schema for a user
const userSchema = new mongoose.Schema ({
    username:   String,
    password:   String
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model ( "User", userSchema );


const habitSchema = new mongoose.Schema ({
    _id: Number,
    title: String,
    user: String,
    period: String,
    frequency: Number,
    progress: Number,
    status: Number,
    category: String,
    startDate: Date,
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
            const Hresults = await habit.find();
            console.log("Habits:\n", Hresults );
            const testResults = await habit.find({user: req.user.username});
            console.log("user specific:\n", testResults);
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

app.post("/register", (req, res) => {
    console.log( "User " + req.body.username + " is attempting to register" );
    User.register({ username : req.body.username }, 
                    req.body.password, 
                    ( err, user ) => {
        if ( err ) {
        console.log( err );
            res.redirect( "/" );
        } else {
            passport.authenticate( "local" )( req, res, () => {
                res.redirect( "/dashboard" );
            });
        }
    });
   
}) 

var i=0;
 app.post("/createHabit", async(req, res)=>{
    console.log(req.body)
    console.log("added a task: ", req.body.habitName)
        
 const addHabit = new habit ({
    _id: i,
    title: req.body.habitName,
    user: req.user.username,
    period: req.body.period,
    frequency: req.body.frequency,
    progress: 0,
    status: null,
    category: req.body.habitCatagory,
    startDate: req.body.start,
    endDate: req.body.end,
    description: req.body.reason
    })

     addHabit.save().then( ()=>console.log("habit added"));
     //console.log(addHabit);

     i++;
     res.redirect("/dashboard")
 })

app.get("/logout", (req, res) => {
    console.log( "A user is logging out" );
    req.logout();
    res.redirect("/");
 });