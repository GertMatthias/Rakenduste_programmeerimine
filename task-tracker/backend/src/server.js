import { createApp } from './app.js';
import { loadTasks, saveTasks } from './taskStorage.js';
import { port, tasksFile } from './config.js';

const tasks = await loadTasks(tasksFile);
const app = createApp(tasks, (updatedTasks) =>
  saveTasks(tasksFile, updatedTasks),
);

app.listen(port, () => {
  console.log(`Backend töötab: http://localhost:${port}/api/health`);
});
