import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from 'vitest';
import { loadTasks } from './taskStorage.js';

test('loads valid data, handles missing files and preserves invalid files', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'task-tracker-load-'));
  const filePath = join(directory, 'tasks.json');

  try {
    expect(await loadTasks(filePath)).toEqual([]);
    await expect(stat(filePath)).rejects.toMatchObject({ code: 'ENOENT' });

    const tasks = [{ id: 1, title: 'Test task', completed: false }];
    const validJson = JSON.stringify(tasks);
    await writeFile(filePath, validJson);
    expect(await loadTasks(filePath)).toEqual(tasks);
    expect(await readFile(filePath, 'utf8')).toBe(validJson);

    await writeFile(filePath, '{broken');
    await expect(loadTasks(filePath)).rejects.toThrow(
      'Invalid JSON in task file',
    );
    expect(await readFile(filePath, 'utf8')).toBe('{broken');

    await writeFile(filePath, '{}');
    await expect(loadTasks(filePath)).rejects.toThrow(
      'Task data must be an array',
    );
    expect(await readFile(filePath, 'utf8')).toBe('{}');

    // Reading a directory is a filesystem error, not a missing data file.
    await expect(loadTasks(directory)).rejects.toMatchObject({
      code: 'EISDIR',
    });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
