import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { TaskForm } from './TaskForm.jsx';

test('keeps the title and displays a failed request', async () => {
  const user = userEvent.setup();
  const onAddTask = vi.fn().mockRejectedValue(new Error('Server unavailable'));
  render(<TaskForm onAddTask={onAddTask} />);
  const input = screen.getByRole('textbox');
  await user.type(input, '  Learn API  ');
  await user.click(screen.getByRole('button', { name: 'Lisa ülesanne' }));
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Server unavailable',
  );
  expect(input).toHaveValue('  Learn API  ');
  expect(onAddTask).toHaveBeenCalledWith('Learn API');
});

test('clears the title after a successful request', async () => {
  const user = userEvent.setup();
  render(<TaskForm onAddTask={vi.fn().mockResolvedValue(undefined)} />);
  const input = screen.getByRole('textbox');
  await user.type(input, 'Learn API');
  await user.click(screen.getByRole('button', { name: 'Lisa ülesanne' }));
  expect(input).toHaveValue('');
});
