import { Container } from 'typedi';
import { Model } from 'sequelize';

import { IGroup } from '../interfaces/index';
import { GroupsDAO } from '../data-access/index';

export class GroupsService {
    private groupsDAO: GroupsDAO;

    constructor() {
        this.groupsDAO = Container.get(GroupsDAO);
    }

    public async getGroupById(id: string): Promise<IGroup & Model> {
        return await this.groupsDAO.getGroupsById(id);
    }

    public async getGroups(): Promise<IGroup[]> {
        return await this.groupsDAO.getGroups();
    }

    public async createNewGroup(groupData: IGroup): Promise<IGroup> {
        const existingGroup: IGroup = await this.groupsDAO.getGroupByName(groupData.name);

        if (!!existingGroup) {
            throw new Error('existing_group_exception');
        }

        return await this.groupsDAO.createNewGroup(groupData);
    }

    public async updateGroup(groupData: IGroup): Promise<IGroup> {
        return await this.groupsDAO.updateGroup(groupData);
    }

    public async deleteGroup(id: string): Promise<void> {
        return await this.groupsDAO.deleteGroup(id);
    }

    public async addUsersToGroup(group: IGroup & Model, userIds: string[]): Promise<void> {
        return await this.groupsDAO.addUsersToGroup(group, userIds);
    }
}
