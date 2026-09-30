async function request(path, options = {}) {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error('API aadress on seadistamata (VITE_API_URL).');
  }

  let response;

  try {
    response = await fetch(`${apiUrl.replace(/\/$/, '')}${path}`, options);
  } catch {
    throw new Error(
      'Backend’iga ei saa ühendust. Kontrolli, et server töötab.',
    );
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || `Päring ebaõnnestus (${response.status}).`);
  }

  if (response.status === 204) {
    return;
  }

  return response.json();
}

export function getTasks() {
  return request('/tasks');
}

export function createTask(title) {
  return request('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
}

export function updateTask(id, updates) {
  return request(`/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, { method: 'DELETE' });
}
