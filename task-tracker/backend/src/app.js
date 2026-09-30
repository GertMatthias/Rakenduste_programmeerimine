import express from 'express';
import cors from 'cors';
import { tasks as initialTasks } from './data/tasks.js';
import { getAllTasks, getTaskById } from './taskFunctions.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp(
  seedTasks = initialTasks,
  persistTasks = async () => {},
) {
  let tasks = seedTasks.map((task) => ({ ...task }));
  const app = express();
  let nextTaskId = Math.max(0, ...tasks.map((task) => task.id)) + 1;
  let mutationQueue = Promise.resolve();

  function serialize(handler) {
    return (req, res, next) => {
      const operation = mutationQueue.then(() => handler(req, res));
      mutationQueue = operation.catch(() => {});
      operation.catch(next);
    };
  }

  async function commitTasks(updatedTasks) {
    await persistTasks(updatedTasks);
    tasks = updatedTasks;
  }

  app.use((req, res, next) => {
    res.on('finish', () => {
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode}`);
    });
    next();
  });

  app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
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
    const filteredTasks = tasks.filter(
      (task) => task.completed === isCompleted,
    );

    res.json(filteredTasks);
  });

  app.post(
    '/api/tasks',
    serialize(async (req, res) => {
      const title = req.body?.title;

      if (typeof title !== 'string' || title.trim() === '') {
        return res
          .status(400)
          .json({ error: 'Title must be a non-empty string' });
      }

      const task = {
        id: nextTaskId,
        title: title.trim(),
        completed: false,
      };

      await commitTasks([...tasks, task]);
      nextTaskId += 1;

      res.status(201).json(task);
    }),
  );

  app.patch(
    '/api/tasks/:id',
    serialize(async (req, res) => {
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
        return res
          .status(400)
          .json({ error: 'Title must be a non-empty string' });
      }

      if (
        Object.hasOwn(updates, 'completed') &&
        typeof updates.completed !== 'boolean'
      ) {
        return res.status(400).json({ error: 'completed must be a boolean' });
      }

      const updatedTask = { ...task };
      if (Object.hasOwn(updates, 'title')) {
        updatedTask.title = updates.title.trim();
      }

      if (Object.hasOwn(updates, 'completed')) {
        updatedTask.completed = updates.completed;
      }

      await commitTasks(
        tasks.map((task) => (task.id === id ? updatedTask : task)),
      );
      res.json(updatedTask);
    }),
  );

  app.delete(
    '/api/tasks/:id',
    serialize(async (req, res) => {
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

      await commitTasks(tasks.filter((task) => task.id !== id));
      res.status(204).end();
    }),
  );

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

  // These handlers must follow all routes.
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  app.use(errorHandler);
  return app;
}

export const app = createApp();
