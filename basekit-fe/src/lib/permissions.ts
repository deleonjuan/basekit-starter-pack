export const PERMISSIONS = {
  USERS: {
    READ: "users:read",
    WRITE: "users:write",
    DELETE: "users:delete",
    ROLES_WRITE: "users.roles:write",
  },
  ROLES: {
    READ: "roles:read",
    WRITE: "roles:write",
    DELETE: "roles:delete",
    PERMISSIONS_WRITE: "roles.permissions:write",
  },
  PERMISSIONS: {
    READ: "permissions:read",
    WRITE: "permissions:write",
  },
  SETTINGS: {
    GLOBAL: {
      WRITE: "settings.global:write",
    },
  },
} as const;

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS] extends infer Group
    ? Group extends Record<string, unknown>
      ? Group[keyof Group] extends infer Sub
        ? Sub extends Record<string, string>
          ? Sub[keyof Sub]
          : Sub
        : never
      : never
    : never;
