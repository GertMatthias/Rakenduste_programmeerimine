import { tasks } from './src/data/tasks.js';
import {
  getAllTasks,
  getTaskById,
  getCompletedTasks,
} from './src/taskFunctions.js';

console.log('Tere Task Trackeri backend’ist!');
console.log('Kõik ülesanded:', getAllTasks(tasks));
console.log('Ülesanne ID-ga 2:', getTaskById(tasks, 2));
console.log('Tehtud ülesanded:', getCompletedTasks(tasks));
console.log('Puuduv ülesanne:', getTaskById(tasks, 999));
console.log('Tühi loend:', getAllTasks([]));
