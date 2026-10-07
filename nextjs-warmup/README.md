# Next.js Warm-up

A small Next.js project for my Applications Programming course at Tallinn University.
It has a Home page, an About page, a counter, and a button that loads a message from a Next.js API endpoint.

## Run locally

Use Node.js 20.9 or newer and npm. From the course repository root:

```bash
cd nextjs-warmup
npm ci
npm run dev -- --port 3001
```

Open http://localhost:3001. Port 3001 avoids the existing Task Tracker backend on port 3000.
This app is independent: the Task Tracker backend does not need to be running.

## Check and build

```bash
npm run lint
npm run build
npm start -- --port 3001
```

The production server also opens at http://localhost:3001. Stop the dev server before starting the production server on the same port.

## What to try

- Open Home and About using the navigation links.
- Click **Increase count** and watch the number go up from 0.
- Click **Load server message** to see **Hello from the Next.js backend!**
- Visit `/api/message` to see the JSON response directly.
- To inspect loading, select a slower network in browser DevTools and click the message button.
- To inspect failure, switch DevTools Network to Offline after the page loads and click the message button. Switch back online and retry.
- Take a screenshot of the Home page after the message appears.

## Structure

- `app/layout.js`: shared layout with navigation, HTML and body.
- `app/page.js`: Home page (Server Component).
- `app/about/page.js`: About page (Server Component).
- `app/components/Counter.jsx`: counter using client-side state.
- `app/components/ServerMessage.jsx`: loads the message on a button click, with loading and error feedback.
- `app/api/message/route.js`: GET endpoint returning the message.
- `app/globals.css`: plain CSS, including the mobile layout.

Only the two interactive components use `'use client'`. The project uses JavaScript, App Router,
ESLint, and the default `@/*` import alias. There is no Tailwind, React Router, Express, or database.

## Questions

### 1. What does Next.js provide beyond React alone?

Next.js adds file-based routing, server rendering, and backend endpoints. It gives me a project structure and build tools for putting these parts together.

### 2. Why does the counter need 'use client'?

The counter uses state and responds to button clicks in the browser. 'use client' lets it use React's useState and event handlers.

### 3. Where does the code in app/api/message/route.js run?

It runs on the server in the Next.js application. The browser requests /api/message and receives its JSON response.

### 4. How is this endpoint similar to an Express route?

Both handle an HTTP request at a URL and return a response. Here I export a GET function instead of registering an app.get handler in Express.

### 5. Why must secrets remain on the server?

People can inspect code and data sent to their browser. Keeping secrets on the server prevents exposing things like private API keys.

## Repository

This folder belongs to the existing course repository. It does not have its own Git repository.
GitHub publishing and the pull request are handled separately.
