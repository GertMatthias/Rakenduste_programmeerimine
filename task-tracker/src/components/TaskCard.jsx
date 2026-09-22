import './TaskCard.css';

export function TaskCard({ task }) {
  return (
    <article className="task-card">
      <h2>{task.title}</h2>
      <p>{task.completed ? 'Completed' : 'Not completed'}</p>
    </article>
  );
}
