const User =require('../models/User')
const Product =require('../models/Product')
const Oder =require('../models/oder')
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

// this line error
  exports.addToCart =async(req,res,next)=>{
      const  productId = req.query.productid
     
      Product.findById(productId)
        .then(async(product)=>{
             const user = await User.findById('6228a79240f8cd30b1722739')
             return user.additemTocart(product)
        })
        .then((result)=>{
            console.log(result)
        })

   
  }


// exports.addToCart =async(req,res,next)=>{
//     try{
//        const productId =req.query.productid
//        const product  =await Product.findById(productId)
//         console.log(product)
//         const user = await User.findOneAndUpdate('6228a79240f8cd30b1722739')
//          console.log(user.cart.items)
//          let itemIndex
//          if(user){
//             itemIndex = user.cart.items.findIndex(p => p.productId == productId);
//             console.log(itemIndex)
//          }
//          let newQuantity =1
//          const updateCartItems = [...user.cart.items]
         
//          if (itemIndex > -1) {
//             //product exists in the cart, update the quantity
//             let productItem = cart.products[itemIndex];
//             productItem.quantity = quantity;
//             cart.products[itemIndex] = productItem;
//           } else {
//             //product does not exists in cart, add new item
//             user.cart.items.push({
//                 productId:product._id,
//                 quantity:newQuantity
//             });
//           }
//           const updatecart={
//             items:updateCartItems
//         }
//         user.cart =updatecart
//          user.save()
//     }catch(err){
//         console.log("err")
//     }
// }



exports.getCart =(req,res,next)=>{
    User
       .findById('6228a79240f8cd30b1722739')
       .populate('cart.items.productId')
       .then(product=>{
           console.log(product)
       })
      .catch(err=>{console.log(err)})
     
}


exports.deleteCart =async(req,res,next)=>{
    const  productId = req.query.productid
    const user = await  User.findById('6228a79240f8cd30b1722739')
    user.removeTocart(productId)
     .then(result=>{
         console.log('Delete Sucessfully')
     })
     .catch(err=>{
         console.log('err')
     })

}



exports.PostOder=(req,res,next)=>{

    User
       .findById('6228a79240f8cd30b1722739')
       .populate('cart.items.productId')
       .then(user=>{
           const product =user.cart.items.map((items)=>{
               return {quantity:items.quantity,product:{...items.productId._doc}}
            })
           const oder = new Oder({
                user:{
                    name:"vikas",
                    UserId:"6228a79240f8cd30b1722739"
                },
                products:product
            })
        oder.save()
      })
      .then(result=>{
         const user = await User.findById('6228a79240f8cd30b1722739')
         return user.clearCart()
          console.log(result)
        })
      .catch(err=>{console.log(err)})
        
}

