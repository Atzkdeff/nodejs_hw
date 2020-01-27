import { Container } from 'typedi';

import { IUser } from '../interfaces/index';
import { UsersDAL } from '../data-access/index';

export class UsersService {
    private usersDAL: UsersDAL;

    constructor() {
        this.usersDAL = Container.get(UsersDAL);
    }

    public getUserById(id: string): Promise<IUser> {
        return this.usersDAL.getUserById(id);
    }

    public getUsers(limit?: string, loginSubstring?: string): Promise<IUser[]> {
        let numLimit: number = !limit ? undefined : Number(limit);
        numLimit = numLimit < 0 ? undefined : numLimit;
        loginSubstring = !loginSubstring ? '' : loginSubstring;

        return this.usersDAL.getUsers(numLimit, loginSubstring);
    }

    public async createNewUser(userData: IUser): Promise<IUser> {
        const existingUser: IUser = await this.usersDAL.getUserByLogin(userData.login);

        if (!!existingUser) {
            throw new Error('This login has already been registered');
        }

        return this.usersDAL.createNewUser(userData);
    }

    public updateUser(userData: IUser): Promise<IUser> {
        return this.usersDAL.updateUser(userData);
    }

    public deleteUser(id: string): Promise<void> {
        return this.usersDAL.deleteUser(id).then(() => undefined);
    }
}
