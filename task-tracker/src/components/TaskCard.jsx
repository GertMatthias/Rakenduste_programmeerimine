import { Link } from 'react-router-dom';
import './TaskCard.css';

export function TaskCard({ task, onToggle, onDelete, disabled = false }) {
  return (
    <article className="task-card">
      <h2>
        <Link to={`/tasks/${task.id}`}>{task.title}</Link>
      </h2>
      <p>{task.completed ? 'Completed' : 'Not completed'}</p>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onToggle(task.id)}
      >
        Muuda staatust
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDelete(task.id)}
      >
        Kustuta
      </button>
    </article>
  );
}
