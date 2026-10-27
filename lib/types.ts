export type Role = 'guest' | 'user' | 'admin';
export type Subject = { slug: string; name: string; teacher: string };
export type Deadline = { id: string; subjectSlug: string; title: string; description: string; dueDate: string };
export type StoredUser = { id: string; name: string; email: string; role: Exclude<Role, 'guest'>; passwordHash: string };
