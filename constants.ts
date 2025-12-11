import { Brand, FuelType } from './types';

export const SUPPORTED_BRANDS = [
  { label: 'Volkswagen Transporter', value: Brand.VW, color: 'bg-[#1e4063]' },
  { label: 'Honda', value: Brand.HONDA, color: 'bg-[#cc0000]' },
  { label: 'Mercedes-Benz', value: Brand.MERCEDES, color: 'bg-[#333333]' },
  { label: 'Other', value: Brand.OTHER, color: 'bg-slate-500' },
];

export const FUEL_TYPES = [
  FuelType.PETROL,
  FuelType.DIESEL,
  FuelType.HYBRID,
  FuelType.ELECTRIC
];

export const INITIAL_GREETING = "Hello! I'm your AI mechanic. I can help diagnose issues, suggest maintenance schedules, or guide you through repairs for your VW, Honda, or Mercedes. What seems to be the problem today?";
