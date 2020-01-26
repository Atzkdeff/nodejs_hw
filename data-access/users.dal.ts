import { Container } from 'typedi';
import { ValidationResult } from '@hapi/joi';

import { IUser } from '../interfaces/index';
import { UsersModel } from '../models/index';

export class UsersDAL {
    private usersModel: UsersModel;

    constructor() {
        this.usersModel = Container.get(UsersModel);
        console.log('Create');
    }

    public getUserById(id: string): IUser {
        // usersDB.find((userDB) => userDB.id === id);
        return;
    }

    public getUserByLogin(login: string): IUser {
        // usersDB.find((userDB) => userDB.id === id);
        // tusersDB.find((user) => user.login === result.value.login)
        return;
    }

    public getUsers(limit?: number, loginSubstring?: string): IUser[] {
        /**
         *         const sortedUsers: IUser[] = usersDB
         .filter((user) => !user.isDeleted)
         .sort((a, b) => (a.login.toUpperCase() > b.login.toUpperCase() ? 1 : -1));
         const limit: number = !req.query.limit ? undefined : Number(req.query.limit);
         const loginSubstring: string = req.query.loginSubstring === '' ? undefined : req.query.loginSubstring;

         if (loginSubstring === undefined && limit === undefined) {
            res.send(sortedUsers);
        } else if (limit === undefined || limit <= 0) {
            res.send(sortedUsers.filter((user) => user.login.toLowerCase().includes(loginSubstring.toLowerCase())));
        } else if (loginSubstring === undefined) {
            res.send(sortedUsers.slice(0, limit));
        } else {
            res.send(
                sortedUsers
                    .filter((user) => user.login.toLowerCase().includes(loginSubstring.toLowerCase()))
                    .slice(0, limit)
            );
        }
         */
        this.usersModel.findAllUsers();
        return [];
    }

    public createNewUser(validationResult: ValidationResult): IUser {
        //            usersDB.push({ ...result.value, ...{ id: uuid(), isDeleted: false } });
        this.usersModel.addUser();
        return;
    }

    public updateUser(validationResult: ValidationResult): IUser {
        // const index = usersDB.findIndex((user) => user.id === req.params.id);
        // usersDB[index] = { ...usersDB[index], ...result.value };
        return;
    }

    public deleteUser(id: string): void {
        //         const index: number = usersDB.findIndex((user) => user.id === req.params.id);
        //             usersDB[index].isDeleted = true;
        return;
    }
}
