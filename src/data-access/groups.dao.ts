import { Model } from 'sequelize';

import { IGroup } from '../interfaces/index';
import { Group } from '../models/index';

export class GroupsDAO {
    public getGroupsById(id: string): Promise<IGroup & Model> {
        return Group.findOne({
            where: {
                id
            }
        });
    }

    public getGroupByName(name: string): Promise<IGroup> {
        return Group.findOne({
            where: {
                name
            }
        });
    }

    public getGroups(): Promise<IGroup[]> {
        return Group.findAll();
    }

    public createNewGroup(groupData: IGroup): Promise<IGroup> {
        return Group.create(groupData);
    }

    public updateGroup(groupData: IGroup): Promise<IGroup> {
        return (
            Group.update(groupData, { where: { id: groupData.id }, returning: true })
                // @ts-ignore TODO: find a proper way for returning updated value
                .then((value) => value[1][0].dataValues)
        );
    }

    public deleteGroup(id: string): Promise<void> {
        return Group.destroy({
            where: {
                id
            },
            force: true
        }).then(() => undefined);
    }

    public addUsersToGroup(group: IGroup & Model, userIds: string[]): Promise<void> {
        return (<any>group).addUsers(userIds).then(() => undefined);
    }
}
