const { type } = require('express/lib/response')
const mongoose =require('mongoose')
const { required } = require('nodemon/lib/config')

const Schema = mongoose.Schema

const OderShema =new Schema({
    products:[
        {
            product:{type:Object,required:true},
            quantity:{ type:Number, required:true }
       }
    ],
    user:{
          name:{
              type:String,
              required:true
          },
         MoBileNumber:{
              type:Number,
              required:true,
              min:[10,'10 digit number ']
         },
         Address:{
            pinCode:{
                type:Number,
                required:true,
                min:[6,'min 6 digit are rqeuired']
            },
            address:{
                type:String,
                required:true
            },
            town:{
                   type:String,
                   required:true
            },
           city:{
               type:String,
               required:true
           },
           state:{
               type:String,
               required:true
           }

         },
          UserId:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        }
    }
   
},{ timestamps:true})



module.exports =mongoose.model('Oder',OderShema)