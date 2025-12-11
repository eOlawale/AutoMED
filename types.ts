export enum Brand {
  VW = 'Volkswagen',
  HONDA = 'Honda',
  MERCEDES = 'Mercedes-Benz',
  OTHER = 'Other'
}

export enum FuelType {
  PETROL = 'Petrol',
  DIESEL = 'Diesel',
  HYBRID = 'Hybrid',
  ELECTRIC = 'Electric'
}

export interface Vehicle {
  id: string;
  name: string;
  brand: Brand;
  model: string;
  year: number;
  vin?: string;
  mileage: number;
  fuelType: FuelType;
  lastServiceDate?: string;
  imageUrl?: string;
}

export interface ServiceRecord {
  id: string;
  vehicleId: string;
  date: string;
  mileage: number;
  type: 'Oil Change' | 'Tire Rotation' | 'Inspection' | 'Repair' | 'Other' | 'Part Replacement';
  notes: string;
  cost: number;
  provider?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface MaintenanceTask {
  id: string;
  title: string;
  intervalMileage: number;
  intervalMonths: number;
  description: string;
  status: 'pending' | 'completed' | 'overdue';
}

export interface DTC {
  id: string;
  vehicleId: string;
  code: string; // e.g., P0300
  description?: string;
  aiAnalysis?: string;
  possibleCauses?: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: string;
  status: 'active' | 'resolved';
}
