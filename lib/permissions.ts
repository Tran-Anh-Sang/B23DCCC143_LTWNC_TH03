import type { Role } from './types';

export type Action = 'deadline:read' | 'deadline:done' | 'deadline:create' | 'deadline:delete';

const user: Action[] = ['deadline:read', 'deadline:done'];

// Ma trận phân quyền duy nhất của cả ứng dụng
export const permissions: Record<Role, Action[]> = {
  guest: ['deadline:read'],
  user,
  admin: [...user, 'deadline:create', 'deadline:delete'],
};

export const can = (role: Role, action: Action): boolean => permissions[role].includes(action);
