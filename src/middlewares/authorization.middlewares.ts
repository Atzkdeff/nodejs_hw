import { Container } from 'typedi';

import { JwtService } from '../services/index';
import { HttpRequestError } from '../utils/index';

const jwtService: JwtService = Container.get(JwtService);

export function checkToken(req, res, next) {
    let token: string = req.headers['x-access-token'];
    if (token) {
        jwtService.verifyToken(token, function(err) {
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
