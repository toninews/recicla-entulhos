export type DumpsterStatus = 'AVAILABLE' | 'RENTED';
export type RentalStatus = 'ACTIVE' | 'FINISHED';

export type Dumpster = {
  id: string;
  serialNumber: string;
  color: string;
  status: DumpsterStatus;
  createdAt: string;
  updatedAt: string;
  rentals?: Array<{
    id: string;
    customerName: string;
    startDate: string;
  }>;
};

export type Rental = {
  id: string;
  customerName: string;
  customerPhone: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string | null;
  district: string;
  city: string;
  state: string;
  reference?: string | null;
  startDate: string;
  endDate?: string | null;
  finishedAt?: string | null;
  notes?: string | null;
  status: RentalStatus;
  dumpsterId: string;
  createdAt: string;
  updatedAt: string;
  dumpster: Dumpster;
};

export type ViaCepAddress = {
  zipCode: string;
  street: string;
  complement: string;
  district: string;
  city: string;
  state: string;
};
