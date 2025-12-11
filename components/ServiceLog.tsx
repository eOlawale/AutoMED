import React, { useState, useEffect } from 'react';
import { Vehicle, ServiceRecord } from '../types';
import { storageService } from '../services/storageService';
import { Plus, Calendar, Wrench, DollarSign, Trash2, FileText } from 'lucide-react';

interface Props {
  vehicle: Vehicle;
}

export const ServiceLog: React.FC<Props> = ({ vehicle }) => {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mileage, setMileage] = useState(vehicle.mileage);
  const [type, setType] = useState<ServiceRecord['type']>('Oil Change');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [provider, setProvider] = useState('');

  useEffect(() => {
    loadRecords();
  }, [vehicle.id]);

  const loadRecords = () => {
    setRecords(storageService.getServiceRecords(vehicle.id));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      storageService.deleteServiceRecord(id);
      loadRecords();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: ServiceRecord = {
      id: crypto.randomUUID(),
      vehicleId: vehicle.id,
      date,
      mileage: Number(mileage),
      type,
      cost: Number(cost),
      notes,
      provider
    };
    storageService.addServiceRecord(newRecord);
    setShowForm(false);
    loadRecords();
    // Reset form
    setNotes('');
    setCost('');
    setProvider('');
  };

  const getTotalCost = () => records.reduce((acc, curr) => acc + (curr.cost || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Maintenance History</h2>
          <p className="text-sm text-slate-500">Total Spent: <span className="font-mono font-medium text-slate-900">${getTotalCost().toLocaleString()}</span></p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Log Service
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-brand-200 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-bold text-slate-800 mb-4">New Service Record</h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
              <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Mileage</label>
              <input type="number" required value={mileage} onChange={e => setMileage(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Service Type</label>
              <select value={type} onChange={e => setType(e.target.value as any)} className="w-full border rounded-lg p-2 text-sm">
                <option>Oil Change</option>
                <option>Tire Rotation</option>
                <option>Inspection</option>
                <option>Repair</option>
                <option>Part Replacement</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Cost</label>
              <input type="number" min="0" step="0.01" value={cost} onChange={e => setCost(e.target.value)} placeholder="0.00" className="w-full border rounded-lg p-2 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">Service Provider / Shop</label>
              <input type="text" value={provider} onChange={e => setProvider(e.target.value)} placeholder="e.g. Official Dealer, Self, Local Shop" className="w-full border rounded-lg p-2 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Details about parts used, warranty, etc." className="w-full border rounded-lg p-2 text-sm h-20" />
            </div>
            <div className="md:col-span-2 flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700">Save Record</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {records.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>No service records logged yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Details</th>
                  <th className="px-6 py-3 font-medium">Cost</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{new Date(record.date).toLocaleDateString()}</span>
                        <span className="text-xs text-slate-500">{record.mileage.toLocaleString()} mi</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {record.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-700">{record.notes || '-'}</p>
                      {record.provider && <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Wrench className="w-3 h-3"/> {record.provider}</p>}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">
                      {record.cost > 0 ? `$${record.cost.toFixed(2)}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(record.id)}
                        className="text-slate-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
