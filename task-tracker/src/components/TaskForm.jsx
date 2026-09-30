import { useState } from 'react';

export function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle === '') {
      setError('Palun sisesta ülesande pealkiri.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await onAddTask(trimmedTitle);
      setTitle('');
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="task-title">Ülesande pealkiri</label>
      <input
        id="task-title"
        type="text"
        disabled={submitting}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        aria-invalid={error !== ''}
        aria-describedby={error ? 'task-title-error' : undefined}
      />

      <button type="submit" disabled={submitting}>
        {submitting ? 'Lisan...' : 'Lisa ülesanne'}
      </button>

      {error && (
        <p id="task-title-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
