import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export async function loadTasks(filePath) {
  let content;
  try {
    content = await readFile(filePath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }

  const tasks = JSON.parse(content);
  if (!Array.isArray(tasks)) {
    throw new Error('Task data must be an array');
  }
  return tasks;
}

export async function saveTasks(filePath, tasks) {
  await mkdir(dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(tasks, null, 2), 'utf8');
  await rename(temporaryPath, filePath);
}
