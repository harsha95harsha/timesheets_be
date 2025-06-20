const permissionService = require("../services/permissionService");

const checkUserPermission = async (user, requiredPermission) => {
  if (!user || !user.role_id) {
    return false;
  }

  return permissionService.hasPermission(user.role_id, requiredPermission);
};

const checkUserAnyPermission = async (user, requiredPermissions) => {
  if (!user || !user.role_id) {
    return false;
  }

  return permissionService.hasAnyPermission(user.role_id, requiredPermissions);
};

const checkUserAllPermissions = async (user, requiredPermissions) => {
  if (!user || !user.role_id) {
    return false;
  }

  return permissionService.hasAllPermissions(user.role_id, requiredPermissions);
};

const getUserPermissions = async (user) => {
  if (!user || !user.role_id) {
    return [];
  }

  return permissionService.getRolePermissions(user.role_id);
};

const isAdmin = (user) => {
  return user && user.role_id === 1;
};

const isProjectManager = (user) => {
  return user && user.role_id === 2;
};

const isUser = (user) => {
  return user && user.role_id === 3;
};

module.exports = {
  checkUserPermission,
  checkUserAnyPermission,
  checkUserAllPermissions,
  getUserPermissions,
  isAdmin,
  isProjectManager,
  isUser,
};
