import React from 'react';

interface OnboardingOverlayProps {
    onDismiss: () => void;
}

const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({ onDismiss }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
                {/* Decorator Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-50 rounded-full -ml-32 -mb-32 opacity-50 blur-3xl pointer-events-none"></div>

                <div className="relative relative z-10">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                            Welcome to <span className="text-indigo-600">E-Com Redesigner Pro</span>
                        </h2>
                        <p className="text-slate-500 text-lg max-w-lg mx-auto leading-relaxed">
                            Transform your basic chaotic HTML into premium, conversion-ready UI components in seconds using strict aesthetic rules.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center hover:border-indigo-100 transition-colors">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                            <h3 className="font-bold text-slate-800 mb-2">Input</h3>
                            <p className="text-sm text-slate-500">Paste your raw, messy HTML snippet into the left panel source editor.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center hover:border-indigo-100 transition-colors">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                            <h3 className="font-bold text-slate-800 mb-2">Strategy</h3>
                            <p className="text-sm text-slate-500">Adjust the Design Strategy logic if you need specific behavior, or keep default.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center hover:border-indigo-100 transition-colors">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                            <h3 className="font-bold text-slate-800 mb-2">Refactor</h3>
                            <p className="text-sm text-slate-500">Hit "Refactor to Premium" to generate a scoped, modern version.</p>
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={onDismiss}
                            className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all"
                        >
                            Start Designing
                        </button>
                        <p className="text-xs text-slate-400 mt-4 font-medium uppercase tracking-widest">
                            Powered by Gemini 3 Flash
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingOverlay;
