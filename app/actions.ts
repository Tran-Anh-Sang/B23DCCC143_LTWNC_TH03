'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { can, type Action } from '@/lib/permissions';
import { addDeadline, getSubject, removeDeadline, toggleDone } from '@/lib/data';

// Mỗi Server Action là endpoint công khai -> tự kiểm tra phiên + quyền
async function requireCan(action: Action) {
  const session = await auth();
  if (!session || !can(session.user.role, action)) throw new Error('Không có quyền thực hiện thao tác này');
  return session.user;
}

const IdSchema = z.object({ id: z.string().regex(/^\d+$/) });
const CreateSchema = z.object({
  subjectSlug: z.string().min(1),
  title: z.string().trim().min(3, 'Tiêu đề tối thiểu 3 ký tự').max(120),
  description: z.string().trim().max(500).default(''),
  dueDate: z.string().min(1).refine((v) => !Number.isNaN(Date.parse(v)), 'Ngày hạn không hợp lệ'),
});

export async function toggleDoneAction(formData: FormData) {
  const user = await requireCan('deadline:done');
  const { id } = IdSchema.parse({ id: formData.get('id') });
  await toggleDone(user.id, id);
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/done');
}

export async function addDeadlineAction(formData: FormData) {
  await requireCan('deadline:create');
  const data = CreateSchema.parse(Object.fromEntries(formData));
  if (!(await getSubject(data.subjectSlug))) throw new Error('Môn học không tồn tại');
  await addDeadline({ ...data, dueDate: new Date(data.dueDate + '+07:00').toISOString() });
  refreshPublicPages();
}

export async function deleteDeadlineAction(formData: FormData) {
  await requireCan('deadline:delete');
  const { id } = IdSchema.parse({ id: formData.get('id') });
  await removeDeadline(id);
  refreshPublicPages();
}

// ISR theo yêu cầu: làm mới ngay các trang tĩnh khi admin thêm/xoá
function refreshPublicPages() {
  revalidatePath('/');
  revalidatePath('/deadlines');
  revalidatePath('/deadlines/[id]', 'page');
  revalidatePath('/subjects/[slug]', 'page');
  revalidatePath('/sitemap.xml');
  revalidatePath('/dashboard');
  revalidatePath('/admin');
}
