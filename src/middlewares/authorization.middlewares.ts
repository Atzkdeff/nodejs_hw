import { sign, verify } from 'jsonwebtoken';
import { Container } from 'typedi';

import { SECRET } from '../constants';
import { UsersService } from '../services/index';
import { HttpRequestError } from '../utils/index';

const userService: UsersService = Container.get(UsersService);

export async function userLogin(req, res) {
    let user = await userService.getUserByLogin(req.body.login);
    if (!user || user.password !== req.body.password) {
        throw new HttpRequestError(403, 'Bad credentials.');
    } else {
        let payload = { sub: user.id };
        let token = sign(payload, SECRET, { expiresIn: 60 * 15 });
        res.json({ token });
    }
}

export function checkToken(req, res, next) {
    let token: string = req.headers['x-access-token'];
    if (token) {
        verify(token, SECRET, function(err) {
            if (err) {
                throw new HttpRequestError(403, 'Failed to authenticate token.');
            } else {
                next();
            }
        });
    } else {
        throw new HttpRequestError(401, "Token wasn't provided.");
    }
}
