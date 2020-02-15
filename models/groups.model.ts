import { DataTypes, Model, BuildOptions, Sequelize } from 'sequelize';

import { db } from './data-base';
import { IGroup } from '../interfaces/index';
import { User } from './users.model';
import { UserGroup } from './user-group.model';

export interface IGroupModel extends Model, IGroup {}

// Need to declare the static model so `findOne` etc. use correct types.
export type GroupModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IGroupModel;
    associate: (models: Sequelize) => void;
};

export const Group: GroupModelStatic = <GroupModelStatic>db.define('Group', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    permissions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    }
});

Group.associate = function() {
    this.belongsToMany(User, {
        through: UserGroup,
        as: 'users',
        foreignKey: 'groupId',
        otherKey: 'userId'
    });
};
