type PermissionTypes = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

/**
 * Group interface
 */
export interface IGroup {
    id: string;
    name: string;
    permissions: Array<PermissionTypes>;
}
