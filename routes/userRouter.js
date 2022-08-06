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

userRouter.route('/updateMe').patch(
  authController.protect,
  userController.uploadUserImage, // --> req.file hosil qilindi
  userController.resizeImage,
  userController.updateMe
);

userRouter
  .route('/deleteMe')
  .delete(authController.protect, userController.deleteMe);

///////////////////////////////////////////////////////////////////////////////
userRouter
  .route('/')
  .get(
    authController.protect,
    authController.role(['admin', 'lead-guide', 'guide']),
    userController.getAlluser
  )
  .post(
    authController.protect,
    authController.role(['admin', 'lead-guide']),
    userController.postAlluser
  );

userRouter
  .route('/:id')
  .delete(
    authController.protect,
    authController.role(['admin', 'lead-guide']),
    userController.deleteUser
  )
  .patch(
    authController.protect,
    authController.role(['admin', 'lead-guide']),
    userController.updateUser
  )
  .get(
    authController.protect,
    authController.role(['admin', 'lead-guide']),
    userController.getUserById
  );

module.exports = userRouter;
