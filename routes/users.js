import express from 'express';

import { UsersController } from '../controllers/index.js';

export const router = express.Router();
const usersController = new UsersController();

router.param('id', usersController.findUserById);

/**
 * GET get users
 */
router.get('/', usersController.getUsers);

/**
 * GET get user by id
 */
router.get('/:id', usersController.getUserById);

/**
 * POST create new user
 */
router.post('/', usersController.createNewUser);

/**
 * PATCH update user
 */
router.patch('/:id', usersController.updateUser);

/**
 * DELETE remove user
 */
router.delete('/:id', usersController.deleteUser);
