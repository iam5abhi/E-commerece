const Product =require('../models/Product')


 exports.addProduct =async(req,res,next)=>{
     try{
        const {title,price,description,imageurl,userId} =req.body
        const product = await Product.create({title,price,description,imageurl,userId})
        console.log("product",product)
        res.status(201).json({
            message:'Product Added Sucssfully',
            product
        })

     }catch(err){
         console.log(err)
     }
 }


 exports.GetProducts =(req,res,next)=>{
      Product.find().populate('userId','name')
            .then(product=>{
                res.status(200).json({
                    product
                })
            })
            .catch((err)=>{
                res.status(500).json({
                    message:err
                })
            })
 }


 exports.getAProduct =(req,res,next)=>{
      const {title,price} =req.query
      Product.find({$or:[{title:title},{price:price}]})
         .then((product)=>{
             res.status(200).json({
                 product
             })
         })
         .catch((err)=>{
            res.status(500).json({
                message:err
            })
         })

 }



 exports.updateProduct =(req,res,next)=>{
     const productId =req.params.id
     Product.findById(productId)
       .then((product)=>{
           res.status(201).json({
               product
           })
           product.title=req.body.title,
           product.price =req.body.price,
           product.description=req.body.description,
           product.imageurl=req.body.imageurl 
           return product.save()
       }) 
       .catch((err)=>{
            res.status(500).json({
                message:err
            })
       })
 }



 exports.deleteProduct =(req,res,next)=>{
    const productId =req.params.id
    Product.findByIdAndRemove(productId)
    .then(product=>{
        console.log(product),
        res.status(205).json({
             product
        })
    })
 }