
import React from 'react';
import { motion } from 'framer-motion';
import { X, Save, Trash2, Download } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

const SettingsPanel = ({ isOpen, onClose }) => {
  const { userSettings, updateSetting, resetCareerData, careerStats } = useGame();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleExportData = () => {
    const data = JSON.stringify({ careerStats, settings: userSettings }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create temp link
    const a = document.createElement('a');
    a.href = url;
    a.download = `the-pass-save-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({ title: "Exported", description: "Save data downloaded successfully." });
  };

  const handleClearData = () => {
    if (confirm("Are you sure? This will delete ALL career progress.")) {
      resetCareerData();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-md h-full bg-slate-900 border-l border-slate-700 shadow-2xl overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-mono text-white">SETTINGS</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6 text-slate-400" />
            </Button>
          </div>

          <div className="space-y-8">
            {/* AUDIO SECTION */}
            <section className="space-y-4">
              <h3 className="text-sm uppercase tracking-wider text-yellow-500 font-bold border-b border-slate-700 pb-2">Audio</h3>
              
              <div>
                <label className="block text-sm text-slate-300 mb-2">Master Volume: {userSettings.masterVolume}%</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={userSettings.masterVolume}
                  onChange={(e) => updateSetting('masterVolume', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                />
              </div>

              <div className="space-y-2">
                <Toggle 
                  label="Sizzle Sounds" 
                  checked={userSettings.sizzleSounds} 
                  onChange={(v) => updateSetting('sizzleSounds', v)} 
                />
                <Toggle 
                  label="Ticket Printer" 
                  checked={userSettings.ticketPrinter} 
                  onChange={(v) => updateSetting('ticketPrinter', v)} 
                />
                <Toggle 
                  label="Kitchen Clatter" 
                  checked={userSettings.kitchenClatter} 
                  onChange={(v) => updateSetting('kitchenClatter', v)} 
                />
                 <Toggle 
                  label="Order Ding" 
                  checked={userSettings.orderCompleteDing} 
                  onChange={(v) => updateSetting('orderCompleteDing', v)} 
                />
              </div>
            </section>

            {/* VISUALS */}
            <section className="space-y-4">
              <h3 className="text-sm uppercase tracking-wider text-blue-500 font-bold border-b border-slate-700 pb-2">Visuals</h3>
              <Toggle 
                  label="Screen Shake / Stress FX" 
                  checked={userSettings.visualEffects} 
                  onChange={(v) => updateSetting('visualEffects', v)} 
              />
              <Toggle 
                  label="Color Blind Mode" 
                  checked={userSettings.colorBlindMode} 
                  onChange={(v) => updateSetting('colorBlindMode', v)} 
              />
              <div>
                 <label className="block text-sm text-slate-300 mb-1">UI Scale</label>
                 <select 
                    value={userSettings.uiScale}
                    onChange={(e) => updateSetting('uiScale', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white"
                 >
                    <option value="small">Compact</option>
                    <option value="normal">Normal</option>
                    <option value="large">Large</option>
                 </select>
              </div>
            </section>

             {/* GAMEPLAY */}
            <section className="space-y-4">
              <h3 className="text-sm uppercase tracking-wider text-red-500 font-bold border-b border-slate-700 pb-2">Difficulty</h3>
              <div>
                 <label className="block text-sm text-slate-300 mb-1">Prep Time Modifier</label>
                 <select 
                    value={userSettings.prepTimeMultiplier}
                    onChange={(e) => updateSetting('prepTimeMultiplier', parseFloat(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white"
                 >
                    <option value="0.8">0.8x (Less Time)</option>
                    <option value="1.0">1.0x (Normal)</option>
                    <option value="1.2">1.2x (More Time)</option>
                 </select>
              </div>
              <div>
                 <label className="block text-sm text-slate-300 mb-1">Grading Strictness</label>
                 <select 
                    value={userSettings.accuracyRequirement}
                    onChange={(e) => updateSetting('accuracyRequirement', parseInt(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white"
                 >
                    <option value="60">Lenient (60%)</option>
                    <option value="80">Standard (80%)</option>
                    <option value="95">Strict (95%)</option>
                 </select>
              </div>
            </section>

            {/* DATA */}
            <section className="space-y-4 pt-4 border-t border-slate-700">
               <Button onClick={handleExportData} variant="outline" className="w-full flex items-center justify-center gap-2">
                 <Download size={16} /> Export Save Data
               </Button>
               <Button onClick={handleClearData} variant="destructive" className="w-full flex items-center justify-center gap-2 bg-red-900 hover:bg-red-800">
                 <Trash2 size={16} /> Clear All Data
               </Button>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Toggle = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-slate-300">{label}</span>
    <button
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full p-1 transition-colors ${checked ? 'bg-green-600' : 'bg-slate-700'}`}
    >
      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  </div>
);

export default SettingsPanel;
