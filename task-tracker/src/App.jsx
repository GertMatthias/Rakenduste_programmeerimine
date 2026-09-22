import { useEffect, useState } from 'react';
import { Header } from './components/Header.jsx';
import { TaskCard } from './components/TaskCard.jsx';
import { TaskForm } from './components/TaskForm.jsx';
import { Routes, Route, NavLink } from 'react-router-dom';
import { TaskDetails } from './components/TaskDetails.jsx';
import { getTasks } from './services/taskApi.js';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadTasks() {
      try {
        const loadedTasks = await getTasks();

        if (!ignore) {
          setTasks(loadedTasks);
        }
      } catch (error) {
        if (!ignore) {
          setError(error.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadTasks();

    return () => {
      ignore = true;
    };
  }, []);

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

  if (loading) {
    return <p role="status">Laadin ülesandeid...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <div className="app">
      <Header />
      <nav aria-label="Peamenüü">
        <NavLink to="/" end>
          Avaleht
        </NavLink>
        {' | '}
        <NavLink to="/tasks">Ülesanded</NavLink>
      </nav>
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <section>
                <h2>Avaleht</h2>
                <p>Siin saad oma ülesandeid hallata.</p>
              </section>
            }
          />

          <Route
            path="/tasks"
            element={
              <>
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
              </>
            }
          />

          <Route
            path="/tasks/:taskId"
            element={<TaskDetails tasks={tasks} />}
          />

          <Route path="*" element={<h2>Lehte ei leitud</h2>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
