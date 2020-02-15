import { Op } from 'sequelize';
import { Container } from 'typedi';

import { IUser } from '../interfaces/index';
import { db, User } from '../models/index';
import { UsersGroupsDAO } from './user-group.dao';

export class UsersDAO {
    private usersGroupsDAO: UsersGroupsDAO;

    constructor() {
        this.usersGroupsDAO = Container.get(UsersGroupsDAO);
    }

    public getUserById(id: string): Promise<IUser> {
        return User.findOne({
            where: {
                id
            }
        });
    }

    public getUserByLogin(login: string): Promise<IUser> {
        return User.findOne({
            where: {
                login
            }
        });
    }

    public getUsers(limit?: number, loginSubstring?: string): Promise<IUser[]> {
        return User.findAll({
            limit,
            where: { login: { [Op.substring]: loginSubstring } },
            order: [['login', 'ASC']]
        });
    }

    public createNewUser(userData: IUser): Promise<IUser> {
        return User.create(userData);
    }

    public updateUser(userData: IUser): Promise<IUser> {
        return (
            User.update(userData, { where: { id: userData.id }, returning: true })
                // @ts-ignore TODO: find a proper way for returning updated value
                .then((value) => value[1][0].dataValues)
        );
    }

    public async deleteUser(id: string): Promise<void> {
        try {
            const result = await db.transaction(async () => {
                await this.usersGroupsDAO.deleteUserGroup(id);
                const response = await User.destroy({
                    where: {
                        id
                    }
                }).then(() => undefined);

                return response;
            });

            return result;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
