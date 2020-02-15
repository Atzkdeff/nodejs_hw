import express from 'express';

import { GroupsController } from '../controllers/index';

export const router = express.Router();

router.param('id', GroupsController.findGroupById);

/**
 * GET get groups
 */
router.get('/', GroupsController.getGroups);

/**
 * GET get group by id
 */
router.get('/:id', GroupsController.getGroupById);

/**
 * POST create new group
 */
router.post('/', GroupsController.createNewGroup);

/**
 * PATCH update group
 */
router.patch('/:id', GroupsController.updateGroup);

/**
 * DELETE remove group
 */
router.delete('/:id', GroupsController.deleteGroup);

/**
 *  POST add users to a group
 */
router.post('/addUsersToGroup/:id', GroupsController.addUsersToGroup);
