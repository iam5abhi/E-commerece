const express =require('express')
const shopController =require('../controllers/ShopController')
const router = express.Router()
const upload =require('../utils/upload')
const IsadminAuthentication =require('../middleware/ADminAuthentication')

router
    .route('/admin/signup')
    .post(shopController.admin)



router
    .route('/admin/login')   
    .post(shopController.login) 

router
    .route('/')
    .post(IsadminAuthentication,upload.fields([{ name: 'imagesUrl', maxCount: 5}]),shopController.addProduct)


router
    .route('/Allproducts') 
    .get(shopController.GetProducts)   



router
    .route('/product')    
    .get(shopController.getAProduct)




router
     .route('/update-product')    
     .patch(IsadminAuthentication,upload.single('coverimage'),shopController.updateProduct)


 router
     .route('/delete-product/:id')    
     .delete(IsadminAuthentication,shopController.deleteProduct)
     
     
router
     .route('/check-oders-details')  
     .get(IsadminAuthentication,shopController.getOders)   


router
    .route('/getOder')
    .get(IsadminAuthentication,shopController.getParticularOdersdetails)     


module.exports =router