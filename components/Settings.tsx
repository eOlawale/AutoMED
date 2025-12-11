import React, { useEffect } from 'react';
import { Theme } from '../types';
import { Moon, Sun, Download, Upload, Trash2, Smartphone, Palette, Check } from 'lucide-react';
import { storageService } from '../services/storageService';
import { COLOR_THEMES } from '../constants';

interface Props {
  theme: Theme;
  toggleTheme: () => void;
  colorTheme: string;
  setColorTheme: (name: string) => void;
}

export const Settings: React.FC<Props> = ({ theme, toggleTheme, colorTheme, setColorTheme }) => {
  
  const handleExport = () => {
    const data = {
      vehicles: storageService.getVehicles(),
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `automed_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Appearance</h2>
        
        {/* Light/Dark Mode */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-700 pb-6">
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

        {/* Accent Color */}
        <div className="space-y-4">
          <div className="space-y-1">
             <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-slate-400" />
                <h3 className="font-medium text-slate-800 dark:text-slate-200">Accent Color</h3>
             </div>
             <p className="text-sm text-slate-500 dark:text-slate-400">Customize the primary brand color.</p>
          </div>
          
          <div className="grid grid-cols-5 gap-3">
             {COLOR_THEMES.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColorTheme(c.name)}
                  className={`group relative h-12 rounded-lg border-2 transition-all flex items-center justify-center ${
                     colorTheme === c.name 
                        ? 'border-slate-600 dark:border-white scale-105' 
                        : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: `rgb(${c.colors[500]})` }}
                  title={c.label}
                >
                   {colorTheme === c.name && <Check className="w-5 h-5 text-white drop-shadow-md" />}
                </button>
             ))}
          </div>
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
          Add AutoMED to your home screen for quick access and offline capabilities.
          Tap "Share" then "Add to Home Screen" in your browser menu.
        </p>
      </div>
    </div>
  );
};