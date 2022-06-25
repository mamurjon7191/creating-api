const express = require('express');

const userController = require('../controllers/userController');

const authController = require('../controllers/authController');

const userRouter = express.Router();

userRouter.route('/signup').post(authController.signup);

userRouter
  .route('/')
  .get(userController.getAlluser)
  .post(userController.postAlluser);

userRouter
  .route('/:id')
  .delete(userController.deleteUser)
  .patch(userController.updateUser)
  .get(userController.getUserById);

module.exports = userRouter;
