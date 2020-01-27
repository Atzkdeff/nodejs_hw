import { Container } from 'typedi';

import { IUser } from '../interfaces/index';
import { UsersModel } from '../models/index';

export class UsersDAL {
    private usersModel: UsersModel;

    constructor() {
        this.usersModel = Container.get(UsersModel);
    }

    public getUserById(id: string): Promise<IUser> {
        return this.usersModel.findUserById(id);
    }

    public getUserByLogin(login: string): Promise<IUser> {
        return this.usersModel.findUserByLogin(login);
    }

    public getUsers(limit?: number, loginSubstring?: string): Promise<IUser[]> {
        return this.usersModel.findUsers(limit, loginSubstring);
    }

    public createNewUser(userData: IUser): Promise<IUser> {
        return this.usersModel.createUser(userData);
    }

    public updateUser(userData: IUser): Promise<IUser> {
        return (
            this.usersModel
                .updateUser(userData)
                // @ts-ignore TODO: find a proper way for returning updated value
                .then((value) => value[1][0].dataValues)
        );
    }

    public deleteUser(id: string): Promise<number> {
        return this.usersModel.deleteUser(id);
    }
}
