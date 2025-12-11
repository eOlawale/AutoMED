import React, { useState } from 'react';
import { Brand, FuelType, Vehicle, VehicleStatus, VehicleType } from '../types';
import { SUPPORTED_BRANDS, FUEL_TYPES } from '../constants';
import { Car, Check, X, Truck, Info, Search, FileText, Loader2, Download } from 'lucide-react';
import { vinService, VINInfo } from '../services/vinService';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

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
  
  // Validation & Decoding State
  const [vinError, setVinError] = useState('');
  const [decodedInfo, setDecodedInfo] = useState<VINInfo | null>(null);
  const [vinHistory, setVinHistory] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

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
    if (validateVin(val)) {
       // Clear previous decode if user changes valid VIN
       if (decodedInfo && decodedInfo.wmi + decodedInfo.vds + decodedInfo.vis !== val) {
         setDecodedInfo(null);
         setVinHistory(null);
       }
    }
  };

  const handleDecodeVin = () => {
    if (!validateVin(vin)) return;
    
    const info = vinService.decode(vin);
    setDecodedInfo(info);
    
    // Auto-fill available info
    if (info.brandEnum) {
      setBrand(info.brandEnum);
    }
    if (info.year) {
      setYear(info.year);
    }
  };

  const handleFindHistory = async () => {
    if (!decodedInfo) return;
    setLoadingHistory(true);
    const report = await geminiService.getVINInsights(vin, decodedInfo);
    setVinHistory(report);
    setLoadingHistory(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final check before submit
    if (vin && !validateVin(vin)) {
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
          {/* VIN Decoder Section */}
          <section className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">VIN (Vehicle Identification Number)</label>
              <div className="flex gap-2">
                {decodedInfo && !vinHistory && (
                  <button
                    type="button"
                    onClick={handleFindHistory}
                    disabled={loadingHistory}
                    className="text-xs flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    {loadingHistory ? <Loader2 className="w-3 h-3 animate-spin"/> : <Search className="w-3 h-3"/>}
                    Find History
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 mb-2">
               <div className="relative flex-1">
                <input
                  type="text"
                  value={vin}
                  onChange={handleVinChange}
                  placeholder="Enter 17-digit VIN"
                  className={`w-full rounded-lg border p-2.5 text-sm uppercase font-mono tracking-wider ${
                    vinError 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10 dark:border-red-500' 
                      : 'border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white'
                  }`}
                />
               </div>
               <button
                 type="button"
                 onClick={handleDecodeVin}
                 disabled={!vin || vin.length !== 17 || !!vinError}
                 className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 text-sm font-medium transition-colors disabled:opacity-50"
               >
                 Decode
               </button>
            </div>
            {vinError && (
              <p className="text-xs text-red-500 font-medium flex items-center gap-1 mb-2">
                {vinError}
              </p>
            )}

            {decodedInfo && (
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm animate-in fade-in slide-in-from-top-2">
                 <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-600">
                   <span className="text-xs text-slate-400 block uppercase">Manufacturer</span>
                   <span className="font-medium text-slate-800 dark:text-white">{decodedInfo.manufacturer}</span>
                 </div>
                 <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-600">
                   <span className="text-xs text-slate-400 block uppercase">Origin</span>
                   <span className="font-medium text-slate-800 dark:text-white">{decodedInfo.country} ({decodedInfo.region})</span>
                 </div>
                 <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-600">
                   <span className="text-xs text-slate-400 block uppercase">Model Year</span>
                   <span className="font-medium text-slate-800 dark:text-white">{decodedInfo.year || 'Unknown'}</span>
                 </div>
                 <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-600">
                   <span className="text-xs text-slate-400 block uppercase">Descriptor (VDS)</span>
                   <span className="font-medium text-slate-800 dark:text-white font-mono">{decodedInfo.vds}</span>
                 </div>
              </div>
            )}
            
            {vinHistory && (
              <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-brand-200 dark:border-brand-900 animate-in fade-in">
                 <h4 className="font-bold text-brand-700 dark:text-brand-400 flex items-center gap-2 mb-2">
                   <FileText className="w-4 h-4" />
                   Vehicle History & Specs Report
                 </h4>
                 <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
                    <ReactMarkdown>{vinHistory}</ReactMarkdown>
                 </div>
              </div>
            )}
          </section>

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
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Additional Info</h3>
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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Load Capacity</label>
                <input
                  type="text"
                  value={loadCapacity}
                  onChange={(e) => setLoadCapacity(e.target.value)}
                  placeholder="e.g. 800kg"
                  className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white border p-2.5 text-sm"
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nickname</label>
                <input
                  type="text"
                  placeholder="e.g. Blue Van"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white border p-2.5 text-sm"
                />
              </div>
             </div>
          </section>

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
              Save Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};