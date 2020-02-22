import express from 'express';

import { UsersController } from '../controllers/index';

export const router = express.Router();

router.param('id', UsersController.findUserById);

/**
 * GET get users
 */
router.get('/', UsersController.getUsers);

/**
 * GET get user by id
 */
router.get('/:id', UsersController.getUserById);

/**
 * POST create new user
 */
router.post('/', UsersController.createNewUser);

/**
 * PATCH update user
 */
router.patch('/:id', UsersController.updateUser);

/**
 * DELETE remove user
 */
router.delete('/:id', UsersController.deleteUser);
