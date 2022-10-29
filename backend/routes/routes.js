const express=require('express');
const controllers=require('../controllers/controllers');
const router=express.Router();
const {body}=require('express-validator');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const userController=require('../controllers/userscontroller');

router.post('/login',
[body('email').isEmail().not().isEmpty().withMessage('Email is empty').isLength({min:3,max:100}),
body('password').notEmpty().withMessage('Password Not Empty').isLength({min:5,max:10}).isAlphanumeric()],
controllers.createUser);
router.post('/users',controllers.getUsers);
router.post('/messages',controllers.messages);
router.post('/authorize',authorize);
router.post("/get-users",userController.getAllUsers);
router.post('/last-message',userController.lastMessage);
router.post('/search-users',userController.searchUsers);
module.exports=router;