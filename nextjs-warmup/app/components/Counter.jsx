'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <section className="experiment-card" aria-labelledby="counter-title">
      <div className="card-topline">
        <span className="card-number">01</span>
        <span className="tag">Interaction</span>
      </div>
      <h3 id="counter-title">One click at a time</h3>
      <p className="card-description">
        A small counter. Every click takes it one step further.
      </p>
      <div className="counter-display">
        <span
          className="counter-value"
          aria-live="polite"
          aria-atomic="true"
          aria-label={`Current count: ${count}`}
        >
          {count}
        </span>
        <span className="counter-caption">current count</span>
      </div>
      <button
        className="button button-primary"
        type="button"
        onClick={() => setCount((previous) => previous + 1)}
      >
        <span aria-hidden="true">+</span> Increase count
      </button>
    </section>
  );
}
