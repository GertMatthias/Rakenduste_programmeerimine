import { useState } from 'react';

export function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle === '') {
      setError('Palun sisesta ülesande pealkiri.');
      return;
    }

    onAddTask(trimmedTitle);
    setTitle('');
    setError('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="task-title">Ülesande pealkiri</label>
      <input
        id="task-title"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        aria-invalid={error !== ''}
        aria-describedby={error ? 'task-title-error' : undefined}
      />

      <button type="submit">Lisa ülesanne</button>

      {error && (
        <p id="task-title-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
