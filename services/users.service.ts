import { Container } from 'typedi';

import { IUser } from '../interfaces/index';
import { UsersDAO } from '../data-access/index';

export class UsersService {
    private usersDAO: UsersDAO;

    constructor() {
        this.usersDAO = Container.get(UsersDAO);
    }

    public getUserById(id: string): Promise<IUser> {
        return this.usersDAO.getUserById(id);
    }

    public getUsers(limit?: string, loginSubstring?: string): Promise<IUser[]> {
        let numLimit: number = !limit ? undefined : Number(limit);
        numLimit = numLimit < 0 ? undefined : numLimit;
        loginSubstring = !loginSubstring ? '' : loginSubstring;

        return this.usersDAO.getUsers(numLimit, loginSubstring);
    }

    public async createNewUser(userData: IUser): Promise<IUser> {
        const existingUser: IUser = await this.usersDAO.getUserByLogin(userData.login);

        if (!!existingUser) {
            throw new Error('existing_user_exception');
        }

        return this.usersDAO.createNewUser(userData);
    }

    public updateUser(userData: IUser): Promise<IUser> {
        return this.usersDAO.updateUser(userData);
    }

    public deleteUser(id: string): Promise<void> {
        return this.usersDAO.deleteUser(id);
    }
}
