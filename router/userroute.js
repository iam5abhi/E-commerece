const  express =require('express')
const { route } = require('express/lib/application')
const UserController =require('../controllers/UserController')
const IsAuthentication =require('../middleware/userAuthentication')
const router =express.Router()


router.route('/').post(UserController.createUser)
router.route('/login').post(UserController.loginUser)

router
   .route('/cart')
   .patch(IsAuthentication,UserController.addToCart)
   .get(IsAuthentication,UserController.getCart)
   .delete(IsAuthentication,UserController.deleteCart)



 router 
      .route('/oder')
      .post(IsAuthentication,UserController.PostOder)
      .delete(IsAuthentication,UserController.DeleteOder)




module.exports=router