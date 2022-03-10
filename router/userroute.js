const  express =require('express')
const UserController =require('../controllers/UserController')
const router =express.Router()


router.route('/').post(UserController.createUser)

router
   .route('/cart')
   .post(UserController.addToCart)
   .get(UserController.getCart)
   .delete(UserController.deleteCart)


module.exports=router