import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { expect, test, vi } from 'vitest';
import { TaskCard } from './TaskCard.jsx';

test('displays the supplied task title', () => {
  const task = { id: 1, title: 'Learn JSX', completed: false };

  render(
    <MemoryRouter>
      <TaskCard task={task} onToggle={vi.fn()} onDelete={vi.fn()} />
    </MemoryRouter>,
  );

  expect(
    screen.getByRole('heading', { name: 'Learn JSX' }),
  ).toBeInTheDocument();
});

test('calls onToggle with the task ID when clicked', async () => {
  const user = userEvent.setup();
  const task = { id: 7, title: 'Test task', completed: false };
  const onToggle = vi.fn();

  render(
    <MemoryRouter>
      <TaskCard task={task} onToggle={onToggle} onDelete={vi.fn()} />
    </MemoryRouter>,
  );

  expect(onToggle).not.toHaveBeenCalled();

  await user.click(screen.getByRole('button', { name: 'Muuda staatust' }));

  expect(onToggle).toHaveBeenCalledTimes(1);
  expect(onToggle).toHaveBeenCalledWith(7);
});
