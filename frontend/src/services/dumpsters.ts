import { Dumpster } from '@/types';
import { api } from './api';

type DumpsterFilters = {
  serialNumber?: string;
  color?: string;
  status?: string;
};

function buildQuery(filters: DumpsterFilters) {
  const params = new URLSearchParams();

  if (filters.serialNumber) params.set('serialNumber', filters.serialNumber);
  if (filters.color) params.set('color', filters.color);
  if (filters.status) params.set('status', filters.status);

  const query = params.toString();
  return query ? `?${query}` : '';
}

export const dumpstersService = {
  list: (filters: DumpsterFilters = {}) =>
    api.get<Dumpster[]>(`/dumpsters${buildQuery(filters)}`),
  getById: (id: string) => api.get<Dumpster>(`/dumpsters/${id}`),
  create: (payload: Partial<Dumpster>) => api.post<Dumpster>('/dumpsters', payload),
  update: (id: string, payload: Partial<Dumpster>) =>
    api.patch<Dumpster>(`/dumpsters/${id}`, payload),
  remove: (id: string) => api.delete<Dumpster>(`/dumpsters/${id}`),
};
