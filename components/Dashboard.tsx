import React, { useState, useEffect } from 'react';
import { Vehicle, DTC, VehicleStatus } from '../types';
import { AlertTriangle, Wrench, Calendar, Gauge, Droplet, Battery, Activity, CheckCircle2, Truck, FileText, Hash } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { storageService } from '../services/storageService';

interface Props {
  vehicle: Vehicle;
}

export const Dashboard: React.FC<Props> = ({ vehicle }) => {
  const [maintenanceTasks, setMaintenanceTasks] = useState<any[]>([]);
  const [activeDTCs, setActiveDTCs] = useState<DTC[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Load DTCs from storage
      const dtcs = storageService.getDTCs(vehicle.id).filter(d => d.status === 'active');
      setActiveDTCs(dtcs);

      // In a real app, we would cache this or store it in the vehicle object
      const tasks = await geminiService.getMaintenanceSchedule(vehicle);
      setMaintenanceTasks(tasks.slice(0, 4)); // Show top 4
      setIsLoading(false);
    };
    loadData();
  }, [vehicle]);

  return (
    <div className="space-y-6">
      {/* Active Alerts Banner */}
      {activeDTCs.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-red-900 dark:text-red-200">Attention Required: {activeDTCs.length} Active Fault(s)</h3>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              Your vehicle has unresolved diagnostic codes ({activeDTCs.map(d => d.code).join(', ')}). 
              Check the OBD Scanner tool for detailed diagnosis.
            </p>
          </div>
        </div>
      )}

      {/* Fleet Status Card (New) */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            vehicle.status === VehicleStatus.ACTIVE ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
            vehicle.status === VehicleStatus.MAINTENANCE ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
            'bg-slate-100 text-slate-600'
          }`}>
             <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Fleet Status</p>
            <p className="font-bold text-slate-800 dark:text-white">{vehicle.status}</p>
          </div>
        </div>

        {vehicle.licensePlate && (
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
             <Hash className="w-4 h-4 text-slate-400" />
             <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{vehicle.licensePlate}</span>
          </div>
        )}

        {vehicle.loadCapacity && (
           <div className="flex items-center gap-2">
             <span className="text-xs text-slate-400">Payload:</span>
             <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{vehicle.loadCapacity}</span>
           </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <Gauge className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Mileage</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">{vehicle.mileage.toLocaleString()}</p>
          <span className="text-xs text-slate-400">Total miles</span>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Health</span>
          </div>
          {activeDTCs.length === 0 ? (
            <div>
               <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Good</p>
               <span className="text-xs text-slate-400">No active codes</span>
            </div>
          ) : (
            <div>
               <p className="text-2xl font-bold text-amber-500">Check</p>
               <span className="text-xs text-slate-400">{activeDTCs.length} Issues</span>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <Droplet className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Oil Status</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">80%</p>
          <span className="text-xs text-slate-400">Estimated life</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Next Service</span>
          </div>
          <p className="text-xl font-bold text-slate-800 dark:text-white">3,400 mi</p>
          <span className="text-xs text-slate-400">or 4 months</span>
        </div>
      </div>

      {/* AI Recommended Maintenance */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            AI Recommended Maintenance
          </h3>
          <span className="text-xs px-2 py-1 bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300 rounded-full font-medium">Gemini Powered</span>
        </div>
        
        <div className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400 animate-pulse">
              Generating schedule for {vehicle.model}...
            </div>
          ) : maintenanceTasks.length > 0 ? (
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
              {maintenanceTasks.map((task, idx) => (
                <li key={idx} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-start gap-3">
                  <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${task.priority === 'High' ? 'bg-red-500' : 'bg-amber-400'}`} />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-slate-800 dark:text-white">{task.title}</h4>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                        +{task.intervalMileage} mi
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{task.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
             <div className="p-8 text-center text-slate-400">
              No immediate actions required.
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Actions Grid */}
      <h3 className="font-semibold text-slate-800 dark:text-white">Quick Checks</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {['Tire Pressure', 'Oil Level', 'Brake Fluid', 'Coolant', 'Lights', 'Wipers'].map((item) => (
           <button key={item} className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md transition-all group">
             <span className="block text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400">{item}</span>
             <span className="text-xs text-slate-400">Log Check</span>
           </button>
        ))}
      </div>
    </div>
  );
};
