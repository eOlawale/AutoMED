import { Vehicle, ServiceRecord, DTC } from '../types';

const KEYS = {
  VEHICLES: 'automed_vehicles',
  RECORDS: 'automed_records',
  DTCS: 'automed_dtcs',
};

export const storageService = {
  getVehicles: (): Vehicle[] => {
    try {
      const data = localStorage.getItem(KEYS.VEHICLES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load vehicles', e);
      return [];
    }
  },

  saveVehicle: (vehicle: Vehicle): void => {
    const vehicles = storageService.getVehicles();
    const existingIndex = vehicles.findIndex(v => v.id === vehicle.id);
    if (existingIndex >= 0) {
      vehicles[existingIndex] = vehicle;
    } else {
      vehicles.push(vehicle);
    }
    localStorage.setItem(KEYS.VEHICLES, JSON.stringify(vehicles));
  },

  deleteVehicle: (id: string): void => {
    const vehicles = storageService.getVehicles().filter(v => v.id !== id);
    localStorage.setItem(KEYS.VEHICLES, JSON.stringify(vehicles));
  },

  // Service Records
  getServiceRecords: (vehicleId: string): ServiceRecord[] => {
    try {
      const allRecords: ServiceRecord[] = JSON.parse(localStorage.getItem(KEYS.RECORDS) || '[]');
      return allRecords.filter(r => r.vehicleId === vehicleId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (e) {
      return [];
    }
  },

  addServiceRecord: (record: ServiceRecord): void => {
    const allRecords: ServiceRecord[] = JSON.parse(localStorage.getItem(KEYS.RECORDS) || '[]');
    allRecords.push(record);
    localStorage.setItem(KEYS.RECORDS, JSON.stringify(allRecords));
  },

  deleteServiceRecord: (id: string): void => {
    let allRecords: ServiceRecord[] = JSON.parse(localStorage.getItem(KEYS.RECORDS) || '[]');
    allRecords = allRecords.filter(r => r.id !== id);
    localStorage.setItem(KEYS.RECORDS, JSON.stringify(allRecords));
  },

  // Diagnostic Trouble Codes (DTCs)
  getDTCs: (vehicleId: string): DTC[] => {
    try {
      const allDTCs: DTC[] = JSON.parse(localStorage.getItem(KEYS.DTCS) || '[]');
      return allDTCs.filter(d => d.vehicleId === vehicleId).sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());
    } catch (e) {
      return [];
    }
  },

  saveDTC: (dtc: DTC): void => {
    const allDTCs: DTC[] = JSON.parse(localStorage.getItem(KEYS.DTCS) || '[]');
    const existingIndex = allDTCs.findIndex(d => d.id === dtc.id);
    if (existingIndex >= 0) {
      allDTCs[existingIndex] = dtc;
    } else {
      allDTCs.push(dtc);
    }
    localStorage.setItem(KEYS.DTCS, JSON.stringify(allDTCs));
  },

  resolveDTC: (id: string): void => {
    const allDTCs: DTC[] = JSON.parse(localStorage.getItem(KEYS.DTCS) || '[]');
    const index = allDTCs.findIndex(d => d.id === id);
    if (index >= 0) {
      allDTCs[index].status = 'resolved';
      localStorage.setItem(KEYS.DTCS, JSON.stringify(allDTCs));
    }
  },

  deleteDTC: (id: string): void => {
    let allDTCs: DTC[] = JSON.parse(localStorage.getItem(KEYS.DTCS) || '[]');
    allDTCs = allDTCs.filter(d => d.id !== id);
    localStorage.setItem(KEYS.DTCS, JSON.stringify(allDTCs));
  }
};