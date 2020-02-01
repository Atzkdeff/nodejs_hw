import { DataTypes, Model, BuildOptions } from 'sequelize';

import { db } from './data-base';

export interface IUserModel extends Model {
    readonly id: string;
    readonly login: string;
    readonly password: string;
    readonly age: number;
}

// Need to declare the static model so `findOne` etc. use correct types.
export type UserModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IUserModel;
};

export const User: UserModelStatic = <UserModelStatic>db.define('user', {
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
