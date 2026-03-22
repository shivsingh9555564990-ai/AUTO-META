import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Loader2, Code2, AlertTriangle, CheckCircle } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function CommandCenterView() {
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleParseCommand = async () => {
    if (!command.trim()) return;
    
    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const prompt = `
You are the AI Brain for an Android Automation Controller. Parse the user's natural language command into a strict JSON format representing the intent and required actions.

Output JSON format:
{
  "intent": "string",
  "action_steps": ["string"],
  "required_permissions": ["string"],
  "external_api_calls": ["string"],
  "confirmation_required": boolean
}

Example: 'Good night routine' -> 
{
  "intent": "night_routine", 
  "action_steps": ["turn_on_silent_mode", "set_alarm_6am", "turn_off_wifi", "open_meditation_app"], 
  "required_permissions": ["DND", "ALARM", "WIFI"], 
  "external_api_calls": [], 
  "confirmation_required": false
}

Parse this command: "${command}"
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        setResult(parsed);
      } else {
        throw new Error("No response from AI");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to parse command');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Command Center</h1>
        <p className="text-slate-500">Test the AI Brain's natural language parsing capabilities.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <label htmlFor="command-input" className="block text-sm font-medium text-slate-700 mb-2">
          Natural Language Command
        </label>
        <div className="flex gap-3">
          <input
            id="command-input"
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleParseCommand()}
            placeholder="e.g., 'Turn off wifi and set an alarm for 7 AM'"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            disabled={isProcessing}
          />
          <button
            onClick={handleParseCommand}
            disabled={isProcessing || !command.trim()}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            Parse
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-700 p-4 rounded-xl flex items-start gap-3 border border-rose-200">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-slate-900 rounded-2xl shadow-lg overflow-hidden border border-slate-800">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <Code2 className="w-5 h-5" />
              Parsed JSON Output
            </div>
            {result.confirmation_required && (
              <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Confirmation Required
              </span>
            )}
          </div>
          <div className="p-6">
            <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
          
          <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-800">
            <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Execution Plan</h3>
            <ul className="space-y-2">
              {result.action_steps?.map((step: string, index: number) => (
                <li key={index} className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-medium text-slate-400 border border-slate-700">
                    {index + 1}
                  </div>
                  {step}
                </li>
              ))}
            </ul>
            
            {result.required_permissions?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800/50">
                <h3 className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Required Permissions</h3>
                <div className="flex flex-wrap gap-2">
                  {result.required_permissions.map((perm: string, index: number) => (
                    <span key={index} className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-xs border border-slate-700">
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
