import { ValidationResult } from '@hapi/joi';
import { Container } from 'typedi';

import { IUser } from '../interfaces/index';
import { UsersDAL } from '../data-access/users.dal';

export class UsersService {
    private usersDAL: UsersDAL;

    constructor() {
        this.usersDAL = Container.get(UsersDAL);
    }

    public getUserById(id: string): IUser {
        return this.usersDAL.getUserById(id);
    }

    public getUserByLogin(login: string): IUser {
        return this.usersDAL.getUserByLogin(login);
    }

    public getUsers(limit?: number, loginSubstring?: string): IUser[] {
        const users: IUser[] = this.usersDAL
            .getUsers(limit, loginSubstring)
            .filter((user) => !user.isDeleted)
            .sort((a, b) => (a.login.toUpperCase() > b.login.toUpperCase() ? 1 : -1));
        return users;
    }

    public createNewUser(validationResult: ValidationResult): IUser {
        let user: IUser = this.usersDAL.createNewUser(validationResult);
        return user;
    }

    public updateUser(validationResult: ValidationResult): IUser {
        let user: IUser = this.usersDAL.updateUser(validationResult);
        return user;
    }

    public deleteUser(id: string): void {
        this.usersDAL.deleteUser(id);
        return;
    }
}
