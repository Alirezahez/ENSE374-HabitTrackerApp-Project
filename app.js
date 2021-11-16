const fs = require("fs");

const express = require ( "express" );

// this is a canonical alias to make your life easier, like jQuery to $.
const app = express(); 

const port = 3; 
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

// var User = [{
//         username: "user1",
//         password: "password1",
//         avatar: "temp.png"
//     },
//     {
//         username: "user2",
//         password: "password2",
//         avatar: "temp2.png"
//     } 
// ]

const habitSchema = new mongoose.Schema ({
    id: Number,
    title: String,
    frequency: Number,
    progress: Number,
    status: String,
    category: String,
    startDate: String,
    endDate: String
});
const habit = mongoose.model ( "habit", habitSchema );
// var Habit = [
//     {
//     id: 1,
//     title: "habit 1",
//     frequency: 5,
//     progress: 2,
//     status: "healthy",
//     category: "exercise",
//     startDate: "2021-09-23",
//     endDate: "2022-09-23"
//   },
//   {
//     id: 2,
//     title: "habit 2",
//     frequency: 3,
//     progress: 3,
//     status: "healthy",
//     category: "Chase a butterfly",
//     startDate: "2021-10-20",
//     endDate: "2022-09-23"
//   }
// ]

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

app.get("/dashboard", async(req, res) => { 
    console.log("A user is accessing the dashboard route using get, and...");
    if ( req.isAuthenticated() ){
        try {
            console.log( "was authorized and found:" );
            const Hresults = await habit.find();
            console.log( Hresults );
            res.render( "index", {user: req.user.username, Hresults : Hresults });
        } catch ( error ) {
            console.log( error );
        }
    } else {
        console.log( "was not authorized." );
        res.redirect( "/" );
    }
});

//for other forms/buttons, use this for the get route to ensure authorization, change index to the ejs name

// app.get("/addtask", (req, res) => {
//     console.log( "A user is accessing the (fill this in) page, and..." );
//     if (req.isAuthenticated()) {
//         console.log( "was authorized" );
//         res.render( "index" );
//     } else {
//         console.log( "was not authorized" );
//         res.redirect( "/" ) 
//     }
//  })
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
    //QUESTION - are we using an avatar?

    // console.log(req.body);
    // //to do: check db if username is taken if not then, then send the created user to the database then back to login
    // if (req.body.username && req.body.avatar && req.body.password && req.body.confirmPassword) {
    //     //to do: add to database
    //     res.redirect("/");
    // }
   
}) 

app.get("/logout", (req, res) => {
    console.log( "A user is logging out" );
    req.logout();
    res.redirect("/");
 });