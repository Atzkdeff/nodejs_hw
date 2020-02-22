import { Container } from 'typedi';
import { Model } from 'sequelize';

import { IGroup } from '../interfaces/index';
import { GroupsDAO } from '../data-access/index';

export class GroupsService {
    private groupsDAO: GroupsDAO;

    constructor() {
        this.groupsDAO = Container.get(GroupsDAO);
    }

    public getGroupById(id: string): Promise<IGroup & Model> {
        return this.groupsDAO.getGroupsById(id);
    }

    public getGroups(): Promise<IGroup[]> {
        return this.groupsDAO.getGroups();
    }

    public async createNewGroup(groupData: IGroup): Promise<IGroup> {
        const existingGroup: IGroup = await this.groupsDAO.getGroupByName(groupData.name);

        if (!!existingGroup) {
            throw new Error('existing_group_exception');
        }

        return this.groupsDAO.createNewGroup(groupData);
    }

    public updateGroup(groupData: IGroup): Promise<IGroup> {
        return this.groupsDAO.updateGroup(groupData);
    }

    public deleteGroup(id: string): Promise<void> {
        return this.groupsDAO.deleteGroup(id);
    }

    public addUsersToGroup(group: IGroup & Model, userIds: string[]): Promise<void> {
        return this.groupsDAO.addUsersToGroup(group, userIds);
    }
}
