const express = require('express');

const userController = require('../controllers/userController');

const authController = require('../controllers/authController');

const userRouter = express.Router();

userRouter.route('/signup').post(authController.signup);

userRouter.route('/signin').post(authController.login);

userRouter.route('/forgotpassword').post(authController.forgotPassword);

userRouter.route('/resetPassword/:token').post(authController.resetPassword);

userRouter
  .route('/updateMyPassword')
  .patch(authController.protect, userController.updateMyPassword);

userRouter
  .route('/updateMe')
  .patch(authController.protect, userController.updateMe);

userRouter
  .route('/deleteMe')
  .delete(authController.protect, userController.deleteMe);

///////////////////////////////////////////////////////////////////////////////
userRouter
  .route('/')
  .get(authController.protect, userController.getAlluser)
  .post(authController.protect, userController.postAlluser);

userRouter
  .route('/:id')
  .delete(
    authController.protect,
    authController.role(['admin', 'team-lead']),
    userController.deleteUser
  )
  .patch(authController.protect, userController.updateUser)
  .get(authController.protect, userController.getUserById);

module.exports = userRouter;
