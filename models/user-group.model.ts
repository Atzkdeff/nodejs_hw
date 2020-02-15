import { DataTypes, Model, BuildOptions } from 'sequelize';

import { db } from './data-base';
import { IUserGroup } from '../interfaces/index';

export interface IUserGroupModel extends Model, IUserGroup {}

// Need to declare the static model so `findOne` etc. use correct types.
export type UserGroupModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IUserGroupModel;
};

export const UserGroup: UserGroupModelStatic = <UserGroupModelStatic>db.define('UsersGroups', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    groupId: {
        type: DataTypes.UUID,
        allowNull: false
    }
});
