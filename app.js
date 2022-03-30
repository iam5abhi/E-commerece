require("dotenv").config();
const express = require('express')
const db = require('./db/Db')
const admin =require('./router/admin')
const User =require('./router/userroute')
const bodyParser = require('body-parser')
const app =express()


const Port =process.env.PORT || 5000


app.use(express.json())
app.use(express.urlencoded({extended:true}))





app.use('/api',admin)
app.use('/api/user',User)


app.listen(Port,()=>{
    console.log(`Server is Running On Port ${Port}`)
})