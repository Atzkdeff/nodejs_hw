import { DataTypes, Model, BuildOptions, Sequelize } from 'sequelize';

import { db } from './data-base';
import { IUser } from '../interfaces/index';

export interface IUserModel extends Model, IUser {}

// Need to declare the static model so `findOne` etc. use correct types.
export type UserModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IUserModel;
    associate: (models: Sequelize) => void;
};

export const User: UserModelStatic = <UserModelStatic>db.define('user', {
    id: {
        type: DataTypes.UUID,
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
        type: DataTypes.INTEGER
    }
});

User.associate = function(models) {
    this.belongsToMany(models.group, {
        through: 'UserGroup',
        as: 'groups',
        foreignKey: 'userId',
        otherKey: 'groupId'
    });
};
