import express from 'express';

import { UsersController } from '../controllers/index';

const usersController: UsersController = new UsersController();

export const router = express.Router();

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
