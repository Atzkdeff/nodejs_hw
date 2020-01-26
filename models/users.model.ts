import { DataTypes, Sequelize, Model, BuildOptions } from 'sequelize';

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
    .then(() => console.log('Good'))
    .catch(() => console.log('Bad'));

const User: UserModelStatic = <UserModelStatic>sequelize.define('user', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
        // defaultValue: Sequelize.literal()
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
    public async findAllUsers(): Promise<IUserModel[]> {
        return await User.findAll();
    }

    public async addUser(): Promise<IUserModel> {
        console.log('adduser');
        return await User.create({ id: '123', login: 'Someone', password: 'password', age: 5 });
    }
}
