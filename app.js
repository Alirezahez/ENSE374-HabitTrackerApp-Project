const fs = require("fs") 
const express = require( "express" );

const app = express(); 
app.use(express.static("public")) //able to get access to all files in public folder
app.use(express.urlencoded({ extended: true})); 

const port = 3000; //port we will connect to locally

var User = [{
        username: "user1",
        password: "password1",
        avatar: "temp.png"
    },
    {
        username: "user2",
        password: "password2",
        avatar: "temp2.png"
    }
]


var Habit = [
    {
    id: 1,
    title: "habit 1",
    frequency: 5,
    progress: 2,
    status: "healthy",
    category: "exercise",
    startDate: "2021-09-23",
    endDate: "2022-09-23"
  },
  {
    id: 2,
    title: "habit 2",
    frequency: 3,
    progress: 3,
    status: "healthy",
    category: "Chase a butterfly",
    startDate: "2021-10-20",
    endDate: "2022-09-23"
  }
]

//http://localhost:3000/
app.get("/", (req, res) => { 
    res.sendFile(__dirname + "/index.html", ( err ) => {
        if ( err ) {
            console.log( err );
            return;
        }
    })
});

app.get("/dashboard", (req, res) => { 
    res.sendFile(__dirname + "/public/HTML/habitDash.html", ( err ) => {
        if ( err ) {
            console.log( err );
            return;
        }
    })
});


//start server
app.listen (port, () => { 
    console.log (`Server is running on http://localhost:${port}`);
}); 


app.post("/login", (req, res) => {
    console.log(req.body)
    //static login for now
    if (req.body.username === "username" && req.body.password === "password") {
        res.redirect("/dashboard");
    }
    else {
        res.redirect("/");
    }
}) 

app.post("/register", (req, res) => {
    console.log(req.body);
    //to do: check db if username is taken if not then, then send the created user to the database then back to login
    if (req.body.username && req.body.avatar && req.body.password && req.body.confirmPassword) {
        //to do: add to database
        res.redirect("/");
    }
   
}) 
/*
app.get("/logout", (req, res) => {  
    res.redirect("/"); 
}); */