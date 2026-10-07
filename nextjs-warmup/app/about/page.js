import Link from 'next/link';

export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <section className="about-section" aria-labelledby="about-title">
      <p className="eyebrow">A bit about me</p>
      <h1 id="about-title">Hi, I’m Gert.</h1>
      <div className="about-card">
        <span className="avatar" aria-hidden="true">
          G
        </span>
        <div>
          <h2>Learning by building.</h2>
          <p>
            I’m an Informatics student at Tallinn University. I’m learning
            software development, and this project is my introduction to
            Next.js.
          </p>
          <p>
            It brings together a couple of pages, an interactive counter, and a
            small backend endpoint as part of my Applications Programming
            course.
          </p>
          <Link className="text-link" href="/">
            <span aria-hidden="true">←</span> Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
