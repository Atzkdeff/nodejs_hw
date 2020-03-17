import { Container } from 'typedi';
import { Model } from 'sequelize';

import { IUser } from '../interfaces/index';
import { UsersDAO } from '../data-access/index';

export class UsersService {
    private usersDAO: UsersDAO;

    constructor() {
        this.usersDAO = Container.get(UsersDAO);
    }

    public async getUserById(id: string): Promise<IUser & Model> {
        return await this.usersDAO.getUserById(id);
    }

    public async getUserByLogin(login: string): Promise<IUser & Model> {
        return await this.usersDAO.getUserByLogin(login);
    }

    public async getUsers(limit?: string, loginSubstring?: string): Promise<IUser[]> {
        let numLimit: number = !limit ? undefined : Number(limit);
        numLimit = numLimit < 0 ? undefined : numLimit;
        loginSubstring = !loginSubstring ? '' : loginSubstring;

        return await this.usersDAO.getUsers(numLimit, loginSubstring);
    }

    public async createNewUser(userData: IUser): Promise<IUser> {
        const existingUser: IUser = await this.usersDAO.getUserByLogin(userData.login);

        if (!!existingUser) {
            throw new Error('existing_user_exception');
        }

        return await this.usersDAO.createNewUser(userData);
    }

    public async updateUser(userData: IUser): Promise<IUser> {
        return await this.usersDAO.updateUser(userData);
    }

    public async deleteUser(user: IUser & Model): Promise<void> {
        return await this.usersDAO.deleteUser(user);
    }
}
