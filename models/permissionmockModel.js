const permissions = [
  // Project Management Permissions
  { id: 1, name: "create_project", description: "Create new projects" },
  { id: 2, name: "edit_project", description: "Edit existing projects" },
  { id: 3, name: "delete_project", description: "Delete projects" },
  { id: 4, name: "view_project", description: "View project details" },

  // Task Management Permissions
  { id: 5, name: "create_task", description: "Create new tasks" },
  { id: 6, name: "edit_task", description: "Edit existing tasks" },
  { id: 7, name: "delete_task", description: "Delete tasks" },
  { id: 8, name: "view_task", description: "View task details" },
  { id: 9, name: "approve_task", description: "Approve tasks to users" },
  { id: 21, name: "reject_task", description: "Reject tasks to users" },

  // User Management Permissions
  { id: 10, name: "create_user", description: "Create new users" },
  { id: 11, name: "edit_user", description: "Edit user details" },
  { id: 12, name: "delete_user", description: "Delete users" },
  { id: 13, name: "view_user", description: "View user details" },

  // Report Permissions
  // { id: 18, name: "generate_report", description: "Generate reports" },
  // { id: 19, name: "view_report", description: "View reports" },
  // { id: 20, name: "export_report", description: "Export reports" },
];

const roles = [
  {
    id: 1,
    name: "Admin",
    description: "System Administrator",
  },
  {
    id: 2,
    name: "PROJECT_MANAGER",
    description: "Manager role for managing the projects and users",
  },
  {
    id: 3,
    name: "USER",
    description: "Employee role",
  },
];

const rolePermissions = {
  // Admin has all permissions except task creation/editing/deletion
  1: [1, 2, 3, 4, 8, 9, 10, 11, 12, 13, 15, 16, 17, 21],

  // Project Manager permissions
  2: [2, 4, 9, 15, 16, 17],
  // User permissions
  3: [4, 8, 14, 17],
};

module.exports = {
  permissions,
  roles,
  rolePermissions,
};
