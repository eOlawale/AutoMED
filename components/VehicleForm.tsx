import React, { useState } from 'react';
import { Brand, FuelType, Vehicle, VehicleStatus, VehicleType } from '../types';
import { SUPPORTED_BRANDS, FUEL_TYPES } from '../constants';
import { Car, Check, X, Truck, Info } from 'lucide-react';

interface Props {
  onSave: (vehicle: Vehicle) => void;
  onCancel: () => void;
}

export const VehicleForm: React.FC<Props> = ({ onSave, onCancel }) => {
  const [brand, setBrand] = useState<Brand>(Brand.VW);
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [mileage, setMileage] = useState(0);
  const [fuelType, setFuelType] = useState<FuelType>(FuelType.DIESEL);
  const [name, setName] = useState('');
  
  // Fleet Fields
  const [vehicleType, setVehicleType] = useState<VehicleType>(VehicleType.VAN);
  const [status, setStatus] = useState<VehicleStatus>(VehicleStatus.ACTIVE);
  const [licensePlate, setLicensePlate] = useState('');
  const [vin, setVin] = useState('');
  const [loadCapacity, setLoadCapacity] = useState('');
  
  // Validation State
  const [vinError, setVinError] = useState('');

  const validateVin = (value: string): boolean => {
    if (!value) {
      setVinError('');
      return true;
    }
    const cleanVin = value.toUpperCase();

    // Check for illegal characters
    if (/[IOQ]/.test(cleanVin)) {
      setVinError('Standard VINs cannot contain letters I, O, or Q.');
      return false;
    }

    // Check for alphanumeric
    if (!/^[A-Z0-9]+$/.test(cleanVin)) {
        setVinError('VIN contains invalid characters.');
        return false;
    }

    // Check length (Standard is 17)
    if (cleanVin.length !== 17) {
      setVinError(`Standard VIN must be 17 characters (current: ${cleanVin.length}).`);
      return false;
    }

    setVinError('');
    return true;
  };

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setVin(val);
    // Real-time validation
    validateVin(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final check before submit
    if (!validateVin(vin)) {
      return;
    }

    const newVehicle: Vehicle = {
      id: crypto.randomUUID(),
      brand,
      model,
      year,
      mileage,
      fuelType,
      vehicleType,
      status,
      licensePlate,
      vin,
      loadCapacity,
      name: name || `${year} ${brand} ${model}`,
    };
    onSave(newVehicle);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="bg-slate-900 p-6 flex items-center justify-between text-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-brand-400" />
            <h2 className="text-xl font-bold">Add Fleet Vehicle</h2>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Vehicle Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Body Type</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                  className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white border p-2.5 text-sm"
                >
                  {Object.values(VehicleType).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as VehicleStatus)}
                  className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white border p-2.5 text-sm"
                >
                  <option value={VehicleStatus.ACTIVE}>Active</option>
                  <option value={VehicleStatus.MAINTENANCE}>Maintenance</option>
                  <option value={VehicleStatus.RETIRED}>Retired</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Brand</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value as Brand)}
                  className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white border p-2.5 text-sm"
                >
                  {SUPPORTED_BRANDS.map((b) => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Model</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Corolla, Civic, T6"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white border p-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Year</label>
                <input
                  type="number"
                  min="1950"
                  max={new Date().getFullYear() + 1}
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white border p-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fuel Type</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as FuelType)}
                  className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white border p-2.5 text-sm"
                >
                  {FUEL_TYPES.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Fleet Specifics */}
          <section>
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Fleet Documentation</h3>
             <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">License Plate</label>
                <input
                  type="text"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  placeholder="e.g. AB12 CDE"
                  className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white border p-2.5 text-sm uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">VIN (Optional)</label>
                <input
                  type="text"
                  value={vin}
                  onChange={handleVinChange}
                  className={`w-full rounded-lg border p-2.5 text-sm uppercase ${
                    vinError 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10 dark:border-red-500' 
                      : 'border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
                  }`}
                />
                {vinError && (
                  <p className="mt-1 text-xs text-red-500 font-medium flex items-center gap-1">
                    {vinError}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Mileage</label>
                <input
                  type="number"
                  min="0"
                  value={mileage}
                  onChange={(e) => setMileage(Number(e.target.value))}
                  className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white border p-2.5 text-sm"
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Load Capacity / Payload</label>
                <input
                  type="text"
                  value={loadCapacity}
                  onChange={(e) => setLoadCapacity(e.target.value)}
                  placeholder="e.g. 800kg"
                  className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white border p-2.5 text-sm"
                />
              </div>
             </div>
          </section>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nickname (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Delivery Van 1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white border p-2.5 text-sm"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Add Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
