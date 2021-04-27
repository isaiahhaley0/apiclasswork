"use strict";
const passport = require("passport");
const User = require("../models/user"),

    getUserParams = body =>{
        return{
            name:{
                first: body.first,
                last: body.last
            },
            email: body.email,
            password: body.password,
            zipCode: body.zipCode
        };
    };
module.exports = {
    login: (req, res)=>{
        res.render("users/login");
    },
    index: (req, res, next) => {
        User.find()
            .then(users => {
                res.locals.users = users;
                next();
            })
            .catch(error => {
                console.log(`Error fethcing user data: ${error.message}`)
            })
    },
    indexView: (req, res) => {
        res.render("users/index");
    },
    new: (req, res) => {
        res.render("users/new")
    },
    create: (req, res, next) => {
        if(req.skip) return next();
        let userParams = getUserParams(req.body);

        let newUser = new User(userParams);


        User.register(newUser, req.body.password, (error,user)=>{
            if(user) {
                req.flash("success", "User account successfully created");
                res.locals.redirect="/users";
                next();
            }
            else{
                req.flash("error", `Failed to create user account ${error.message}`);
                res.locals.redirect="/useers/new";
                next();
            }
            });

    },
    validate: (req, res, next) =>{
        req.sanitizeBody("email").normalizeEmail({
            all_lowercase: true
        }).trim();

        req.check("email","email is not valid!").isEmail();
        req.check("zipCode","Zip Code Is Not Valid").notEmpty().isInt().isLength({min:5,max:5});
        req.check("password","Password can not be empty")

        req.getValidationResult().then((error)=>{if(!error.isEmpty()){
            let messages = error.array().map (e => e.msg);
            req.flash("error",messages.join(" and "));
            req.skip = true;
            res.local.redirect = "/users/new";
            next();
        }
        else next();
        })
    },

    authenticate: passport.authenticate("local",{
        failureRedirect: "/users/login",
        failureFlash: "Login failed! Check your email or password",
        successRedirect: "/",
        successFlash: "Logged in!"
    }),
    logout: (req,res,next)=>{
        res.logout();
        req.flash("success", "you have been logged out!");
        res.locals.redirect = "/";
        next();
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath != undefined) res.redirect(redirectPath);
        else next();
    },
    show: (req, res, next) => {
        let userId = req.params.id;
        User.findById(userId)
            .then(user => {
                res.locals.user = user;
                next();
            })
            .catch(error => {
                console.log(`Error fetching user by ID: ${error.message}`);
                next(error);
            })
    },
    showView: (req, res) => {
        res.render("users/show")
    },
    edit: (req, res, next) => {
        let userId = req.params.id;
        User.findById(userId)
            .then(user => {
                res.render("/users/edit", { user: user });
            })
            .catch(error => {
                console.log(`Error loading user by ID: ${error.message}`);
                next(error);
            })
    },
    update: (req, res, next) => {
        if(req.skip) return next();
        let userId = req.params.id;
        let updatedUser = new user({
            name:{
                first: req.body.first,
                last: req.body.last
            },
            email: req.body.email,
            zipCode: req.body.zipCode,
            password: req.body.password
        })
        User.findByIdAndUpdate(userId, updatedUser)
            .then(user => {
                res.locals.User = user;
                res.local.redirect = `/user/${user._id}`;
                next();
            })
            .catch(error => {
                console.log(`Error fetching user by ID: ${error.message}`);
                next(error);
            })
    },
    delete: (req, res, next) => {
        let userId = req.params.id;
        User.findByIdAndRemove(userId)
            .then(() => {
                res.locals.redirect = "/users";
                next();
            })
            .catch(error => {
                console.log(`Error fetching user by ID: ${error.message}`);
                next(error);
            })
    }
}