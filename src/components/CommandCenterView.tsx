import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Mic, MicOff, Loader2, Code2, AlertTriangle, Activity, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function CommandCenterView() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Mini Window State
  const [miniWindow, setMiniWindow] = useState<{isOpen: boolean, url: string, title: string}>({isOpen: false, url: '', title: ''});

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef('');

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('');
        transcriptRef.current = '';
        setError(null);
        setResult(null);
      };

      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        transcriptRef.current = currentTranscript;
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error !== 'no-speech') {
          setError(`Microphone error: ${event.error}. Please ensure microphone permissions are granted.`);
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (transcriptRef.current.trim()) {
          handleParseCommand(transcriptRef.current.trim());
        }
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError("Voice recognition is not supported in your browser. Try using Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleParseCommand = async (textToParse: string) => {
    if (!textToParse) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      const prompt = `
You are the AI Brain for an Android Automation Controller. Parse the user's natural language command into a strict JSON format representing the intent and required actions.

If the user asks to open a website, app, or search for something (like YouTube, Google, Wikipedia), provide a "ui_action" to open it in a mini window.
CRITICAL: For YouTube, ALWAYS use the embed URL format: "https://www.youtube.com/embed?listType=search&list=SEARCH_QUERY".
For Google search, use "https://www.bing.com/search?q=SEARCH_QUERY" (Bing allows iframes, Google blocks them).
For Wikipedia, use "https://en.wikipedia.org/wiki/SEARCH_QUERY".

Output JSON format:
{
  "intent": "string",
  "action_steps": ["string"],
  "required_permissions": ["string"],
  "external_api_calls": ["string"],
  "confirmation_required": boolean,
  "ui_action": {
    "type": "open_mini_window",
    "url": "string",
    "title": "string"
  } // Include this ONLY if opening a mini window is appropriate
}

Example: 'Open YouTube and play lo-fi hip hop' -> 
{
  "intent": "play_music", 
  "action_steps": ["open_youtube_mini_window"], 
  "required_permissions": ["INTERNET"], 
  "external_api_calls": [], 
  "confirmation_required": false,
  "ui_action": {
    "type": "open_mini_window",
    "url": "https://www.youtube.com/embed?listType=search&list=lo-fi+hip+hop",
    "title": "YouTube: lo-fi hip hop"
  }
}

Parse this command: "${textToParse}"
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
        
        // Trigger Mini Window if requested by AI
        if (parsed.ui_action && parsed.ui_action.type === 'open_mini_window' && parsed.ui_action.url) {
          setMiniWindow({
            isOpen: true,
            url: parsed.ui_action.url,
            title: parsed.ui_action.title || 'Mini Window'
          });
        }
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
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Voice Command Center</h1>
        <p className="text-slate-500">Speak naturally to trigger AI-powered automations.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
        <button
          onClick={toggleListening}
          disabled={isProcessing}
          className={`
            relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300
            ${isListening 
              ? 'bg-rose-500 hover:bg-rose-600 shadow-[0_0_0_8px_rgba(244,63,94,0.2)] animate-pulse' 
              : 'bg-emerald-500 hover:bg-emerald-600 shadow-lg hover:shadow-xl hover:-translate-y-1'}
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isProcessing ? (
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          ) : isListening ? (
            <MicOff className="w-10 h-10 text-white" />
          ) : (
            <Mic className="w-10 h-10 text-white" />
          )}
        </button>

        <div className="mt-8 space-y-2">
          <h2 className="text-xl font-bold text-slate-900">
            {isListening ? 'Listening...' : isProcessing ? 'Processing Command...' : 'Tap to Speak'}
          </h2>
          <div className="text-slate-500 max-w-md mx-auto min-h-[3rem] flex items-center justify-center">
            {transcript ? (
              <p className="text-lg text-slate-800 font-medium">"{transcript}"</p>
            ) : isListening ? (
              <p className="flex items-center gap-2">
                <Activity className="w-4 h-4 animate-pulse text-rose-500" />
                Speak your command now...
              </p>
            ) : (
              <p>Say something like "Open YouTube and play lo-fi music"</p>
            )}
          </div>
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

      {/* Mini Window Modal */}
      <AnimatePresence>
        {miniWindow.isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
          >
            <div className="bg-white w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
              {/* Window Header */}
              <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <span className="font-medium text-sm ml-2 truncate max-w-[200px] sm:max-w-md">
                    {miniWindow.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => window.open(miniWindow.url, '_blank')}
                    className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Open in new tab"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setMiniWindow({ isOpen: false, url: '', title: '' })}
                    className="p-1.5 text-slate-300 hover:text-white hover:bg-rose-500 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Window Content (Iframe) */}
              <div className="flex-1 bg-slate-50 relative">
                <iframe 
                  src={miniWindow.url} 
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
