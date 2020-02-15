import { Transaction } from 'sequelize';

import { db, UserGroup } from '../models/index';
import { IUserGroup } from '../interfaces/index';

export class UsersGroupsDAO {
    private saveUserGroup(userId: string, groupId: string, transaction?: Transaction): Promise<IUserGroup> {
        const userGroup: IUserGroup = {
            userId,
            groupId
        };
        return UserGroup.create(userGroup, { transaction });
    }

    public deleteUserGroup(userId: string): Promise<number> {
        return UserGroup.destroy({
            where: { userId: userId }
        });
    }

    public addUsersToGroup(groupId: string, userIds: string[]): Promise<void> {
        return db.transaction(async () => {
            for (let userId of userIds) {
                await this.saveUserGroup(userId, groupId);
            }
        });
    }
}
