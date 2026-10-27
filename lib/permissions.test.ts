import { can } from './permissions';

describe('can(role, action)', () => {
  it('guest chỉ được xem', () => {
    expect(can('guest', 'deadline:read')).toBe(true);
    expect(can('guest', 'deadline:done')).toBe(false);
    expect(can('guest', 'deadline:create')).toBe(false);
    expect(can('guest', 'deadline:delete')).toBe(false);
  });
  it('user xem và đánh dấu xong, không thêm/xoá', () => {
    expect(can('user', 'deadline:done')).toBe(true);
    expect(can('user', 'deadline:create')).toBe(false);
    expect(can('user', 'deadline:delete')).toBe(false);
  });
  it('admin có mọi quyền', () => {
    for (const a of ['deadline:read', 'deadline:done', 'deadline:create', 'deadline:delete'] as const) {
      expect(can('admin', a)).toBe(true);
    }
  });
});
