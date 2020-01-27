import { DataTypes, Sequelize, Model, BuildOptions, Op } from 'sequelize';

import { IUser } from '../interfaces/index';

interface IUserModel extends Model {
    readonly id: string;
    readonly login: string;
    readonly password: string;
    readonly age: number;
}

// Need to declare the static model so `findOne` etc. use correct types.
type UserModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IUserModel;
};

const sequelize: Sequelize = new Sequelize(
    'postgres://lgodtrgi:DJIU4ec1LWQDlOmnlYezgGcwjKK6RGvt@dumbo.db.elephantsql.com:5432/lgodtrgi',
    {
        dialect: 'postgres',
        dialectOptions: {
            ssl: true
        },
        define: {
            timestamps: false
        }
    }
);

sequelize
    .authenticate()
    .then(() => console.log('Database connection: Good'))
    .catch(() => console.log('Database connection: Bad'));

const User: UserModelStatic = <UserModelStatic>sequelize.define('user', {
    id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.NUMBER
    }
});

export class UsersModel {
    public findUserById(id: string): Promise<IUserModel> {
        return User.findOne({
            where: {
                id
            }
        });
    }

    public findUserByLogin(login: string): Promise<IUserModel> {
        return User.findOne({
            where: {
                login
            }
        });
    }

    public findUsers(limit?: number, loginSubstring?: string): Promise<IUserModel[]> {
        return User.findAll({ limit, where: { login: { [Op.substring]: loginSubstring } }, order: [['login', 'ASC']] });
    }

    public createUser(user: IUser): Promise<IUserModel> {
        return User.create(user);
    }

    public updateUser(user: IUser): Promise<[number, IUserModel[]]> {
        return User.update(user, { where: { id: user.id }, returning: true });
    }

    public deleteUser(id: string): Promise<number> {
        return User.destroy({
            where: {
                id
            }
        });
    }
}
