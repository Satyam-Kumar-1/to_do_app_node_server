const router=require('express').Router();
const taskController=require('../controllers/taskController')
const authMiddleware=require('../middleware/authMiddleware')
router.post('/post/addtask',authMiddleware,taskController.addTask);
router.get('/get/allIndividualtask',authMiddleware,taskController.getAllIndividualTask);
router.get('/get/allGrouptask',authMiddleware,taskController.getAllGroupTask);
router.put('/update/task/:taskId',authMiddleware,taskController.updateTask);
router.put('/update/taskStatus/:taskId',authMiddleware,taskController.updateTaskStatus);
module.exports=router;