import { Request, Response } from 'express';
import { Container } from 'typedi';

import { IUser } from '../interfaces/index';
import { JwtService, UsersService } from '../services/index';
import { HttpRequestError, handleError } from '../utils/index';

const userService: UsersService = Container.get(UsersService);
const jwtService: JwtService = Container.get(JwtService);

export class AuthController {
    @handleError
    public async userLogin(req: Request, res: Response): Promise<void> {
        let user: IUser = await userService.getUserByLogin(req.body.login);
        if (!user || user.password !== req.body.password) {
            throw new HttpRequestError(403, 'Bad credentials.');
        } else {
            let payload = { sub: user.id };
            let token = jwtService.signToken(payload, '15m');
            res.json({ token });
        }
    }
}
