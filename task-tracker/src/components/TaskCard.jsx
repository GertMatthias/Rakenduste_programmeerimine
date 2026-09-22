import { useState } from 'react';
import './TaskCard.css';

export function TaskCard({ task }) {
  const [completed, setCompleted] = useState(task.completed);

  function handleToggle() {
    setCompleted((previousCompleted) => !previousCompleted);
  }

  return (
    <article className="task-card">
      <h2>{task.title}</h2>
      <p>{completed ? 'Completed' : 'Not completed'}</p>

      {completed && <p>Tubli, ülesanne on tehtud!</p>}

      <button type="button" onClick={handleToggle}>
        Muuda staatust
      </button>
    </article>
  );
}
