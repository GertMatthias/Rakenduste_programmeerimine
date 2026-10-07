import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: {
    default: 'Next.js Warm-up',
    template: '%s | Next.js Warm-up',
  },
  description:
    "Gert's introduction to Next.js: pages, components, and a small API.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <div className="site-shell">
          <header className="site-header">
            <Link className="brand" href="/" aria-label="Next.js Warm-up home">
              <span className="brand-mark" aria-hidden="true">
                N.
              </span>
              <span>Next.js Warm-up</span>
            </Link>
            <nav aria-label="Main navigation">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
            </nav>
          </header>
          <main id="main-content">{children}</main>
          <footer className="site-footer">
            <span>Made by Gert · Tallinn University</span>
            <span>Applications Programming / Part 2</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
