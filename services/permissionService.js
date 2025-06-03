const db = require("../models");

class PermissionService {
  async hasPermission(roleId, permission) {
    try {
      const rolePermissions = await db.RolePermission.findAll({
        where: { role_id: roleId },
        include: [
          {
            model: db.Permission,
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
            attributes: ["permission_name", "description"],
          },
        ],
      });

      return rolePermissions.map((rp) => ({
        name: rp.Permission.permission_name,
        description: rp.Permission.description,
      }));
    } catch (error) {
      console.error("Error getting role permissions:", error);
      return [];
    }
  }
}

module.exports = new PermissionService();
