import React, { useState, useEffect } from 'react';
import { Vehicle, DTC } from '../types';
import { geminiService } from '../services/geminiService';
import { storageService } from '../services/storageService';
import { AlertOctagon, CheckCircle2, Search, Trash2, Activity, Info, RotateCcw } from 'lucide-react';

interface Props {
  vehicle: Vehicle;
}

export const OBDScanner: React.FC<Props> = ({ vehicle }) => {
  const [code, setCode] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [history, setHistory] = useState<DTC[]>([]);
  const [selectedDTC, setSelectedDTC] = useState<DTC | null>(null);

  useEffect(() => {
    loadHistory();
  }, [vehicle.id]);

  const loadHistory = () => {
    setHistory(storageService.getDTCs(vehicle.id));
  };

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setAnalyzing(true);
    
    // Create temp DTC
    const analysis = await geminiService.interpretDTC(vehicle, code.toUpperCase());
    
    const newDTC: DTC = {
      id: crypto.randomUUID(),
      vehicleId: vehicle.id,
      code: code.toUpperCase(),
      description: analysis.description,
      aiAnalysis: analysis.analysis,
      possibleCauses: analysis.possibleCauses,
      severity: analysis.severity,
      detectedAt: new Date().toISOString(),
      status: 'active'
    };

    storageService.saveDTC(newDTC);
    loadHistory();
    setSelectedDTC(newDTC);
    setCode('');
    setAnalyzing(false);
  };

  const handleResolve = (id: string) => {
    storageService.resolveDTC(id);
    loadHistory();
    if (selectedDTC?.id === id) {
      setSelectedDTC(prev => prev ? { ...prev, status: 'resolved' } : null);
    }
  };

  const activeCount = history.filter(d => d.status === 'active').length;

  return (
    <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Left Panel: Scanner Input & List */}
      <div className="md:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-4 bg-slate-900 text-white">
          <div className="flex items-center justify-between mb-4">
             <h2 className="font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-400" />
              OBD-II Scanner
            </h2>
            {activeCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                {activeCount} Active
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter Code (e.g. P0300)"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-3 pr-10 py-2 text-sm text-white focus:ring-1 focus:ring-brand-500 outline-none placeholder:text-slate-500"
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !code}
              className="bg-brand-600 hover:bg-brand-500 text-white px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {analyzing ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {history.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No diagnostic history</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map(dtc => (
                <div
                  key={dtc.id}
                  onClick={() => setSelectedDTC(dtc)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedDTC?.id === dtc.id
                      ? 'bg-brand-50 border-brand-500 ring-1 ring-brand-500'
                      : 'bg-white border-slate-200 hover:border-brand-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-mono font-bold text-slate-800">{dtc.code}</span>
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      dtc.status === 'active' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {dtc.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">{dtc.description}</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {new Date(dtc.detectedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Analysis Detail */}
      <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-y-auto">
        {selectedDTC ? (
          <div className="space-y-6">
            <header className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold text-slate-900 font-mono">{selectedDTC.code}</h1>
                  {selectedDTC.severity === 'critical' && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded uppercase font-bold">Critical</span>}
                  {selectedDTC.severity === 'high' && <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded uppercase font-bold">High Severity</span>}
                  {selectedDTC.severity === 'medium' && <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded uppercase font-bold">Medium</span>}
                  {selectedDTC.severity === 'low' && <span className="bg-slate-500 text-white text-xs px-2 py-1 rounded uppercase font-bold">Low</span>}
                </div>
                <p className="text-lg text-slate-700">{selectedDTC.description}</p>
              </div>
              
              <div className="flex gap-2">
                {selectedDTC.status === 'active' ? (
                  <button
                    onClick={() => handleResolve(selectedDTC.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Resolved</span>
                  </button>
                ) : (
                  <span className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Resolved
                  </span>
                )}
              </div>
            </header>

            <div className="prose prose-slate max-w-none">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">AI Expert Analysis</h3>
                <p className="text-slate-800 whitespace-pre-line">{selectedDTC.aiAnalysis}</p>
              </div>

              {selectedDTC.possibleCauses && selectedDTC.possibleCauses.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-slate-900 mb-3">Possible Causes</h3>
                  <ul className="space-y-2">
                    {selectedDTC.possibleCauses.map((cause, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <AlertOctagon className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="bg-brand-50 p-4 rounded-xl border border-brand-100 mt-8">
              <h4 className="font-semibold text-brand-800 mb-1">Diagnosis Tip</h4>
              <p className="text-sm text-brand-700">
                For {vehicle.brand} vehicles, this code often triggers due to sensor fouling before actual failure. Check wiring harnesses first.
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <Activity className="w-16 h-16 mb-4 text-slate-200" />
            <h3 className="text-lg font-medium text-slate-600">Ready to Scan</h3>
            <p className="max-w-md text-center mt-2">
              Enter an OBD-II code from your scanner to get detailed AI diagnosis, probable causes, and repair advice tailored to your {vehicle.brand} {vehicle.model}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
