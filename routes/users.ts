import express from 'express';
import { Container } from 'typedi';

import { UsersController } from '../controllers/index';

export const router = express.Router();
const usersController: UsersController = Container.get(UsersController);

router.param('id', usersController.findUserById.bind(usersController));

/**
 * GET get users
 */
router.get('/', usersController.getUsers.bind(usersController));

/**
 * GET get user by id
 */
router.get('/:id', usersController.getUserById.bind(usersController));

/**
 * POST create new user
 */
router.post('/', usersController.createNewUser.bind(usersController));

/**
 * PATCH update user
 */
router.patch('/:id', usersController.updateUser.bind(usersController));

/**
 * DELETE remove user
 */
router.delete('/:id', usersController.deleteUser.bind(usersController));
