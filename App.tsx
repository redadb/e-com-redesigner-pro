
import React, { useState, useMemo } from 'react';
import { DEFAULT_INPUT_CODE, DEFAULT_SYSTEM_INSTRUCTION, PROMPT_PRESETS } from './constants';
import { redesignProductPage } from './geminiService';
import { TransformationState } from './types';
import Preview from './components/Preview';
import CodeBlock from './components/CodeBlock';
import OnboardingOverlay from './components/OnboardingOverlay';
import OnboardingMessages from './components/OnboardingMessages';
import PromptHelperModal from './components/PromptHelperModal';

const App: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showPromptHelper, setShowPromptHelper] = useState(false);

  React.useEffect(() => {
    const hasOnboarded = localStorage.getItem('ecom-pro-onboarding-completed');
    if (!hasOnboarded) {
      setShowOnboarding(true);
    }
  }, []);

  const handleDismissOnboarding = () => {
    localStorage.setItem('ecom-pro-onboarding-completed', 'true');
    setShowOnboarding(false);
    setShowTour(true);
  };
  const [state, setState] = useState<TransformationState>({
    status: 'idle',
    originalCode: DEFAULT_INPUT_CODE,
    redesignedCode: null,
  });

  const [systemInstruction, setSystemInstruction] = useState(DEFAULT_SYSTEM_INSTRUCTION);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);

  const handleRedesign = async () => {
    setState(prev => ({ ...prev, status: 'loading', error: undefined }));
    try {
      const result = await redesignProductPage(state.originalCode, systemInstruction);
      setState(prev => ({ ...prev, status: 'success', redesignedCode: result }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: err.message || "Something went wrong during the redesign."
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState(prev => ({ ...prev, originalCode: e.target.value }));
  };

  const handleInstructionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSystemInstruction(e.target.value);
  };

  const handleReset = () => {
    setState(prev => ({ ...prev, originalCode: DEFAULT_INPUT_CODE }));
    setSystemInstruction(DEFAULT_SYSTEM_INSTRUCTION);
    setState(prev => ({ ...prev, status: 'idle', redesignedCode: null }));
  };

  const unifiedOutputCode = useMemo(() => {
    if (!state.redesignedCode) return '';
    return `<style>\n${state.redesignedCode.css}\n</style>\n\n${state.redesignedCode.html}`;
  }, [state.redesignedCode]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {showOnboarding && <OnboardingOverlay onDismiss={handleDismissOnboarding} />}
      {showTour && <OnboardingMessages onComplete={() => setShowTour(false)} />}
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-[50]">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-200">
              R
            </div>
            <div>
              <h1 className="font-extrabold text-xl leading-none tracking-tight">E-com Redesigner Pro</h1>
              <p className="text-xs text-slate-400 mt-1.5 font-medium uppercase tracking-widest">Premium AI Refactoring Engine</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-500 mr-4">
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="hover:text-indigo-600 transition-colors">Billing Docs</a>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <button
                onClick={() => setShowOnboarding(true)}
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors group"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>How it works?</span>
              </button>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="text-slate-400">Gemini 3 Flash</span>
            </div>

            <button
              id="refactor-button"
              onClick={handleRedesign}
              disabled={state.status === 'loading'}
              className={`px-8 py-3 rounded-full font-bold text-sm transition-all shadow-lg active:scale-95 ${state.status === 'loading'
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 hover:shadow-indigo-300 transform'
                }`}
            >
              {state.status === 'loading' ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  REFining...
                </span>
              ) : 'REFACTOR TO PREMIUM'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

          {/* Left Panel: Inputs (4 Cols) */}
          <div className="xl:col-span-4 flex flex-col space-y-6">
            <div id="design-strategy-container" className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={() => setIsPromptExpanded(!isPromptExpanded)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Design Strategy</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPromptHelper(true);
                    }}
                    className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100/50"
                  >
                    Improve Strategy
                  </button>
                  <svg className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isPromptExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isPromptExpanded ? 'max-h-[1200px] opacity-100 p-5 pt-0' : 'max-h-0 opacity-0'}`}>
                {/* Strategy Presets */}
                <div className="mb-5">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Quick Presets</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {PROMPT_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => setSystemInstruction(preset.instruction)}
                        className={`p-3 rounded-xl border text-left transition-all group ${systemInstruction === preset.instruction
                          ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100'
                          : 'bg-slate-50 border-slate-100 hover:border-indigo-200 hover:bg-white'
                          }`}
                      >
                        <div className={`text-xs font-bold mb-1 ${systemInstruction === preset.instruction ? 'text-white' : 'text-slate-800'}`}>
                          {preset.label}
                        </div>
                        <div className={`text-[9px] leading-tight font-medium ${systemInstruction === preset.instruction ? 'text-indigo-100' : 'text-slate-400'}`}>
                          {preset.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={systemInstruction}
                    onChange={handleInstructionChange}
                    className="w-full h-64 p-4 font-mono text-xs bg-slate-50 text-slate-600 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
                    placeholder="Tell the AI how to redesign your component..."
                  />
                  <div className="absolute bottom-4 right-4 text-[9px] font-black text-slate-300 pointer-events-none uppercase tracking-widest bg-white/50 px-2 py-1 rounded border border-slate-100">
                    Instruction Set
                  </div>
                </div>
                <div className="mt-3 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    Modifies AI behavioral logic and visual style constraints
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col space-y-3">
              <div className="bg-indigo-600/5 border border-indigo-100 rounded-2xl p-5 mb-2 group hover:bg-indigo-600/10 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Step 1: Start Here</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Paste your raw product HTML below to begin the transformation.</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                  Source Snippet
                </label>
                <button
                  onClick={handleReset}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-tighter"
                >
                  Reset Workspace
                </button>
              </div>
              <div id="source-snippet-container" className="relative group flex-1 min-h-[500px]">
                <textarea
                  value={state.originalCode}
                  onChange={handleInputChange}
                  spellCheck={false}
                  className="w-full h-full p-6 font-mono text-sm bg-slate-900 text-slate-300 rounded-2xl border border-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-2xl shadow-indigo-900/10 resize-none leading-relaxed"
                  placeholder="Paste your unstyled HTML here..."
                />
                <div className="absolute top-4 right-4 pointer-events-none">
                  <span className="bg-slate-800/50 backdrop-blur-sm text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-700">HTML RAW</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Output/Preview (8 Cols) */}
          <div className="xl:col-span-8 flex flex-col space-y-6">
            <div id="tabs-container" className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'preview' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  Live Workspace
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'code' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  Integrated Code
                </button>
              </div>
              <div className="px-4">
                <span className={`text-[10px] px-3 py-1 rounded-full font-black tracking-widest uppercase border ${state.status === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                  }`}>
                  {state.status === 'success' ? 'Ready' : state.status === 'loading' ? 'Processing' : 'Standby'}
                </span>
              </div>
            </div>

            <div className="flex-1 min-h-[800px] flex flex-col">
              {state.status === 'idle' && (
                <div className="flex-1 flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 rounded-3xl text-slate-300 p-12 text-center group hover:border-indigo-200 transition-colors">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-12 h-12 text-slate-200 group-hover:text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-400">Visualization Engine Idle</h3>
                  <p className="text-sm mt-3 max-w-sm font-medium text-slate-400 leading-relaxed">
                    Waiting for input. Edit the source snippet or strategy on the left, then click <span className="text-indigo-500 font-bold">"Refactor to Premium"</span> to generate your design.
                  </p>
                </div>
              )}

              {state.status === 'loading' && (
                <div className="flex-1 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-3xl p-12 space-y-8 animate-in fade-in zoom-in duration-300">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-800 text-lg font-bold tracking-tight">Redesigning Architecture</p>
                    <p className="text-sm text-slate-400 mt-2 font-medium">Applying professional UI/UX rules to your source snippet...</p>
                  </div>
                </div>
              )}

              {state.status === 'error' && (
                <div className="flex-1 flex flex-col items-center justify-center bg-red-50 border border-red-100 rounded-3xl p-12 text-center animate-in slide-in-from-bottom-4 duration-300">
                  <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6 text-red-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-red-800">Processing Interrupted</h3>
                  <p className="text-sm text-red-600 mt-2 max-w-sm font-medium">{state.error}</p>
                  <button
                    onClick={handleRedesign}
                    className="mt-8 px-10 py-3 bg-red-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95"
                  >
                    Force Retry
                  </button>
                </div>
              )}

              {state.status === 'success' && state.redesignedCode && (
                <div className="flex-1 overflow-hidden animate-in fade-in duration-700">
                  {activeTab === 'preview' ? (
                    <div className="h-full flex flex-col space-y-8">
                      <div className="flex-1 min-h-[500px]">
                        <Preview
                          title="Premium Redesign"
                          html={state.redesignedCode.html}
                          css={state.redesignedCode.css}
                          isRedesign
                        />
                      </div>
                      <div className="h-[250px] opacity-60 hover:opacity-100 transition-opacity">
                        <Preview title="Original Reference" html={state.originalCode} />
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col space-y-6 overflow-y-auto pr-2 custom-scrollbar pb-10">
                      {state.redesignedCode.explanation && (
                        <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-xl shadow-indigo-100">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Refactoring Strategy Insight
                          </h4>
                          <p className="text-sm font-medium leading-relaxed opacity-90">{state.redesignedCode.explanation}</p>
                        </div>
                      )}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Single File Integration (HTML + Scoped CSS)</span>
                          <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-tighter">Ready to Paste</span>
                        </div>
                        <CodeBlock language="HTML/CSS" code={unifiedOutputCode} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-[1600px] mx-auto px-6 py-12 mt-20 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h4 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-wider">The Redesign Methodology</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium max-w-xl">
              Our engine utilizes advanced neural mapping via Gemini 3 to parse unstructured product data and rebuild it using modern CSS primitives. We focus on high visual contrast, semantic hierarchy, and professional spacing systems typical of high-end luxury commerce platforms.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-400 mb-6 uppercase tracking-[0.3em]">Protocol</h4>
            <ul className="text-sm text-slate-600 font-bold space-y-4">
              <li className="flex items-center space-x-3">
                <span className="w-6 h-6 bg-slate-100 rounded-md flex items-center justify-center text-[10px]">01</span>
                <span>Content Extraction</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-6 h-6 bg-slate-100 rounded-md flex items-center justify-center text-[10px]">02</span>
                <span>Visual Re-mapping</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-6 h-6 bg-slate-100 rounded-md flex items-center justify-center text-[10px]">03</span>
                <span>CSS Isolation Scoping</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-400 mb-6 uppercase tracking-[0.3em]">API Metadata</h4>
            <div className="bg-slate-900 rounded-xl p-4 text-[10px] font-mono text-slate-500 space-y-1">
              <p>ENGINE: GEMINI-3-FLASH</p>
              <p>TEMP: 0.7 | SEED: 42</p>
              <p>SCOPING: #ecom-redesign-wrapper</p>
              <p>RESPONSE: APP/JSON</p>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
          border: 2px solid #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
      {showPromptHelper && (
        <PromptHelperModal
          initialPrompt={systemInstruction}
          onApply={(refined) => {
            setSystemInstruction(refined);
            setShowPromptHelper(false);
            if (!isPromptExpanded) setIsPromptExpanded(true);
          }}
          onClose={() => setShowPromptHelper(false)}
        />
      )}
    </div >
  );
};

export default App;
