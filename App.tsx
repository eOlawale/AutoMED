import React, { useState, useEffect } from 'react';
import { Vehicle, Theme, View } from './types';
import { storageService } from './services/storageService';
import { VehicleForm } from './components/VehicleForm';
import { Dashboard } from './components/Dashboard';
import { DiagnosisChat } from './components/DiagnosisChat';
import { OBDScanner } from './components/OBDScanner';
import { ServiceLog } from './components/ServiceLog';
import { Settings } from './components/Settings';
import { 
  Car, 
  Wrench, 
  Plus, 
  Settings as SettingsIcon, 
  LayoutDashboard, 
  MessageSquareWarning,
  BookOpen,
  Activity,
  ClipboardList
} from 'lucide-react';
import { SUPPORTED_BRANDS, COLOR_THEMES } from './constants';

const App: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  
  // State for current view and default view preference
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [defaultView, setDefaultView] = useState<View>(View.DASHBOARD);

  const [showAddModal, setShowAddModal] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [colorTheme, setColorTheme] = useState('blue');

  useEffect(() => {
    // Load data
    const storedVehicles = storageService.getVehicles();
    setVehicles(storedVehicles);
    if (storedVehicles.length > 0 && !selectedVehicleId) {
      setSelectedVehicleId(storedVehicles[0].id);
    }
    
    // Load theme preference
    const storedTheme = localStorage.getItem('automed_theme') as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    // Load color preference
    const storedColor = localStorage.getItem('automed_color');
    if (storedColor) {
      setColorTheme(storedColor);
    }

    // Load default view preference
    const storedDefaultView = localStorage.getItem('automed_default_view') as View;
    if (storedDefaultView && Object.values(View).includes(storedDefaultView)) {
      setDefaultView(storedDefaultView);
      setCurrentView(storedDefaultView); // Set initial view to default
    }
  }, []);

  useEffect(() => {
    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('automed_theme', theme);
  }, [theme]);

  useEffect(() => {
     // Apply color variables to root
     const root = document.documentElement;
     const selected = COLOR_THEMES.find(c => c.name === colorTheme) || COLOR_THEMES[0];
     
     root.style.setProperty('--brand-50', selected.colors[50]);
     root.style.setProperty('--brand-100', selected.colors[100]);
     root.style.setProperty('--brand-500', selected.colors[500]);
     root.style.setProperty('--brand-600', selected.colors[600]);
     root.style.setProperty('--brand-700', selected.colors[700]);
     root.style.setProperty('--brand-900', selected.colors[900]);

     localStorage.setItem('automed_color', colorTheme);
  }, [colorTheme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSetDefaultView = (view: View) => {
    setDefaultView(view);
    localStorage.setItem('automed_default_view', view);
  };

  const handleSaveVehicle = (v: Vehicle) => {
    storageService.saveVehicle(v);
    setVehicles(storageService.getVehicles());
    setSelectedVehicleId(v.id);
    setShowAddModal(false);
  };

  const activeVehicle = vehicles.find(v => v.id === selectedVehicleId);
  const brandColor = activeVehicle 
    ? SUPPORTED_BRANDS.find(b => b.value === activeVehicle.brand)?.color || 'bg-brand-600'
    : 'bg-slate-800';

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row transition-colors duration-300`}>
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col z-10 transition-colors duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">AutoMED</span>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2 px-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fleet / Garage</h3>
              <button 
                onClick={() => setShowAddModal(true)}
                className="text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-700 p-1 rounded transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-1">
              {vehicles.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicleId(v.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedVehicleId === v.id 
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  <span className="truncate">{v.name}</span>
                </button>
              ))}
              {vehicles.length === 0 && (
                <div className="text-sm text-slate-400 px-3 py-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                  No vehicles yet
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
             <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Diagnostic Tools</h3>
            <button
              onClick={() => setCurrentView(View.DASHBOARD)}
              disabled={!activeVehicle}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === View.DASHBOARD 
                  ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              } disabled:opacity-50`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </button>
            
            <button
              onClick={() => setCurrentView(View.DIAGNOSIS)}
              disabled={!activeVehicle}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === View.DIAGNOSIS 
                  ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              } disabled:opacity-50`}
            >
              <MessageSquareWarning className="w-4 h-4" />
              AI Mechanic
            </button>

            <button
              onClick={() => setCurrentView(View.OBD)}
              disabled={!activeVehicle}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === View.OBD 
                  ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              } disabled:opacity-50`}
            >
              <Activity className="w-4 h-4" />
              OBD-II Scanner
            </button>

            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-6 px-2">Maintenance</h3>
            
            <button
              onClick={() => setCurrentView(View.MAINTENANCE)}
              disabled={!activeVehicle}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === View.MAINTENANCE
                  ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              } disabled:opacity-50`}
            >
              <ClipboardList className="w-4 h-4" />
              Service Log
            </button>

             <button
              onClick={() => setCurrentView(View.GUIDES)}
              disabled={!activeVehicle}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === View.GUIDES 
                  ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              } disabled:opacity-50`}
            >
              <BookOpen className="w-4 h-4" />
              DIY Guides
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
           <button 
             onClick={() => setCurrentView(View.SETTINGS)}
             className={`flex w-full items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors ${
               currentView === View.SETTINGS
                 ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
                 : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
             }`}
           >
             <SettingsIcon className="w-4 h-4" />
             <span>Settings</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20 transition-colors duration-300">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">{currentView}</h1>
            {activeVehicle && currentView !== View.SETTINGS && (
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${brandColor.replace('bg-', 'bg-')}`}></span>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{activeVehicle.year} {activeVehicle.brand} {activeVehicle.model}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{activeVehicle.fuelType} • {activeVehicle.mileage.toLocaleString()} mi</p>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="p-4 md:p-6 max-w-5xl mx-auto">
          {currentView === View.SETTINGS ? (
            <Settings 
              theme={theme} 
              toggleTheme={toggleTheme} 
              colorTheme={colorTheme}
              setColorTheme={setColorTheme}
              defaultView={defaultView}
              setDefaultView={handleSetDefaultView}
            />
          ) : !activeVehicle ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Car className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Welcome to AutoMED</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                Get started by adding your first vehicle to track maintenance, diagnose issues, and get expert advice.
              </p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 dark:shadow-none"
              >
                Add Your First Vehicle
              </button>
            </div>
          ) : (
            <>
              {currentView === View.DASHBOARD && <Dashboard vehicle={activeVehicle} />}
              {currentView === View.OBD && <OBDScanner vehicle={activeVehicle} />}
              {currentView === View.MAINTENANCE && <ServiceLog vehicle={activeVehicle} />}
              {currentView === View.DIAGNOSIS && (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <DiagnosisChat vehicle={activeVehicle} />
                  </div>
                  <div className="space-y-4">
                     <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-amber-900 dark:text-amber-200">
                       <h3 className="font-bold flex items-center gap-2 mb-2">
                         <MessageSquareWarning className="w-5 h-5" />
                         Safety First
                       </h3>
                       <p className="text-sm opacity-90">
                         Always ensure the engine is cool before touching components. Use jack stands when working under the vehicle. If a warning light is flashing, stop immediately.
                       </p>
                     </div>
                     <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                       <h3 className="font-bold text-slate-800 dark:text-white mb-2">Common Issues</h3>
                       <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-300">
                         {activeVehicle.brand === 'Volkswagen' && <li>• DPF Regeneration issues</li>}
                         {activeVehicle.brand === 'Volkswagen' && <li>• DSG Gearbox service due</li>}
                         {activeVehicle.brand === 'Honda' && <li>• VTEC Solenoid gasket leaks</li>}
                         {activeVehicle.brand === 'Honda' && <li>• AC Compressor relay</li>}
                         {activeVehicle.brand === 'Mercedes-Benz' && <li>• Air suspension (Airmatic) leaks</li>}
                         <li>• Battery voltage low</li>
                       </ul>
                     </div>
                  </div>
                </div>
              )}
              {currentView === View.GUIDES && <GuideGenerator vehicle={activeVehicle} />}
            </>
          )}
        </div>
      </main>

      {showAddModal && (
        <VehicleForm 
          onSave={handleSaveVehicle} 
          onCancel={() => setShowAddModal(false)} 
        />
      )}
    </div>
  );
};

// Sub-component for Guides to keep file size managed
import { geminiService } from './services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Search } from 'lucide-react';

const GuideGenerator: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => {
  const [query, setQuery] = useState('');
  const [guide, setGuide] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if(!query) return;
    setLoading(true);
    const result = await geminiService.getDIYGuide(vehicle, query);
    setGuide(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">DIY Maintenance Guides</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Change oil, Replace headlight bulb, Cabin filter"
            className="flex-1 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-500 outline-none placeholder:text-slate-400"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Get Guide'}
          </button>
        </div>
      </div>

      {guide && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 prose prose-slate dark:prose-invert max-w-none">
          <ReactMarkdown>{guide}</ReactMarkdown>
        </div>
      )}
      
      {!guide && !loading && (
        <div className="grid md:grid-cols-3 gap-4">
           {['Change Engine Oil', 'Replace Air Filter', 'Check Brake Pads', 'Top up AdBlue', 'Reset Service Light'].map(task => (
             <button 
               key={task}
               onClick={() => { setQuery(task); handleSearch(); }}
               className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-400 text-left transition-colors"
             >
               <span className="font-medium text-slate-700 dark:text-slate-200">{task}</span>
             </button>
           ))}
        </div>
      )}
    </div>
  );
};

export default App;