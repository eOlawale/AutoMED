import { Brand } from '../types';

export interface VINInfo {
  valid: boolean;
  manufacturer: string;
  country: string;
  year: number | null;
  region: string;
  wmi: string;
  vds: string;
  vis: string;
  brandEnum?: Brand;
}

const WMI_MAP: Record<string, { manufacturer: string; country: string; brand?: Brand }> = {
  'WVW': { manufacturer: 'Volkswagen', country: 'Germany', brand: Brand.VW },
  'WV1': { manufacturer: 'Volkswagen Commercial', country: 'Germany', brand: Brand.VW },
  'WV2': { manufacturer: 'Volkswagen Commercial', country: 'Germany', brand: Brand.VW },
  'WV3': { manufacturer: 'Volkswagen', country: 'Germany', brand: Brand.VW },
  '1VW': { manufacturer: 'Volkswagen USA', country: 'USA', brand: Brand.VW },
  '3VW': { manufacturer: 'Volkswagen Mexico', country: 'Mexico', brand: Brand.VW },
  'JHM': { manufacturer: 'Honda', country: 'Japan', brand: Brand.HONDA },
  '1HG': { manufacturer: 'Honda', country: 'USA', brand: Brand.HONDA },
  '2HG': { manufacturer: 'Honda', country: 'Canada', brand: Brand.HONDA },
  '3HG': { manufacturer: 'Honda', country: 'Mexico', brand: Brand.HONDA },
  'SHH': { manufacturer: 'Honda', country: 'UK', brand: Brand.HONDA },
  'WDB': { manufacturer: 'Mercedes-Benz', country: 'Germany', brand: Brand.MERCEDES },
  'WDD': { manufacturer: 'Mercedes-Benz', country: 'Germany', brand: Brand.MERCEDES },
  '4JG': { manufacturer: 'Mercedes-Benz', country: 'USA', brand: Brand.MERCEDES },
  'JT': { manufacturer: 'Toyota', country: 'Japan', brand: Brand.TOYOTA },
  '4T': { manufacturer: 'Toyota', country: 'USA', brand: Brand.TOYOTA },
  '5T': { manufacturer: 'Toyota', country: 'USA', brand: Brand.TOYOTA },
  'WF0': { manufacturer: 'Ford Europe', country: 'Germany', brand: Brand.FORD },
  '1F': { manufacturer: 'Ford', country: 'USA', brand: Brand.FORD },
  'JN': { manufacturer: 'Nissan', country: 'Japan', brand: Brand.NISSAN },
  '1N': { manufacturer: 'Nissan', country: 'USA', brand: Brand.NISSAN },
};

// Year codes cycle every 30 years. 
// For this app, we prioritize the 2000-2029 cycle where possible, but include late 90s.
// Ambiguous codes (L, M, N, P, R, S, T) are mapped to the newer cycle (2020+).
const YEAR_CODES: Record<string, number> = {
  'V': 1997, 'W': 1998, 'X': 1999, 'Y': 2000, 
  '1': 2001, '2': 2002, '3': 2003, '4': 2004, '5': 2005, 
  '6': 2006, '7': 2007, '8': 2008, '9': 2009, 
  'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014, 
  'F': 2015, 'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019, 
  'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024, 
  'S': 2025, 'T': 2026
};

export const vinService = {
  decode: (vin: string): VINInfo => {
    const cleanVin = vin.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (cleanVin.length !== 17) {
      return {
        valid: false,
        manufacturer: 'Unknown',
        country: 'Unknown',
        year: null,
        region: 'Unknown',
        wmi: '',
        vds: '',
        vis: ''
      };
    }

    const wmi = cleanVin.substring(0, 3);
    const vds = cleanVin.substring(3, 9);
    const vis = cleanVin.substring(9, 17);
    const yearCode = cleanVin.charAt(9);
    
    // Attempt WMI lookup (Try full 3 chars, then 2 chars)
    let makerInfo = WMI_MAP[wmi];
    if (!makerInfo) {
       const wmi2 = wmi.substring(0, 2);
       // Generic lookup for first 2 chars if explicit 3 fail
       if (Object.keys(WMI_MAP).some(k => k.startsWith(wmi2))) {
           // Find first match
           const matchKey = Object.keys(WMI_MAP).find(k => k.startsWith(wmi2));
           if (matchKey) makerInfo = WMI_MAP[matchKey];
       }
    }

    const year = YEAR_CODES[yearCode] || null;

    let region = 'Unknown';
    if (wmi.match(/^[A-H]/)) region = 'Africa';
    else if (wmi.match(/^[J-R]/)) region = 'Asia';
    else if (wmi.match(/^[S-Z]/)) region = 'Europe';
    else if (wmi.match(/^[1-5]/)) region = 'North America';
    else if (wmi.match(/^[6-7]/)) region = 'Oceania';
    else if (wmi.match(/^[8-9]/)) region = 'South America';

    return {
      valid: true,
      wmi,
      vds,
      vis,
      manufacturer: makerInfo?.manufacturer || 'Unknown Manufacturer',
      country: makerInfo?.country || 'Unknown Country',
      brandEnum: makerInfo?.brand,
      year,
      region
    };
  }
};