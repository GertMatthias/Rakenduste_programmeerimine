import process from 'node:process';

export const port = Number(process.env.PORT ?? 3000);
export const tasksFile = process.env.TASKS_FILE ?? './data/tasks.json';

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535');
}

if (tasksFile.trim() === '') {
  throw new Error('TASKS_FILE must not be empty');
}
