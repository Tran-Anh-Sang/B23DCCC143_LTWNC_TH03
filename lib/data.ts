import { promises as fs } from 'fs';
import path from 'path';
import type { Deadline, StoredUser, Subject } from './types';

const file = (name: string) => path.join(process.cwd(), 'data', name);
async function read<T>(name: string): Promise<T> {
  return JSON.parse(await fs.readFile(file(name), 'utf8')) as T;
}
async function write(name: string, data: unknown) {
  await fs.writeFile(file(name), JSON.stringify(data, null, 2), 'utf8');
}

export const getSubjects = () => read<Subject[]>('subjects.json');
export const getUsers = () => read<StoredUser[]>('users.json');

export async function getSubject(slug: string) {
  return (await getSubjects()).find((s) => s.slug === slug);
}
export async function getDeadlines(): Promise<Deadline[]> {
  const list = await read<Deadline[]>('deadlines.json');
  return list.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}
export async function getDeadline(id: string) {
  return (await getDeadlines()).find((d) => d.id === id);
}
export async function addDeadline(input: Omit<Deadline, 'id'>) {
  const list = await read<Deadline[]>('deadlines.json');
  const id = String(Math.max(0, ...list.map((d) => Number(d.id))) + 1);
  list.push({ id, ...input });
  await write('deadlines.json', list);
  return id;
}
export async function removeDeadline(id: string) {
  const list = await read<Deadline[]>('deadlines.json');
  await write('deadlines.json', list.filter((d) => d.id !== id));
  const progress = await read<Record<string, string[]>>('progress.json');
  for (const k of Object.keys(progress)) progress[k] = progress[k].filter((x) => x !== id);
  await write('progress.json', progress);
}
export async function getDoneIds(userId: string) {
  return (await read<Record<string, string[]>>('progress.json'))[userId] ?? [];
}
export async function toggleDone(userId: string, id: string) {
  const progress = await read<Record<string, string[]>>('progress.json');
  const cur = progress[userId] ?? [];
  progress[userId] = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  await write('progress.json', progress);
}
