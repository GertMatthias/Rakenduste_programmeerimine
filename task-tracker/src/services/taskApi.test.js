import { afterEach, expect, test, vi } from 'vitest';
import { createTask, deleteTask, getTasks, updateTask } from './taskApi.js';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

test('sends JSON and returns the server-generated task', async () => {
  vi.stubEnv('VITE_API_URL', 'http://localhost:3000/api');
  const task = { id: 42, title: 'Learn API', completed: false };
  const fetchMock = vi
    .fn()
    .mockResolvedValue(new Response(JSON.stringify(task), { status: 201 }));
  vi.stubGlobal('fetch', fetchMock);

  expect(await createTask('Learn API')).toEqual(task);
  expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Learn API' }),
  });
});

test('loads tasks and sends partial updates', async () => {
  vi.stubEnv('VITE_API_URL', 'http://localhost:3000/api/');
  const task = { id: 7, title: 'Task', completed: true };
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(new Response(JSON.stringify([task])))
    .mockResolvedValueOnce(new Response(JSON.stringify(task)));
  vi.stubGlobal('fetch', fetchMock);
  expect(await getTasks()).toEqual([task]);
  expect(await updateTask(7, { completed: true })).toEqual(task);
  expect(fetchMock).toHaveBeenLastCalledWith(
    'http://localhost:3000/api/tasks/7',
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true }),
    },
  );
});

test('accepts an empty 204 deletion response', async () => {
  vi.stubEnv('VITE_API_URL', 'http://localhost:3000/api');
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
  );
  await expect(deleteTask(7)).resolves.toBeUndefined();
});

test('reports server and connection errors', async () => {
  vi.stubEnv('VITE_API_URL', 'http://localhost:3000/api');
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Task not found' }), {
          status: 404,
        }),
      )
      .mockRejectedValueOnce(new TypeError('Failed to fetch')),
  );
  await expect(deleteTask(999)).rejects.toThrow('Task not found');
  await expect(getTasks()).rejects.toThrow('Backend’iga ei saa ühendust');
});
