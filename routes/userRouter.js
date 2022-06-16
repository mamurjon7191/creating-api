const express = require('express');

const userController = require('../controllers/userController');

const userRouter = express.Router();

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
