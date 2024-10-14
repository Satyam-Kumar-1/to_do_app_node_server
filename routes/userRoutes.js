const router=require('express').Router();
const userController=require('../controllers/userController')
const authMiddleware=require('../middleware/authMiddleware')
router.get('/getAllUser',authMiddleware,userController.getAllUsers)
module.exports=router;