const Product =require('../models/Product')
const Admin =require('../models/admin')
const Oder =require('../models/oder')
const  cloudinary =require('../middleware/Cloundnariy')
const jwt =require('jsonwebtoken')
const SecretKey =process.env.SERCRETKEY




exports.admin =(req,res,next)=>{
     
      const admin =new Admin({
          name:req.body.name,
          email:req.body.email,
          Password:req.body.Password,
          confirmPassword:req.body.confirmPassword,
      })
      admin.save()
   
        .then(result=>{
            console.log(result)
            res.status(201).json({
                result
            })
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({
                message:err
            })
        })
}

exports.login =(req,res,next)=>{
    const {email,Password}=req.body
    if(!email || !Password){
        res
        .status(400)
        .json({
             message:'please provide the email && password',
        })
    }
    Admin.findOne({email:email})
      .then(async admin=>{
                if(!admin){
                    res.status(401).json({
                        message:'Invalid login credentials',
                    })
            }
          const correct = await admin.correctPassword(Password,admin.Password)

            if(correct==true){
                const token = jwt.sign({
                    userId:admin.id,
                    name:admin.name,
                    email:admin.email
              },SecretKey,{ expiresIn :'1h' }) 
                    res.status(200).json({
                        userId:admin.id,
                        name:admin.name,
                        email:admin.email,
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
           res.sendStatus(500)
      })
}

 exports.addProduct =async(req,res,next)=>{
     try{
       
              const {
                     productName,
                     maximum_retail_price,
                     imagesUrl,
                     price,
                     discount,
                     company_emails,
                     company_PhoneNumbers,
                     colour,
                     ink_Colour,
                     brand,
                     material,
                     item_Dimensions,
                     manufacturer,
                     model_Number,
                     closure,
                     grip_Type,
                     number_of_Items,
                     size,
                     capacity,
                     point_Type,
                     manufacturer_Part_Number,
                     country_of_Origin,
                     imported_By,
                     ASIN,
                     customer_Reviews,
                     best_sellers_rank,date_first_available, 
                     packer,importer,
                     item_Weight,net_quantity,
                     product_description,
                 }  =req.body
                 if(price<maximum_retail_price){
                    const images =[...req.files.imagesUrl]
                    for(let i=0;i<images.length-1;i++){
                        const locaFilePath = images[i].path
                         cloudinary.uploader.upload(locaFilePath,{
                            use_filename:true,
                            folder:'PRODUCTS',
                            unique_filename:false
                            
                        }).then(data=>{
                            
                        })
                    } 
                    const length =images.length-1
                    const coverimage = (await cloudinary.uploader.upload(images[length].path,{
                               use_filename:true,
                               folder:'COVER_IMAGES',
                               unique_filename:false
                           }))


                       const product = await Product.create({
                                  productName,
                                  maximum_retail_price,
                                  coverImageUrl:coverimage.url,
                                  imagesUrl,
                                  price,
                                  discount,
                                  company_emails,
                                  company_PhoneNumbers,
                                  colour,
                                  ink_Colour,
                                  brand,
                                  material,
                                  item_Dimensions,
                                  manufacturer,
                                  model_Number,
                                  closure,
                                  grip_Type,
                                  number_of_Items,
                                  size,
                                  capacity,
                                  point_Type,
                                  manufacturer_Part_Number,
                                  country_of_Origin,
                                  imported_By,
                                  ASIN,
                                  customer_Reviews,
                                  best_sellers_rank,date_first_available, 
                                  packer,importer,
                                  item_Weight,net_quantity,
                                  product_description,
                                  userId:req.admin.userId,
                                  cloudnary_Id:coverimage.public_id
                          })
                          res.status(201).json({
                              message:'Product Added Sucssfully',
                              product
                          })


                 }else{
                      res.status(405).json({
                           message:'Price is greater than Maximum_Retail_Price ' 
                      })
                 }
     }catch(err){
         console.log(err)
     }
 }



 exports.GetProducts =(req,res,next)=>{
      Product.find().populate('userId','-Password')
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
      const {productName, price} =req.query
      Product.find({$or:[{productName:productName},{price: price}]})
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



 exports.updateProduct =async(req,res,next)=>{
   
     const productId =req.query.id
     const {
        imagesUrl,
        price,
        net_quantity,
       }  =req.body
         Product.findById(productId)
            .then(async product=>{
                if(!product.id && !product.cloudnary_Id){
                    res.status(501).json({
                        message:'Could not be found'
                    })
                }else{
                 cloudinary.uploader.destroy(product.cloudnary_Id)
                     const filename =req.file.path
                     const images = (await cloudinary.uploader.upload(filename,{
                         use_filename:true,
                         folder:'Products',
                         unique_filename:false
                     }))
                     console.log(images,'mukesh')
                    
                     const UpdatedData ={
                         coverImageUrl:images.url,
                         cloudnary_Id:images.public_id,
                         imagesUrl,
                         price,
                         net_quantity,
                     }
                     const updatedProducts =await Product.findOneAndUpdate(productId,{UpdatedData}, {new:true})
                         res.status(202).json({
                             updatedProducts
                         })
                }
                
            })
            .catch(err=>{
                res.status(500).json({
                    message:err
                })
            })
            
 }



 exports.deleteProduct =(req,res,next)=>{
    const productId =req.params.id
      Product.findById(productId)
        .then(async product=>{
             if(!product.id && !product.cloudnary_Id){
                   res.status(501).json({
                       message:'Could not be found'
                   })
             }else{
                console.log(product.id,"vikas")
                cloudinary.uploader.destroy(product.cloudnary_Id)
                const data =    await Product.findByIdAndDelete(product.id)
                res.status(205).json({
                        data
                })
                }
             
        })
    .catch(err=>{
        res.status(500).json({
            message:err
        })
    })
 }




exports.getOders =(req,res,next)=>{
      Oder.find()
       .then(oders=>{
            console.log(oders)
            res.status(202).json({
                oders
        })
       })
       .catch(err=>{
           msg:"Please Try Again"
       })
}


exports.getParticularOdersdetails =()=>{
      Oder.findById(req.query.id)
      .then(oder=>{
        res.status(202).json({
            oder
         })
      })
    .catch(err=>{
        msg:'Plase try again'
    })
}