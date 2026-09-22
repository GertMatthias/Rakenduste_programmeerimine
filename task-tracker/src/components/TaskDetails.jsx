import { Link, useParams } from 'react-router-dom';

export function TaskDetails({ tasks }) {
  const { taskId } = useParams();
  const task = tasks.find((task) => task.id === Number(taskId));

  if (!task) {
    return (
      <section>
        <h2>Ülesannet ei leitud</h2>
        <Link to="/tasks">Tagasi ülesannete juurde</Link>
      </section>
    );
  }

  return (
    <section>
      <h2>{task.title}</h2>
      <p>{task.completed ? 'Completed' : 'Not completed'}</p>
      <Link to="/tasks">Tagasi ülesannete juurde</Link>
    </section>
  );
}
