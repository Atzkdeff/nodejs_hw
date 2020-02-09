import { Op } from 'sequelize';

import { IUser } from '../interfaces/index';
import { User } from '../models/index';

export class UsersDao {
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

    public deleteUser(id: string): Promise<void> {
        return User.destroy({
            where: {
                id
            }
        }).then(() => undefined);
    }
}
