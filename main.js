"use strict";

const express = require('express'), app = express(),

router = require("./routes/index"),
    layouts = require("express-ejs-layouts"),
methodOverride = require("method-override"),

mongoose = require("mongoose"),

passport = require("passport"),
    cookieParser = require("cookie-parser"),
    expressSession = require("express-session"),
    expressValidator = require("express-validator"),
    connectFlash = require("connect-flash"),
    User = require("./models/user");




mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser: true, useUnifiedTopology: true })

app.set("port",process.env.PORT||3000);
mongoose.set("useCreateIndex",true);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(layouts);

app.use(methodOverride("_method",{methods: ["POST","GET"]}));

app.use(express.static("public")) ;
app.use(expressValidator());

app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(express.json());

app.use(cookieParser("my_passcode"));
app.use(expressSession({
    secret: "my_passcode",
    cookie:{
        maxAge: 360000
    },
    resave: false,
    saveUninitialized: false
}));
app.use(connectFlash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

app.use((req,res,next)=>{
    res.locals.flashMessages = req.flash();
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    next();
})






app.use("/",router);
app.listen(app.get("port"), ()=>{

    console.log(`Server is running on port: ${app.get("port")}`)

});