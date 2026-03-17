import { Rental, ViaCepAddress } from '@/types';
import { api } from './api';

type RentalFilters = {
  status?: string;
  dumpsterId?: string;
  customerName?: string;
};

function buildQuery(filters: RentalFilters) {
  const params = new URLSearchParams();

  if (filters.status) params.set('status', filters.status);
  if (filters.dumpsterId) params.set('dumpsterId', filters.dumpsterId);
  if (filters.customerName) params.set('customerName', filters.customerName);

  const query = params.toString();
  return query ? `?${query}` : '';
}

export const rentalsService = {
  list: (filters: RentalFilters = {}) =>
    api.get<Rental[]>(`/rentals${buildQuery(filters)}`),
  history: (filters: RentalFilters = {}) =>
    api.get<Rental[]>(`/rentals/history${buildQuery(filters)}`),
  create: (payload: Record<string, unknown>) => api.post<Rental>('/rentals', payload),
  finish: (id: string) => api.patch<Rental>(`/rentals/${id}/finish`),
  lookupZipCode: (zipCode: string) => api.get<ViaCepAddress>(`/viacep/${zipCode}`),
};
