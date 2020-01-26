import Joi, { ValidationResult } from '@hapi/joi';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

import { IUser } from '../interfaces/index';
import { UsersService } from '../services/index';

interface IUserRequest extends Request {
    user?: IUser;
}

const userSchema: Joi.ObjectSchema = Joi.object({
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
    isDeleted: Joi.forbidden()
});

export class UsersController {
    private userService: UsersService;

    constructor() {
        this.userService = Container.get(UsersService);
    }

    public findUserById(req: IUserRequest, res: Response, next: NextFunction, id: string): void {
        req.user = this.userService.getUserById(id);
        next();
    }

    public getUsers(req: Request, res: Response): void {
        const limit: number = !req.query.limit ? undefined : Number(req.query.limit);
        const loginSubstring: string = req.query.loginSubstring === '' ? undefined : req.query.loginSubstring;
        this.userService.getUsers(limit, loginSubstring);
        res.send();
    }

    public getUserById(req: IUserRequest, res: Response): void {
        if (req.user && !req.user.isDeleted) {
            res.json(req.user);
        } else {
            res.status(404).json({ message: `User with id='${req.params.id}' not found` });
        }
    }

    public createNewUser(req: Request, res: Response): void {
        // const result: ValidationResult = userSchema.validate(req.body, { abortEarly: false });
        //
        // if (!!result.error) {
        //     res.status(400).send(result.error.details);
        //     return;
        // }
        //
        // const existingUser: IUser = this.userService.getUserByLogin(result.value.login);
        //
        // if (!existingUser || existingUser.isDeleted) {
        let user: IUser = this.userService.createNewUser(undefined);
        res.status(201).send(user);
        // } else {
        //     res.status(400).send('This login has already been registered');
        // }
    }

    public updateUser(req: IUserRequest, res: Response): void {
        const result: ValidationResult = userSchema.validate(req.body, { abortEarly: false });

        if (!req.user || req.user.isDeleted) {
            res.status(404).send('There is no such user in db');
        } else if (!!result.error) {
            res.status(400).send(result.error.details);
        } else {
            let user: IUser = this.userService.updateUser(result);
            res.send(user);
        }
    }

    public deleteUser(req: IUserRequest, res: Response): void {
        if (!req.user) {
            res.status(404).send('There is no such user in db');
        } else if (req.user.isDeleted) {
            res.status(405).send('User has already been deleted. Action cannot be applied');
        } else {
            res.send();
        }
    }
}
