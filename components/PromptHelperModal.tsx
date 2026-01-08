import React, { useState } from 'react';
import { refineSystemPrompt } from '../geminiService';

interface PromptHelperModalProps {
    initialPrompt: string;
    onApply: (refinedPrompt: string) => void;
    onClose: () => void;
}

const enhancers = [
    { label: '🚀 Premium Aesthetics', value: '\nFocus on high-end, luxury commerce aesthetics. Use smooth gradients, glassmorphism, and generous white space.' },
    { label: '📱 Mobile-First', value: '\nEnsure the layout is perfectly responsive and optimized for touch interactions on smaller screens.' },
    { label: '⚡ Ultra-Performance', value: '\nMinimize CSS complexity and prioritize fast render times while maintaining visual excellence.' },
    { label: '🎨 Accessibility', value: '\nPrioritize high contrast ratios and semantic HTML for screen readers without compromising on design.' },
    { label: '✨ Micro-Animations', value: '\nAdd subtle, professional hover effects and entrance animations to make the UI feel alive.' },
];

const PromptHelperModal: React.FC<PromptHelperModalProps> = ({ initialPrompt, onApply, onClose }) => {
    const [prompt, setPrompt] = useState(initialPrompt);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEnhance = (value: string) => {
        const trimmedValue = value.trim();
        if (prompt.includes(trimmedValue)) {
            setPrompt(prev => prev.replace(value, '').trim());
        } else {
            setPrompt(prev => prev.trim() + value);
        }
    };

    const isEnhancerActive = (value: string) => prompt.includes(value.trim());

    const handleAIRefine = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const refined = await refineSystemPrompt(prompt);
            setPrompt(refined);
        } catch (err: any) {
            setError(err.message || 'Failed to refine prompt via AI.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden flex flex-col max-h-[90vh]">
                {/* Decorator */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Prompt Refiner</h2>
                            <p className="text-sm text-slate-500 font-medium">Fine-tune your design strategy for the AI engine.</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 min-h-0 mb-6 relative">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={isLoading}
                            className="w-full h-full p-6 font-mono text-sm bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none leading-relaxed"
                            placeholder="Describe your design vision..."
                        />
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center rounded-2xl animate-in fade-in duration-300">
                                <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                                <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">AI Refinement in progress...</p>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quick Aesthetic Enhancers</h3>
                            <button
                                onClick={handleAIRefine}
                                disabled={isLoading}
                                className="flex items-center space-x-2 text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100/50"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span>✨ AI Magic Refine</span>
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {enhancers.map((e) => {
                                const active = isEnhancerActive(e.value);
                                return (
                                    <button
                                        key={e.label}
                                        onClick={() => handleEnhance(e.value)}
                                        disabled={isLoading}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${active
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100'
                                                : 'bg-indigo-50 text-indigo-600 border-indigo-100/50 hover:bg-indigo-100'
                                            } disabled:opacity-50`}
                                    >
                                        {e.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50"
                        >
                            Discard
                        </button>
                        <button
                            onClick={() => onApply(prompt)}
                            disabled={isLoading}
                            className="flex-[2] py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                        >
                            Apply Strategy Improvements
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromptHelperModal;
