import request from 'supertest';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from './app.js';
import { loadTasks, saveTasks } from './taskStorage.js';

const seedTasks = [
  { id: 1, title: 'Learn JSX', completed: true },
  { id: 2, title: 'Practise React state', completed: false },
];

let app;
let directory;
let filePath;

beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), 'task-tracker-api-'));
  filePath = join(directory, 'tasks.json');
  await saveTasks(filePath, seedTasks);
  app = createApp(await loadTasks(filePath), (tasks) =>
    saveTasks(filePath, tasks),
  );
});

afterEach(async () => {
  if (directory) await rm(directory, { recursive: true, force: true });
});

test('GET returns tasks', async () => {
  const response = await request(app).get('/api/tasks');
  expect(response.status).toBe(200);
  expect(response.body).toEqual(seedTasks);
});

test('POST creates a valid task', async () => {
  const response = await request(app)
    .post('/api/tasks')
    .send({ title: '  Learn Express  ' });
  expect(response.status).toBe(201);
  expect(response.body).toEqual({
    id: 3,
    title: 'Learn Express',
    completed: false,
  });
  const tasks = await request(app).get('/api/tasks');
  expect(tasks.body).toContainEqual(response.body);
  const restartedApp = createApp(await loadTasks(filePath));
  const restored = await request(restartedApp).get('/api/tasks');
  expect(restored.body).toContainEqual(response.body);
});

test('POST rejects an empty title', async () => {
  const response = await request(app).post('/api/tasks').send({ title: '   ' });
  expect(response.status).toBe(400);
  expect(response.body).toEqual({ error: 'Title must be a non-empty string' });
  const tasks = await request(app).get('/api/tasks');
  expect(tasks.body).toEqual(seedTasks);
});

test('an unknown task returns 404', async () => {
  const response = await request(app).get('/api/tasks/999');
  expect(response.status).toBe(404);
  expect(response.body).toEqual({ error: 'Task not found' });
});

test('DELETE removes a task', async () => {
  const response = await request(app).delete('/api/tasks/1');
  expect(response.status).toBe(204);
  expect(response.text).toBe('');
  const tasks = await request(app).get('/api/tasks');
  expect(tasks.body).toEqual([seedTasks[1]]);
  const deleted = await request(app).get('/api/tasks/1');
  expect(deleted.status).toBe(404);
});
