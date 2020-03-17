import express from 'express';

import { GroupsController } from '../controllers/index';

export const router = express.Router();

let groupsController: GroupsController = new GroupsController();

router.param('id', groupsController.findGroupById);

/**
 * GET get groups
 */
router.get('/', groupsController.getGroups);

/**
 * GET get group by id
 */
router.get('/:id', groupsController.getGroupById);

/**
 * POST create new group
 */
router.post('/', groupsController.createNewGroup);

/**
 * PATCH update group
 */
router.patch('/:id', groupsController.updateGroup);

/**
 * DELETE remove group
 */
router.delete('/:id', groupsController.deleteGroup);

/**
 *  POST add users to a group
 */
router.post('/addUsersToGroup/:id', groupsController.addUsersToGroup);
