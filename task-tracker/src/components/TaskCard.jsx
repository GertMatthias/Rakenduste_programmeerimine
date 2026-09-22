import './TaskCard.css';

export function TaskCard({ task, onToggle, onDelete }) {
  return (
    <article className="task-card">
      <h2>{task.title}</h2>
      <p>{task.completed ? 'Completed' : 'Not completed'}</p>

      <button type="button" onClick={() => onToggle(task.id)}>
        Muuda staatust
      </button>
      <button type="button" onClick={() => onDelete(task.id)}>
        Kustuta
      </button>
    </article>
  );
}
