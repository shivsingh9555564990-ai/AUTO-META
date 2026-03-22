import React, { useState } from 'react';
import { Search, Filter, Clock, CheckCircle2, AlertCircle, Smartphone } from 'lucide-react';

export default function LogsView() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const logs = [
    { id: 1, type: 'command', message: 'Good night routine executed', status: 'success', time: '2026-03-22 10:30:00', device: 'Pixel 8 Pro' },
    { id: 2, type: 'automation', message: 'Battery Saver triggered (Battery < 20%)', status: 'success', time: '2026-03-22 09:15:22', device: 'Pixel 8 Pro' },
    { id: 3, type: 'command', message: 'Send SMS to Mom: "Call you later"', status: 'failed', time: '2026-03-22 08:45:10', device: 'Pixel 8 Pro', error: 'Permission denied: SEND_SMS' },
    { id: 4, type: 'automation', message: 'Morning Routine executed', status: 'success', time: '2026-03-22 07:00:00', device: 'Pixel 8 Pro' },
    { id: 5, type: 'system', message: 'AutoDroid Service started', status: 'success', time: '2026-03-22 06:55:00', device: 'Pixel 8 Pro' },
  ];

  const filteredLogs = logs.filter(log => {
    if (filter !== 'all' && log.status !== filter && log.type !== filter) return false;
    if (search && !log.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Activity Logs</h1>
          <p className="text-slate-500">Monitor system events, commands, and automation triggers.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Logs</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="command">Commands</option>
              <option value="automation">Automations</option>
            </select>
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Device</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                      log.status === 'success' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {log.status === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      {log.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900">{log.message}</span>
                      {log.error && (
                        <span className="text-xs text-rose-500 mt-1">{log.error}</span>
                      )}
                      <span className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">{log.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      {log.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <Smartphone className="w-4 h-4 text-slate-400" />
                      {log.device}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No logs found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
