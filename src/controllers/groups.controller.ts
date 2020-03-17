import Joi, { ValidationResult } from '@hapi/joi';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Model } from 'sequelize';

import { IGroup } from '../interfaces/index';
import { GroupsService } from '../services/index';
import { groupPermissions } from '../constants';
import { HttpRequestError, handleError } from '../utils/index';

interface IGroupRequest extends Request {
    group?: IGroup & Model;
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

export class GroupsController {
    @handleError
    public async findGroupById(req: IGroupRequest, res: Response, next: NextFunction, id: string): Promise<void> {
        req.group = await groupsService.getGroupById(id);
        next();
    }

    @handleError
    public async getGroups(req: Request, res: Response): Promise<void> {
        const groups = await groupsService.getGroups();
        res.send(groups);
    }

    @handleError
    public getGroupById(req: IGroupRequest, res: Response): void {
        if (req.group) {
            res.json(req.group);
        } else {
            throw new HttpRequestError(404, `Group with id='${req.params.id}' not found`);
        }
    }

    @handleError
    public async createNewGroup(req: Request, res: Response): Promise<void> {
        try {
            const result: ValidationResult<IGroup> = groupCreateSchema.validate(req.body, { abortEarly: false });

            if (!!result.error) {
                res.status(400).send(result.error.details);
                return;
            }

            let newGroup: IGroup = await groupsService.createNewGroup(result.value);
            res.status(201).send(newGroup);
        } catch (e) {
            if (e.message === 'existing_group_exception') {
                throw new HttpRequestError(400, 'This group has already been registered');
            } else {
                throw e;
            }
        }
    }

    @handleError
    public async updateGroup(req: IGroupRequest, res: Response): Promise<void> {
        const result: ValidationResult<IGroup> = groupUpdateSchema.validate(req.body, { abortEarly: false });

        if (!req.group) {
            throw new HttpRequestError(404, 'There is no such group in db');
        } else if (!!result.error) {
            throw new HttpRequestError(400, 'Form validation error');
        } else {
            let updatedGroup: IGroup = await groupsService.updateGroup({ ...result.value, id: req.group.id });
            res.send(updatedGroup);
        }
    }

    @handleError
    public async deleteGroup(req: IGroupRequest, res: Response): Promise<void> {
        if (!req.group) {
            throw new HttpRequestError(404, 'There is no such group in db');
        }

        await groupsService.deleteGroup(req.params.id);
        res.send();
    }

    @handleError
    public async addUsersToGroup(req: IGroupRequest, res: Response): Promise<void> {
        if (!req.group) {
            throw new HttpRequestError(404, 'There is no such group in db');
        }

        const result: ValidationResult<{ userIds: string[] }> = usersIdsSchema.validate(req.body);

        if (!!result.error) {
            throw new HttpRequestError(400, 'Validation error');
        }

        await groupsService.addUsersToGroup(req.group, result.value.userIds);
        res.send();
    }
}
