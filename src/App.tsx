import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  TerminalSquare, 
  Workflow, 
  ListOrdered, 
  Settings,
  Smartphone,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DashboardView from './components/DashboardView';
import CommandCenterView from './components/CommandCenterView';
import RulesView from './components/RulesView';
import LogsView from './components/LogsView';
import SettingsView from './components/SettingsView';

type View = 'dashboard' | 'command' | 'rules' | 'logs' | 'settings';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', id: 'dashboard', icon: LayoutDashboard },
    { name: 'Command Center', id: 'command', icon: TerminalSquare },
    { name: 'Automation Rules', id: 'rules', icon: Workflow },
    { name: 'Activity Logs', id: 'logs', icon: ListOrdered },
    { name: 'Settings', id: 'settings', icon: Settings },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView onNavigate={setCurrentView} />;
      case 'command': return <CommandCenterView />;
      case 'rules': return <RulesView />;
      case 'logs': return <LogsView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center z-20">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Smartphone className="w-5 h-5 text-emerald-400" />
          AutoDroid
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(isMobileMenuOpen || window.innerWidth >= 768) && (
          <motion.div 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={`
              fixed md:static inset-y-0 left-0 z-10 w-64 bg-slate-900 text-slate-300 
              flex flex-col transition-transform duration-300 ease-in-out
              ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}
          >
            <div className="p-6 hidden md:flex items-center gap-3 text-white font-bold text-xl border-b border-slate-800">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <Smartphone className="w-5 h-5 text-slate-900" />
              </div>
              AutoDroid
            </div>
            
            <nav className="flex-1 py-6 px-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id as View);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium
                      ${isActive 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'hover:bg-slate-800 hover:text-white'}
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    {item.name}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                  AD
                </div>
                <div className="text-sm">
                  <p className="text-white font-medium">Admin User</p>
                  <p className="text-slate-500 text-xs">Free Tier</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
