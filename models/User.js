const mongoose =require('mongoose')
const bcrypt = require('bcrypt');


const Schema = mongoose.Schema

var UserSchema =  mongoose.Schema({
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
          required:true
    },
    confirmPassword:{
          type:String,
          required:true
          
    },
    cart:{
        items:[
           {
                productId:{type:Schema.Types.ObjectId, ref:'Product',required:true},
                quantity:{ type:Number, required:true }
           }
        ]
    },
    isCreated:{
        type:Date,
        default:Date.now().toString(),
        select:false
    },
    active:{
        type:Boolean,
        default:true,
        select:false
    }
})



UserSchema.pre('save', async function(next) {

    if(!this.isModified("Password"))return next()
    
    //hash the password with cost of 10
    this.Password  =await bcrypt.hash( this.Password,10)

    //Delete password  with PasswordCofirm filed  
    this.confirmPassword =undefined
})


 UserSchema.methods.additemTocart =function(product){
     console.log(product)
     console.log(this.cart.items)
        const cartProductIndex =this.cart.items.findIndex(cp=>{
            return cp.productId.toString() ===product._id.toString()
        });
        let newQuantity =1
        const updateCartItems = [...this.cart.items]

        if(cartProductIndex>=0){
            newQuantity=this.cart.items[cartProductIndex].quantity+1
            updateCartItems[cartProductIndex].quantity =newQuantity
        }else{
            updateCartItems.push({
            productId:product._id,
            quantity:newQuantity
          })
        }
        const updatecart={
            items:updateCartItems
        }
        
        this.cart =updatecart

        return this.save()
             
 }


 UserSchema.methods.removeTocart =function(productId){
   
   const updateCartItems  =thsi.cart.items.filter(items=>{
       return items.productId.toString() !==productId.toString()
   })

   this.cart.items =updateCartItems
   this.save()
 }



 UserSchema.methods.clearCart =function(){
     this.cart={items:[]}
     return this.save()
 }




const User =new mongoose.model("User",UserSchema)

module.exports =User




