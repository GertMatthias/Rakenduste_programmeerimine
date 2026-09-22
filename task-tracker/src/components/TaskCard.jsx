import './TaskCard.css';

export function TaskCard() {
  const title = 'Learn JSX';

  return (
    <article className="task-card">
      <h2>{title}</h2>
      <p>Completed</p>
    </article>
  );
}
