import { useEffect, useState } from 'react';
import { Header } from './components/Header.jsx';
import { TaskCard } from './components/TaskCard.jsx';
import { TaskForm } from './components/TaskForm.jsx';
import { Routes, Route, NavLink } from 'react-router-dom';
import { TaskDetails } from './components/TaskDetails.jsx';
import { PageSection } from './components/PageSection.jsx';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from './services/taskApi.js';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busy, setBusy] = useState(false);

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

  async function handleAddTask(title) {
    const newTask = await createTask(title);
    setTasks((previousTasks) => [...previousTasks, newTask]);
  }

  async function handleToggleTask(taskId) {
    const task = tasks.find((task) => task.id === taskId);
    setActionError('');
    setBusy(true);

    try {
      const updatedTask = await updateTask(taskId, {
        completed: !task.completed,
      });
      setTasks((previousTasks) =>
        previousTasks.map((task) => (task.id === taskId ? updatedTask : task)),
      );
    } catch (error) {
      setActionError(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteTask(taskId) {
    setActionError('');
    setBusy(true);

    try {
      await deleteTask(taskId);
      setTasks((previousTasks) =>
        previousTasks.filter((task) => task.id !== taskId),
      );
    } catch (error) {
      setActionError(error.message);
    } finally {
      setBusy(false);
    }
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
        {actionError && <p role="alert">{actionError}</p>}
        <Routes>
          <Route
            path="/"
            element={
              <PageSection title="Avaleht">
                <p>Siin saad oma ülesandeid hallata.</p>
              </PageSection>
            }
          />

          <Route
            path="/tasks"
            element={
              <PageSection title="Minu ülesanded">
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
                    disabled={busy}
                  />
                ))}
              </PageSection>
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
