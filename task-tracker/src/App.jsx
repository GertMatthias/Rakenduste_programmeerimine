import { useState } from 'react';
import { Header } from './components/Header.jsx';
import { TaskCard } from './components/TaskCard.jsx';
import { TaskForm } from './components/TaskForm.jsx';
import './App.css';

const initialTasks = [
  { id: 1, title: 'Learn JSX', completed: true },
  { id: 2, title: 'Practise React state', completed: false },
  { id: 3, title: 'Build a Node.js API', completed: false },
];

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState('all');

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') {
      return task.completed;
    }

    if (filter === 'incomplete') {
      return !task.completed;
    }

    return true;
  });

  function handleAddTask(title) {
    setTasks((previousTasks) => {
      const nextId = Math.max(0, ...previousTasks.map((task) => task.id)) + 1;

      const newTask = {
        id: nextId,
        title: title,
        completed: false,
      };

      return [...previousTasks, newTask];
    });
  }

  function handleToggleTask(taskId) {
    setTasks((previousTasks) =>
      previousTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, completed: !task.completed };
        }

        return task;
      }),
    );
  }

  function handleDeleteTask(taskId) {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== taskId),
    );
  }

  return (
    <div className="app">
      <Header />
      <main>
        <TaskForm onAddTask={handleAddTask} />
        <div>
          <button
            type="button"
            onClick={() => setFilter('all')}
            aria-pressed={filter === 'all'}
          >
            Kõik
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            aria-pressed={filter === 'completed'}
          >
            Tehtud
          </button>
          <button
            type="button"
            onClick={() => setFilter('incomplete')}
            aria-pressed={filter === 'incomplete'}
          >
            Tegemata
          </button>
        </div>

        {filteredTasks.length === 0 && <p>No tasks found</p>}

        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </main>
    </div>
  );
}

export default App;
