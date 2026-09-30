import { createApp } from './app.js';
import { loadTasks, saveTasks } from './taskStorage.js';

const port = 3000;
const filePath = './data/tasks.json';
const tasks = await loadTasks(filePath);
const app = createApp(tasks, (updatedTasks) =>
  saveTasks(filePath, updatedTasks),
);

app.listen(port, () => {
  console.log(`Backend töötab: http://localhost:${port}/api/health`);
});
