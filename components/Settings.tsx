import React from 'react';
import { Theme } from '../types';
import { Moon, Sun, Download, Upload, Trash2, Smartphone } from 'lucide-react';
import { storageService } from '../services/storageService';

interface Props {
  theme: Theme;
  toggleTheme: () => void;
}

export const Settings: React.FC<Props> = ({ theme, toggleTheme }) => {
  
  const handleExport = () => {
    const data = {
      vehicles: storageService.getVehicles(),
      // Note: A full export would need to gather all local storage keys
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `automate_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-medium text-slate-800 dark:text-slate-200">App Theme</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Toggle between light and dark mode for better readability.</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-xl transition-all ${
              theme === 'dark' 
                ? 'bg-slate-700 text-brand-400' 
                : 'bg-brand-50 text-brand-600'
            }`}
          >
            {theme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Data Management</h2>
        
        <div className="space-y-4">
          <button 
            onClick={handleExport}
            className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <div className="text-left">
                <p className="font-medium text-slate-900 dark:text-white">Export Data</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Download a JSON backup of your fleet</p>
              </div>
            </div>
          </button>
          
           <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-slate-400" />
              <div className="text-left">
                <p className="font-medium text-slate-900 dark:text-white">Import Data</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Restore from backup (Coming Soon)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Smartphone className="w-6 h-6" />
          <h2 className="text-xl font-bold">Install App</h2>
        </div>
        <p className="text-brand-100 mb-4 text-sm">
          Add AutoMate Pro to your home screen for quick access and offline capabilities.
          Tap "Share" then "Add to Home Screen" in your browser menu.
        </p>
      </div>
    </div>
  );
};
