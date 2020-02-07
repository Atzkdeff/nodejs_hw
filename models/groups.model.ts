import { DataTypes, Model, BuildOptions } from 'sequelize';

import { db } from './data-base';
import { IGroup } from '../interfaces/index';

export interface IGroupModel extends Model, IGroup {}

// Need to declare the static model so `findOne` etc. use correct types.
export type GroupModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IGroupModel;
};

export const Group: GroupModelStatic = <GroupModelStatic>db.define('group', {
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
