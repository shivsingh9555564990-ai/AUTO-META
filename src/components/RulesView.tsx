import React, { useState } from 'react';
import { Plus, Workflow, MoreVertical, Play, Pause, Trash2 } from 'lucide-react';

export default function RulesView() {
  const [rules, setRules] = useState([
    { id: 1, name: 'Morning Routine', trigger: 'Time: 7:00 AM', actions: ['Turn off DND', 'Play Spotify', 'Read Weather'], active: true },
    { id: 2, name: 'Battery Saver', trigger: 'Battery < 20%', actions: ['Turn off WiFi', 'Lower Brightness', 'Send SMS to Emergency Contact'], active: true },
    { id: 3, name: 'Work Mode', trigger: 'Location: Office', actions: ['Turn on DND', 'Set Volume to 0'], active: false },
  ]);

  const toggleRule = (id: number) => {
    setRules(rules.map(rule => rule.id === id ? { ...rule, active: !rule.active } : rule));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Automation Rules</h1>
          <p className="text-slate-500">Manage your automated workflows and triggers.</p>
        </div>
        <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 flex items-center gap-2 transition-colors">
          <Plus className="w-5 h-5" />
          New Rule
        </button>
      </div>

      <div className="grid gap-4">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:shadow-md">
            <div className="flex items-start gap-4 flex-1">
              <div className={`p-3 rounded-xl ${rule.active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                <Workflow className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">{rule.name}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="font-medium text-slate-700">Trigger:</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-xs font-mono">{rule.trigger}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                  <span className="font-medium text-slate-700">Actions:</span>
                  <div className="flex flex-wrap gap-1">
                    {rule.actions.map((action, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-xs">
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
              <button 
                onClick={() => toggleRule(rule.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
                  rule.active 
                    ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200' 
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                {rule.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {rule.active ? 'Pause' : 'Enable'}
              </button>
              <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
