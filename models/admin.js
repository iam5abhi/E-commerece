const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const { model } = require('../db/Db')


const Schema   =mongoose.Schema

const AdminSchema=  mongoose.Schema({
    name:{
        type:String,
        required:true
       
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim: true,
        lowercase:true,

    },
    Password:{
          type:String,
          required:true,
    },
    confirmPassword:{
          type:String,
          required:true
          
    },
},{ timestamps:true })



AdminSchema.pre('save', async function(next) {

    if(!this.isModified("Password"))return next()
    
    //hash the password with cost of 10
    this.Password  =await bcrypt.hash( this.Password,10)

    //Delete password  with PasswordCofirm filed  
    this.confirmPassword =undefined
})


 //Compare the Password
 AdminSchema.methods.correctPassword = async function(
    candidatePassword,userpassword
    ) 
    {
        console.log(candidatePassword,userpassword,"codesoftic pvt ltd company")
    return await bcrypt.compare(candidatePassword,userpassword)
    }

module.exports =new mongoose.model('Admin',AdminSchema)