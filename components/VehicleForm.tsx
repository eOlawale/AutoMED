import React, { useState } from 'react';
import { Brand, FuelType, Vehicle } from '../types';
import { SUPPORTED_BRANDS, FUEL_TYPES } from '../constants';
import { Car, Check, X } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVehicle: Vehicle = {
      id: crypto.randomUUID(),
      brand,
      model,
      year,
      mileage,
      fuelType,
      name: name || `${year} ${brand} ${model}`,
    };
    onSave(newVehicle);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
        <div className="bg-slate-900 p-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Car className="w-6 h-6 text-brand-400" />
            <h2 className="text-xl font-bold">Add New Vehicle</h2>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value as Brand)}
                className="w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                {SUPPORTED_BRANDS.map((b) => (
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
              <input
                type="text"
                required
                placeholder="e.g. Transporter T6"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
              <input
                type="number"
                min="1950"
                max={new Date().getFullYear() + 1}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fuel Type</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as FuelType)}
                className="w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                {FUEL_TYPES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Current Mileage</label>
            <input
              type="number"
              min="0"
              value={mileage}
              onChange={(e) => setMileage(Number(e.target.value))}
              className="w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nickname (Optional)</label>
            <input
              type="text"
              placeholder="e.g. The Workhorse"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
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
