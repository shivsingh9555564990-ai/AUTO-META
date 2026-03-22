import React from 'react';
import { Activity, Workflow, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function DashboardView({ onNavigate }: { onNavigate: (view: string) => void }) {
  const stats = [
    { name: 'Active Rules', value: '12', icon: Workflow, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Commands Today', value: '48', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Success Rate', value: '98%', icon: CheckCircle2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Failed Actions', value: '1', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  const recentLogs = [
    { id: 1, command: 'Good night routine', status: 'success', time: '10 mins ago' },
    { id: 2, command: 'Turn on WiFi', status: 'success', time: '1 hour ago' },
    { id: 3, command: 'Reply to John: "Be there in 5"', status: 'failed', time: '2 hours ago' },
    { id: 4, command: 'Set alarm for 7 AM', status: 'success', time: '5 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Overview of your AutoDroid system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => onNavigate('command')}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors text-left"
            >
              <div>
                <p className="font-semibold text-slate-900">Test Command</p>
                <p className="text-sm text-slate-500">Send a natural language command to the AI Brain</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                →
              </div>
            </button>
            <button 
              onClick={() => onNavigate('rules')}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div>
                <p className="font-semibold text-slate-900">Create Rule</p>
                <p className="text-sm text-slate-500">Set up a new automated workflow</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                →
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            <button onClick={() => onNavigate('logs')} className="text-sm text-emerald-600 font-medium hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{log.command}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <Clock className="w-3 h-3" />
                      {log.time}
                    </div>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                  log.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
