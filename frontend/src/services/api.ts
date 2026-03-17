const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    let message = 'Erro ao processar a requisição.';

    try {
      const data = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(data.message)) {
        message = data.message.join(', ');
      } else if (data.message) {
        message = data.message;
      }
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string) =>
    request<T>(path, {
      method: 'DELETE',
    }),
};
