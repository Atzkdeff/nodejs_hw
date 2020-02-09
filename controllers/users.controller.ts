import Joi, { ValidationResult } from '@hapi/joi';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

import { IUser } from '../interfaces/index';
import { UsersService } from '../services/index';

interface IUserRequest extends Request {
    user?: IUser;
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

export async function findUserById(req: IUserRequest, res: Response, next: NextFunction, id: string): Promise<void> {
    try {
        req.user = await userService.getUserById(id);
        next();
    } catch (e) {
        res.status(500).send(e.message);
    }
}

export async function getUsers(req: Request, res: Response): Promise<void> {
    try {
        const limit: string = req.query.limit;
        const loginSubstring: string = req.query.loginSubstring;
        const users = await userService.getUsers(limit, loginSubstring);
        res.send(users);
    } catch (e) {
        res.status(500).send(e.message);
    }
}

export function getUserById(req: IUserRequest, res: Response): void {
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(404).json({ message: `User with id='${req.params.id}' not found` });
    }
}

export function createNewUser(req: Request, res: Response): void {
    const result: ValidationResult<IUser> = userCreateSchema.validate(req.body, { abortEarly: false });

    if (!!result.error) {
        res.status(400).send(result.error.details);
        return;
    }

    userService
        .createNewUser(result.value)
        .then((user) => res.status(201).send(user))
        .catch((error: Error) => {
            if (error.message === 'existing_user_exception') {
                res.status(400).send('This login has already been registered');
            } else {
                res.status(500).send(error.message);
            }
        });
}

export function updateUser(req: IUserRequest, res: Response): void {
    const result: ValidationResult<IUser> = userUpdateSchema.validate(req.body, { abortEarly: false });

    if (!req.user) {
        res.status(404).send('There is no such user in db');
    } else if (!!result.error) {
        res.status(400).send(result.error.details);
    } else {
        userService
            .updateUser({ ...result.value, id: req.user.id })
            .then((user: IUser) => res.send(user))
            .catch((error: Error) => res.status(500).send(error.message));
    }
}

export function deleteUser(req: IUserRequest, res: Response): void {
    if (!req.user) {
        res.status(404).send('There is no such user in db');
        return;
    }

    userService
        .deleteUser(req.params.id)
        .then(() => res.send())
        .catch(() => res.status(500).send());
}
