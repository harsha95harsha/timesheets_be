const db = require("../config/db");

class PermissionService {
  async hasPermission(roleId, permission) {
    try {
      const rolePermissions = await db.RolePermission.findAll({
        where: { role_id: roleId },
        include: [
          {
            model: db.Permission,
            as: "permission",
            where: { permission_name: permission },
          },
        ],
      });

      return rolePermissions.length > 0;
    } catch (error) {
      console.error("Error checking permission:", error);
      return false;
    }
  }

  async hasAnyPermission(roleId, permissions) {
    try {
      const rolePermissions = await db.RolePermission.findAll({
        where: { role_id: roleId },
        include: [
          {
            model: db.Permission,
            as: "permission",
            where: {
              permission_name: permissions,
            },
          },
        ],
      });

      return rolePermissions.length > 0;
    } catch (error) {
      console.error("Error checking permissions:", error);
      return false;
    }
  }

  async hasAllPermissions(roleId, permissions) {
    try {
      const rolePermissions = await db.RolePermission.findAll({
        where: { role_id: roleId },
        include: [
          {
            model: db.Permission,
            as: "permission",
            where: {
              permission_name: permissions,
            },
          },
        ],
      });

      return rolePermissions.length === permissions.length;
    } catch (error) {
      console.error("Error checking permissions:", error);
      return false;
    }
  }

  async getRolePermissions(roleId) {
    try {
      const rolePermissions = await db.RolePermission.findAll({
        where: { role_id: roleId },
        include: [
          {
            model: db.Permission,
            as: "permission",
            attributes: ["permission_name", "permission_description"],
          },
        ],
      });

      return rolePermissions.map((rp) => ({
        name: rp.permission.permission_name,
        description: rp.permission.permission_description,
      }));
    } catch (error) {
      console.error("Error getting role permissions:", error);
      return [];
    }
  }
}

module.exports = new PermissionService();
