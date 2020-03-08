import Joi, { ValidationResult } from '@hapi/joi';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Model } from 'sequelize';

import { IUser } from '../interfaces/index';
import { UsersService } from '../services/index';
import { HttpRequestError, handleError } from '../utils/index';

interface IUserRequest extends Request {
    user?: IUser & Model;
}

const userCreateSchema: Joi.ObjectSchema = Joi.object({
    id: Joi.forbidden(),
    login: Joi.string()
        .required()
        .trim(),
    password: Joi.string()
        .required()
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, 'password pattern')
        .min(8),
    age: Joi.number()
        .required()
        .positive()
        .integer()
        .min(4)
        .max(130),
    groups: Joi.array().items(Joi.string())
});

const userUpdateSchema: Joi.ObjectSchema = Joi.object({
    id: Joi.forbidden(),
    login: Joi.string().trim(),
    password: Joi.string()
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, 'password pattern')
        .min(8),
    age: Joi.number()
        .positive()
        .integer()
        .min(4)
        .max(130),
    groups: Joi.array().items(Joi.string())
});

const userService: UsersService = Container.get(UsersService);

export class UsersController {
    // private userService: UsersService;
    //
    // constructor() {
    //     this.userService = Container.get(UsersService);
    // }

    @handleError
    public async findUserById(req: IUserRequest, res: Response, next: NextFunction, id: string): Promise<void> {
        req.user = await userService.getUserById(id);
        next();
    }

    @handleError
    public async getUsers(req: Request, res: Response): Promise<void> {
        const limit: string = req.query.limit;
        const loginSubstring: string = req.query.loginSubstring;
        const users = await userService.getUsers(limit, loginSubstring);
        res.send(users);
    }

    @handleError
    public getUserById(req: IUserRequest, res: Response): void {
        if (req.user) {
            res.json(req.user);
        } else {
            throw new HttpRequestError(404, `User with id='${req.params.id}' not found`);
        }
    }

    @handleError
    public async createNewUser(req: Request, res: Response): Promise<void> {
        const result: ValidationResult<IUser> = userCreateSchema.validate(req.body, { abortEarly: false });
        try {
            if (!!result.error) {
                res.status(400).send(result.error.details);
                return;
            }

            let newUser: IUser = await userService.createNewUser(result.value);

            res.status(201).send(newUser);
        } catch (error) {
            if (error.message === 'existing_user_exception') {
                throw new HttpRequestError(400, 'This login has already been registered');
            } else {
                throw error;
            }
        }
    }

    @handleError
    public async updateUser(req: IUserRequest, res: Response): Promise<void> {
        const result: ValidationResult<IUser> = userUpdateSchema.validate(req.body, { abortEarly: false });

        if (!req.user) {
            throw new HttpRequestError(404, 'There is no such user in db');
        } else if (!!result.error) {
            throw new HttpRequestError(400, 'Form validation error');
        } else {
            let updatedUser: IUser = await userService.updateUser({ ...result.value, id: req.user.id });
            res.send(updatedUser);
        }
    }

    @handleError
    public async deleteUser(req: IUserRequest, res: Response): Promise<void> {
        if (!req.user) {
            throw new HttpRequestError(404, 'There is no such user in db');
        }

        await userService.deleteUser(req.user);
        res.send();
    }
}
