import { Container } from 'typedi';

import { IGroup } from '../interfaces/index';
import { GroupsDao } from '../data-access/index';

export class GroupsService {
    private groupsDao: GroupsDao;

    constructor() {
        this.groupsDao = Container.get(GroupsDao);
    }

    public getGroupById(id: string): Promise<IGroup> {
        return this.groupsDao.getGroupsById(id);
    }

    public getGroups(): Promise<IGroup[]> {
        return this.groupsDao.getGroups();
    }

    public async createNewGroup(groupData: IGroup): Promise<IGroup> {
        const existingGroup: IGroup = await this.groupsDao.getGroupByName(groupData.name);

        if (!!existingGroup) {
            throw new Error('existing_group_exception');
        }

        return this.groupsDao.createNewGroup(groupData);
    }

    public updateGroup(groupData: IGroup): Promise<IGroup> {
        return this.groupsDao.updateGroup(groupData);
    }

    public deleteGroup(id: string): Promise<void> {
        return this.groupsDao.deleteGroup(id);
    }
}
