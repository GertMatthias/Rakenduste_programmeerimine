import { useState } from 'react';
import { Header } from './components/Header.jsx';
import { TaskCard } from './components/TaskCard.jsx';
import './App.css';

const tasks = [
  { id: 1, title: 'Learn JSX', completed: true },
  { id: 2, title: 'Practise React state', completed: false },
  { id: 3, title: 'Build a Node.js API', completed: false },
];

function App() {
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

  return (
    <div className="app">
      <Header />
      <main>
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
          <TaskCard key={task.id} task={task} />
        ))}
      </main>
    </div>
  );
}

export default App;
