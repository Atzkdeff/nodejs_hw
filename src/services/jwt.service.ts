import { sign, verify, VerifyCallback } from 'jsonwebtoken';

import { SECRET } from '../constants';

export class JwtService {
    public verifyToken(token: string, callback: VerifyCallback): void {
        return verify(token, SECRET, callback);
    }

    public signToken(payload: { sub: string }, expiresIn: string | number): string {
        return sign(payload, SECRET, { expiresIn });
    }
}
