import { Brand, FuelType, ColorTheme } from './types';

export const SUPPORTED_BRANDS = [
  { label: 'Volkswagen', value: Brand.VW, color: 'bg-[#1e4063]' },
  { label: 'Honda', value: Brand.HONDA, color: 'bg-[#cc0000]' },
  { label: 'Mercedes-Benz', value: Brand.MERCEDES, color: 'bg-[#333333]' },
  { label: 'Toyota', value: Brand.TOYOTA, color: 'bg-[#EB0A1E]' },
  { label: 'BMW', value: Brand.BMW, color: 'bg-[#0066B1]' },
  { label: 'Audi', value: Brand.AUDI, color: 'bg-[#BB0A30]' },
  { label: 'Ford', value: Brand.FORD, color: 'bg-[#003478]' },
  { label: 'Hyundai', value: Brand.HYUNDAI, color: 'bg-[#002C5F]' },
  { label: 'Nissan', value: Brand.NISSAN, color: 'bg-[#C3002F]' },
  { label: 'Other', value: Brand.OTHER, color: 'bg-slate-500' },
];

export const FUEL_TYPES = [
  FuelType.PETROL,
  FuelType.DIESEL,
  FuelType.HYBRID,
  FuelType.ELECTRIC
];

export const INITIAL_GREETING = "Hello! I'm your AI mechanic. I can help diagnose issues, suggest maintenance schedules, or guide you through repairs for your vehicle. What seems to be the problem today?";

export const COLOR_THEMES: ColorTheme[] = [
  {
    name: 'blue',
    label: 'Sky Blue',
    colors: {
      50: '240 249 255',
      100: '224 242 254',
      500: '14 165 233',
      600: '2 132 199',
      700: '3 105 161',
      900: '12 74 110',
    }
  },
  {
    name: 'emerald',
    label: 'Emerald Green',
    colors: {
      50: '236 253 245',
      100: '209 250 229',
      500: '16 185 129',
      600: '5 150 105',
      700: '4 120 87',
      900: '6 78 59',
    }
  },
  {
    name: 'violet',
    label: 'Electric Violet',
    colors: {
      50: '245 243 255',
      100: '237 233 254',
      500: '139 92 246',
      600: '124 58 237',
      700: '109 40 217',
      900: '76 29 149',
    }
  },
  {
    name: 'orange',
    label: 'Sunset Orange',
    colors: {
      50: '255 247 237',
      100: '255 237 213',
      500: '249 115 22',
      600: '234 88 12',
      700: '194 65 12',
      900: '124 45 18',
    }
  },
  {
    name: 'rose',
    label: 'Rose Red',
    colors: {
      50: '255 241 242',
      100: '255 228 230',
      500: '244 63 94',
      600: '225 29 72',
      700: '190 18 60',
      900: '136 19 55',
    }
  }
];
