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
         const {userId}=req.user 
         const productId =req.query.productid
         const product  =await Product.findById(productId)
         const qty =product.net_quantity*1
         if(qty<=0){
                res.status(200).json({
                    message:'Out of Stocks'
                })
         }else{
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
    
         }
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


  exports.BuyOder=async(req,res,next)=>{
       Product.findById(req.query.id)
         .then(async product=>{
             const qty =product.net_quantity*1
             if(qty>0){
                  const products={
                      product:product,
                      quantity:req.body.quantity
                  }
                   await 
                       Product
                             .findOneAndUpdate(
                                        req.query.id,
                                        {net_quantity:(qty*1)-req.body.quantity},
                                        {new:true}
                                    )
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
                            UserId:req.user.userId
                        },
                        products:products
                    })
                    oder.save()
                    res.status(202).json({
                        message:"Oder is SucessFully Placed",
                        oder
                    })
             }else{
                res.status(200).json({
                        message:'Out of Stocks'
                    })
             }
         })
         .catch(err=>{
             res.status(500)
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




 exports.CancelOder=async(req,res,next)=>{

         Oder.findById(req.query.id)
            .then(async oder=>{
                let date =oder.updatedAt.toString()
                let days=new Date()-new Date(date)
                  
                let checkdays =Math.floor(days/1000/60/60/24)
                if(checkdays>=5){
                       res.status(201).json({
                           message:'Your Oder is shipped  && Your Oder Not Be cancel'
                       })
                }else{
                 const cancleOder =  await Oder.findByIdAndDelete(req.params.id)
                   res.status(202).json({
                       message:'Oder Cancel Sucessfullly'
                   })
                }
            })
            .catch(err=>{
                msg:'Plase try again'
            }) 
 }

