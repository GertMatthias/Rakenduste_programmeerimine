import express from 'express';
import { tasks } from './data/tasks.js';
import { getAllTasks, getTaskById } from './taskFunctions.js';

export const app = express();
let nextTaskId = Math.max(0, ...tasks.map((task) => task.id)) + 1;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/tasks', (req, res) => {
  const { completed } = req.query;

  if (completed === undefined) {
    return res.json(getAllTasks(tasks));
  }

  if (completed !== 'true' && completed !== 'false') {
    return res.status(400).json({ error: 'completed must be true or false' });
  }

  const isCompleted = completed === 'true';
  const filteredTasks = tasks.filter((task) => task.completed === isCompleted);

  res.json(filteredTasks);
});

app.post('/api/tasks', (req, res) => {
  const title = req.body?.title;

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title must be a non-empty string' });
  }

  const task = {
    id: nextTaskId,
    title: title.trim(),
    completed: false,
  };

  nextTaskId += 1;
  tasks.push(task);

  res.status(201).json(task);
});

app.patch('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id < 1) {
    return res
      .status(400)
      .json({ error: 'Task ID must be a positive integer' });
  }

  const task = getTaskById(tasks, id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const updates = req.body;

  if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
    return res
      .status(400)
      .json({ error: 'Send an object with title or completed' });
  }

  const fields = Object.keys(updates);

  if (
    fields.length === 0 ||
    fields.some((field) => field !== 'title' && field !== 'completed')
  ) {
    return res
      .status(400)
      .json({ error: 'Only title and completed can be updated' });
  }

  if (
    Object.hasOwn(updates, 'title') &&
    (typeof updates.title !== 'string' || updates.title.trim() === '')
  ) {
    return res.status(400).json({ error: 'Title must be a non-empty string' });
  }

  if (
    Object.hasOwn(updates, 'completed') &&
    typeof updates.completed !== 'boolean'
  ) {
    return res.status(400).json({ error: 'completed must be a boolean' });
  }

  if (Object.hasOwn(updates, 'title')) {
    task.title = updates.title.trim();
  }

  if (Object.hasOwn(updates, 'completed')) {
    task.completed = updates.completed;
  }

  res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id < 1) {
    return res
      .status(400)
      .json({ error: 'Task ID must be a positive integer' });
  }

  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(index, 1);
  res.status(204).end();
});

app.get('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id < 1) {
    return res
      .status(400)
      .json({ error: 'Task ID must be a positive integer' });
  }

  const task = getTaskById(tasks, id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});
