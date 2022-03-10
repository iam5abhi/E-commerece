const express =require('express')
const shopController =require('../controllers/ShopController')
const router = express.Router()


router
    .route('/')
    .post(shopController.addProduct)


router
    .route('/Allproducts') 
    .get(shopController.GetProducts)   



router
    .route('/product')    
    .get(shopController.getAProduct)




router
     .route('/update-product/:id')    
     .patch(shopController.updateProduct)



     router
     .route('/delete-product/:id')    
     .delete(shopController.deleteProduct)     



module.exports =router