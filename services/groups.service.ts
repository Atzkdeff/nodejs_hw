import { Container } from 'typedi';

import { IGroup } from '../interfaces/index';
import { GroupsDAO, UsersGroupsDAO } from '../data-access/index';

export class GroupsService {
    private groupsDAO: GroupsDAO;
    private usersGroupsDAO: UsersGroupsDAO;

    constructor() {
        this.groupsDAO = Container.get(GroupsDAO);
        this.usersGroupsDAO = Container.get(UsersGroupsDAO);
    }

    public getGroupById(id: string): Promise<IGroup> {
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

    public addUsersToGroup(groupId: string, userIds: string[]): Promise<void> {
        return this.usersGroupsDAO.addUsersToGroup(groupId, userIds);
    }
}
