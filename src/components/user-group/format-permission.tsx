export function formatPermissionsByGroup(permissions: any) {
    return permissions.reduce((grouped: any, currentItem: any) => {
        if (grouped[currentItem.permissionGroup]) {
            grouped[currentItem.permissionGroup].push(currentItem)
        } else {
            grouped[currentItem.permissionGroup] = [currentItem]
        }

        return grouped
    }, {})
}
