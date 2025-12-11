export enum Brand {
  VW = 'Volkswagen',
  HONDA = 'Honda',
  MERCEDES = 'Mercedes-Benz',
  TOYOTA = 'Toyota',
  BMW = 'BMW',
  AUDI = 'Audi',
  FORD = 'Ford',
  HYUNDAI = 'Hyundai',
  NISSAN = 'Nissan',
  OTHER = 'Other'
}

export enum FuelType {
  PETROL = 'Petrol',
  DIESEL = 'Diesel',
  HYBRID = 'Hybrid',
  ELECTRIC = 'Electric'
}

export enum VehicleStatus {
  ACTIVE = 'Active',
  MAINTENANCE = 'Maintenance',
  RETIRED = 'Retired'
}

export enum VehicleType {
  SEDAN = 'Sedan',
  SUV = 'SUV',
  HATCHBACK = 'Hatchback',
  COUPE = 'Coupe',
  CONVERTIBLE = 'Convertible',
  WAGON = 'Wagon',
  VAN = 'Van',
  TRUCK = 'Truck',
  MOTORCYCLE = 'Motorcycle'
}

export interface Vehicle {
  id: string;
  name: string;
  brand: Brand;
  model: string;
  year: number;
  vin?: string;
  licensePlate?: string;
  mileage: number;
  fuelType: FuelType;
  vehicleType: VehicleType;
  status: VehicleStatus;
  loadCapacity?: string; // e.g. "1000kg"
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

export type Theme = 'light' | 'dark';

export interface ColorTheme {
  name: string;
  label: string;
  colors: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
    900: string;
  }
}
