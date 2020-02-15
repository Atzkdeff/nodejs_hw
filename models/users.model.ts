import { DataTypes, Model, BuildOptions, Sequelize } from 'sequelize';

import { db } from './data-base';
import { IUser } from '../interfaces/index';
import { Group } from './groups.model';
import { UserGroup } from './user-group.model';

export interface IUserModel extends Model, IUser {}

// Need to declare the static model so `findOne` etc. use correct types.
export type UserModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IUserModel;
    associate: (models: Sequelize) => void;
};

export const User: UserModelStatic = <UserModelStatic>db.define(
    'User',
    {
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
    },
    { timestamps: true, paranoid: true }
);

User.associate = function() {
    this.belongsToMany(Group, {
        through: UserGroup,
        as: 'groups',
        foreignKey: 'userId',
        otherKey: 'groupId'
    });
};
