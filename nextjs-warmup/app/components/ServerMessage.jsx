'use client';

import { useState } from 'react';

export default function ServerMessage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadMessage() {
    if (loading) return;
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/message');
      if (!response.ok) {
        throw new Error(
          'The server could not load the message. Please try again.',
        );
      }
      const data = await response.json();
      if (typeof data.message !== 'string') {
        throw new Error(
          'The server returned an unexpected message. Please try again.',
        );
      }
      setMessage(data.message);
    } catch (error) {
      setError(
        error instanceof TypeError
          ? 'Could not reach the server. Check your connection and try again.'
          : error.message || 'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="experiment-card" aria-labelledby="message-title">
      <div className="card-topline">
        <span className="card-number">02</span>
        <span className="tag">Connection</span>
      </div>
      <h3 id="message-title">A hello from the server</h3>
      <p className="card-description">
        Ask the backend for a message and see its reply here.
      </p>
      <div
        className={`message-display${message ? ' has-message' : ''}${error ? ' has-error' : ''}`}
      >
        <p role="status" aria-live="polite" aria-atomic="true">
          {loading
            ? 'Loading message…'
            : message || (!error && 'No message yet. Give it a try.')}
        </p>
        {error && <p role="alert">{error}</p>}
      </div>
      <button
        className="button button-secondary"
        type="button"
        onClick={loadMessage}
        disabled={loading}
      >
        Load server message
      </button>
    </section>
  );
}
