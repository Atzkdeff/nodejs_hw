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

    public async findUserById(req: IUserRequest, res: Response, next: NextFunction, id: string): Promise<void> {
        req.user = await this.userService.getUserById(id);
        next();
    }

    public async getUsers(req: Request, res: Response): Promise<void> {
        const limit: string = req.query.limit;
        const loginSubstring: string = req.query.loginSubstring;
        const users = await this.userService.getUsers(limit, loginSubstring);
        res.send(users);
    }

    public getUserById(req: IUserRequest, res: Response): void {
        if (req.user) {
            res.json(req.user);
        } else {
            res.status(404).json({ message: `User with id='${req.params.id}' not found` });
        }
    }

    public createNewUser(req: Request, res: Response): void {
        const result: ValidationResult<IUser> = userSchema.validate(req.body, { abortEarly: false });

        if (!!result.error) {
            res.status(400).send(result.error.details);
            return;
        }

        this.userService
            .createNewUser(result.value)
            .then((user) => res.status(201).send(user))
            .catch((error: Error) => res.status(400).send(error.message));
    }

    public updateUser(req: IUserRequest, res: Response): void {
        const result: ValidationResult<IUser> = userSchema.validate(req.body, { abortEarly: false });

        if (!req.user) {
            res.status(404).send('There is no such user in db');
        } else if (!!result.error) {
            res.status(400).send(result.error.details);
        } else {
            this.userService
                .updateUser({ ...result.value, id: req.user.id })
                .then((user: IUser) => res.send(user))
                .catch((error: Error) => res.status(400).send(error.message));
        }
    }

    public deleteUser(req: IUserRequest, res: Response): void {
        if (!req.user) {
            res.status(404).send('There is no such user in db');
            return;
        }

        this.userService
            .deleteUser(req.params.id)
            .then(() => res.send())
            .catch(() => res.status(404).send());
    }
}
