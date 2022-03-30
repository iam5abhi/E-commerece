const User =require('../models/User')
const Product =require('../models/Product')
const Oder =require('../models/oder')
const jwt =require('jsonwebtoken')
const SecretKey =process.env.SERCRETKEY



exports.createUser =(req,res,next)=>{
  const user =new User({
      name:req.body.name,
      email:req.body.email,
      Password:req.body.Password,
      confirmPassword:req.body.confirmPassword,
      cart:{
          items:[]
      }
  })
  user.save()
    .then(result=>{
        res.status(201).json({
            result
        })
    })
    .catch(err=>{
        res.status(500).json({
            message:err
        })
    })
}

exports.loginUser =async(req,res,next)=>{
     console.log("hello")
    const {email,Password}=req.body
    if(!email || !Password){
        res
        .status(400)
        .json({
             message:'please provide the email && password',
        })
    }
    User.findOne({email:email})
      .then(async user=>{
                if(!user){
                    res.status(401).json({
                        message:'Invalid login credentials',
                    })
            }
          const correct = await user.correctPassword(Password,user.Password)

            if(correct==true){
                const token = jwt.sign({
                    userId:user.id,
                    name:user.name,
                    email:user.email
              },SecretKey,{ expiresIn :'1h' }) 
                    res.status(200).json({
                        userId:user.id,
                        name:user.name,
                        email:user.email,
                        token:token
                        
                    })

            }else{
                res.status(401).json({
                    satusCode:401,
                    message:'Invalid login credentials',
                })
            }  
      })
      .catch(err=>{
          console.log(err)
      })
}


 exports.addToCart =async(req,res,next)=>{
     try{ 
         console.log(req.user,"vikkaa ")
        const {userId}=req.user 
        const productId =req.query.productid
        console.log(productId,"hkhjh")
        const product  =await Product.findById(productId)
         const user = await User.findById(userId)
          let itemIndex
          if(user){
             itemIndex = user.cart.items.findIndex(p => p.productId == productId);
          }
          let newQuantity =1
          const updateCartItems = [...user.cart.items]
          if (itemIndex > -1) {
             newQuantity =user.cart.items[itemIndex].quantity+1
             updateCartItems[itemIndex].quantity =newQuantity
           } else {
             //product does not exists in cart, add new item
             updateCartItems.push({
                 productId:product._id,
                 quantity:newQuantity
             });
           }
           const updatecart={
             items:updateCartItems
         }
        User.findOneAndUpdate(userId,{cart:updatecart},{new:true})
          .then(result=>{
              res.status(202).json({
                result
              })
          })
          .catch(err=>{
              res.status(500).json({
                  err
              })
          })

     }catch(err){
         console.log("err")
     }
 }



exports.getCart =(req,res,next)=>{
    const {userId}=req.user
    User
       .findById(userId)
       .populate('cart.items.productId')
       .then(product=>{
          res.status(202).json({
                    product
            })
       })
      .catch(err=>{console.log(err)})
     
}


   exports.deleteCart =async(req,res,next)=>{
       const {userId}=req.user
       const  productId = req.query.productid
       const user = await User.findById(userId)
       

    const updateCartItems  =user.cart.items.filter(items=>{
         return items.productId.toString() !==productId.toString()
     })
     User.findOneAndUpdate(userId,{cart:updateCartItems},{new:true})
          .then(result=>{
              res.status(202).json({
                result
              })
          })
          .catch(err=>{
              res.status(500).json({
                  err
              })
          })
    
     
   }


 exports.PostOder=async(req,res,next)=>{
     const {userId}=req.user
     User
        .findById(userId)
        .populate('cart.items.productId')
        .then(user=>{
            const product =user.cart.items.map((items)=>{
                return {quantity:items.quantity,product:{...items.productId._doc}}
             })
            const oder = new Oder({
                 user:{
                     name:req.body.name,
                     MoBileNumber:req.body.MoBileNumber,
                     Address:{
                        pinCode:req.body.pinCode,
                        address:req.body.address,
                        town:req.body.town,
                        city:req.body.city,
                        state:req.body.state
                     },
                     UserId:userId
                 },
                 products:product
             })
         oder.save()
       })
       .then(async result=>{
          User.findOneAndUpdate(userId,{cart:{items:[]}},{new:true})
          .then(result=>{
              res.status(200).json({
                  result
              })
          })
          .catch(err=>{
              res.status(500).json({
                  err
              })
          })
          
         })
       .catch(err=>{console.log(err)})
        
 }


 exports.DeleteOder=(req,res,next)=>{
       Oder.findByIdAndDelete(req.params.id)
       .then(deleteOder=>{
           res.status(205).json({
               msg:'Oder delete Sucessfully'
           })
       })
       .catch(err=>{
            res.status(500).json({
                msg:'Please try again'
            })
       })
 }

