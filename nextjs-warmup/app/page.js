import Link from 'next/link';
import Counter from '@/app/components/Counter';
import ServerMessage from '@/app/components/ServerMessage';

export default function HomePage() {
  return (
    <>
      <section className="intro" aria-labelledby="home-title">
        <p className="eyebrow">
          <span className="status-dot" /> A small learning project
        </p>
        <h1 id="home-title">
          A little interaction.
          <br />
          <span>A first step with Next.js.</span>
        </h1>
        <p className="intro-description">
          Welcome to my Next.js warm-up. Try a counter, get a message from the
          server, and explore how the pieces fit together.
        </p>
        <Link className="text-link" href="/about">
          Meet the student behind it <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <section className="playground" aria-labelledby="playground-title">
        <div className="section-heading">
          <h2 id="playground-title">Try it out</h2>
          <span>Two small experiments</span>
        </div>
        <div className="card-grid">
          <Counter />
          <ServerMessage />
        </div>
      </section>
      <p className="page-note">Small steps, working code. That’s the idea.</p>
    </>
  );
}
