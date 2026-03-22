import React, { useState } from 'react';
import { Shield, Lock, Bell, Smartphone, Database, Key } from 'lucide-react';

export default function SettingsView() {
  const [settings, setSettings] = useState({
    requireConfirmation: true,
    biometricVerification: true,
    encryptLogs: true,
    storeRawSms: false,
    backgroundExecution: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Security & Settings</h1>
        <p className="text-slate-500">Configure your AutoDroid security model and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2 bg-rose-50 rounded-lg">
              <Shield className="w-5 h-5 text-rose-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Security Model</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Require Confirmation</p>
                <p className="text-sm text-slate-500">All critical actions require manual approval</p>
              </div>
              <button 
                onClick={() => toggleSetting('requireConfirmation')}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.requireConfirmation ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.requireConfirmation ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Biometric Verification</p>
                <p className="text-sm text-slate-500">Require fingerprint for sensitive commands</p>
              </div>
              <button 
                onClick={() => toggleSetting('biometricVerification')}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.biometricVerification ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.biometricVerification ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Background Execution</p>
                <p className="text-sm text-slate-500">Allow actions while app is closed</p>
              </div>
              <button 
                onClick={() => toggleSetting('backgroundExecution')}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.backgroundExecution ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.backgroundExecution ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Database className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Data & Privacy</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Encrypt Logs Locally</p>
                <p className="text-sm text-slate-500">Store activity logs with AES-256 encryption</p>
              </div>
              <button 
                onClick={() => toggleSetting('encryptLogs')}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.encryptLogs ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.encryptLogs ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Store Raw SMS</p>
                <p className="text-sm text-slate-500">Keep original SMS content in database</p>
              </div>
              <button 
                onClick={() => toggleSetting('storeRawSms')}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.storeRawSms ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.storeRawSms ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* API Integrations */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6 lg:col-span-2">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Key className="w-5 h-5 text-purple-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Free Tier Integrations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">G</div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">Gemini API</p>
                  <p className="text-xs text-emerald-500 font-medium">Connected</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <Settings className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">F</div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">Firebase Spark</p>
                  <p className="text-xs text-emerald-500 font-medium">Connected</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <Settings className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">T</div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">Telegram Bot</p>
                  <p className="text-xs text-slate-400 font-medium">Not Connected</p>
                </div>
              </div>
              <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
