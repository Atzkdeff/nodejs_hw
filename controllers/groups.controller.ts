import Joi, { ValidationResult } from '@hapi/joi';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

import { IGroup } from '../interfaces/index';
import { GroupsService } from '../services/index';
import { groupPermissions } from '../constants';

interface IGroupRequest extends Request {
    group?: IGroup;
}

const groupCreateSchema: Joi.ObjectSchema = Joi.object({
    id: Joi.forbidden(),
    name: Joi.string()
        .required()
        .trim(),
    permissions: Joi.array()
        .items(Joi.string().valid(...groupPermissions))
        .unique()
        .required()
});

const groupUpdateSchema: Joi.ObjectSchema = Joi.object({
    id: Joi.forbidden(),
    name: Joi.string().trim(),
    permissions: Joi.array()
        .items(Joi.string().valid(...groupPermissions))
        .unique()
});

const usersIdsSchema: Joi.ObjectSchema = Joi.object({
    userIds: Joi.array()
        .required()
        .items(Joi.string())
        .unique()
});

const groupsService: GroupsService = Container.get(GroupsService);

export async function findGroupById(req: IGroupRequest, res: Response, next: NextFunction, id: string): Promise<void> {
    try {
        req.group = await groupsService.getGroupById(id);
        next();
    } catch (e) {
        res.status(500).send(e.message);
    }
}

export async function getGroups(req: Request, res: Response): Promise<void> {
    try {
        const groups = await groupsService.getGroups();
        res.send(groups);
    } catch (e) {
        res.status(500).send(e.message);
    }
}

export function getGroupById(req: IGroupRequest, res: Response): void {
    if (req.group) {
        res.json(req.group);
    } else {
        res.status(404).json({ message: `Group with id='${req.params.id}' not found` });
    }
}

export function createNewGroup(req: Request, res: Response): void {
    const result: ValidationResult<IGroup> = groupCreateSchema.validate(req.body, { abortEarly: false });

    if (!!result.error) {
        res.status(400).send(result.error.details);
        return;
    }

    groupsService
        .createNewGroup(result.value)
        .then((group) => res.status(201).send(group))
        .catch((error: Error) => {
            if (error.message === 'existing_group_exception') {
                res.status(400).send('This group has already been registered');
            } else {
                res.status(500).send(error.message);
            }
        });
}

export function updateGroup(req: IGroupRequest, res: Response): void {
    const result: ValidationResult<IGroup> = groupUpdateSchema.validate(req.body, { abortEarly: false });

    if (!req.group) {
        res.status(404).send('There is no such group in db');
    } else if (!!result.error) {
        res.status(400).send(result.error.details);
    } else {
        groupsService
            .updateGroup({ ...result.value, id: req.group.id })
            .then((group: IGroup) => res.send(group))
            .catch((error: Error) => res.status(500).send(error.message));
    }
}

export function deleteGroup(req: IGroupRequest, res: Response): void {
    if (!req.group) {
        res.status(404).send('There is no such group in db');
        return;
    }

    groupsService
        .deleteGroup(req.params.id)
        .then(() => res.send())
        .catch(() => res.status(500).send());
}

export function addUsersToGroup(req: IGroupRequest, res: Response): void {
    if (!req.group) {
        res.status(404).send('There is no such group in db');
        return;
    }

    const result: ValidationResult<{ userIds: string[] }> = usersIdsSchema.validate(req.body);

    if (!!result.error) {
        res.status(400).send(result.error.details);
        return;
    }

    groupsService
        .addUsersToGroup(req.group.id, result.value.userIds)
        .then(() => res.send())
        .catch((error) => res.status(500).send(error));
}
