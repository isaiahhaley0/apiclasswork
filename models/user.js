"use strict"
const passportlocalMongoose= require("passport-local-mongoose");


const mongoose = require("mongoose"),
{Schema} = require("mongoose"),
Subscriber = require("./subscriber"),

userSchema = new Schema(
    {
        firstName:{
            type: String,
            required: true
        },
        lastName:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        zipCode:{
            type: Number,
            min: [10000,"zip code too short"],
            max: [99999]
        },

        subscribedAccount: {type: Schema.Types.ObjectId, ref: Subscriber},
        courses: [{type: Schema.Types.ObjectId, ref: Course}]

    },
    {
        timestaps: true
    }
)

userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`
});

userSchema.pre("save", function (){
    let user = this;
    if(user.subscribedAccount == undefined){
        Subscriber.findOne({
            email: user.email
        })
        .then(subscriber =>{
            user.subscribedAccount = subscriber;
            next();
        })
        .catch(error =>{
            console.log(`Error associating subscriber: ${error.message}`)
        })
    }
    else{
        next();
    }
})
userSchema.plugin(passportlocalMongoose,{
    usernameField:"email"
});

module.exports = mongoose.model("User", userSchema);