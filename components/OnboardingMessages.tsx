import React, { useState, useEffect } from 'react';

interface MessageStep {
    id: string;
    title: string;
    content: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    targetId?: string;
}

const steps: MessageStep[] = [
    {
        id: 'welcome',
        title: 'Welcome to the Future of UI',
        content: 'Our AI engine is ready to transform your basic HTML into a premium experience. Let\'s get started!',
        position: 'center'
    },
    {
        id: 'paste',
        title: 'Step 1: The Raw Input',
        content: 'Paste your unstyled HTML snippet here. Don\'t worry about the mess; we love it.',
        position: 'top-left',
        targetId: 'source-snippet-container'
    },
    {
        id: 'strategy',
        title: 'Step 2: Design Ethos',
        content: 'Adjust the design strategy to tell the AI exactly how you want your component to feel.',
        position: 'top-left',
        targetId: 'design-strategy-container'
    },
    {
        id: 'refactor',
        title: 'Step 3: The Magic Button',
        content: 'Hit "Refactor to Premium" and watch the transformation happen in real-time.',
        position: 'top-right',
        targetId: 'refactor-button'
    },
    {
        id: 'view',
        title: 'Step 4: Review & Export',
        content: 'Toggle between the live preview and the ready-to-paste integrated code.',
        position: 'top-right',
        targetId: 'tabs-container'
    }
];

interface OnboardingMessagesProps {
    onComplete: () => void;
}

const OnboardingMessages: React.FC<OnboardingMessagesProps> = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentStep(prev => prev + 1);
                setIsVisible(true);
            }, 300);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        setTimeout(onComplete, 300);
    };

    const step = steps[currentStep];

    const getPositionClasses = () => {
        switch (step.position) {
            case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
            case 'top-left': return 'top-24 left-6 md:left-12';
            case 'top-right': return 'top-24 right-6 md:right-12';
            case 'bottom-left': return 'bottom-12 left-6';
            case 'bottom-right': return 'bottom-12 right-6';
            default: return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
        }
    };

    return (
        <div className={`fixed inset-0 z-[60] pointer-events-none transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop for center step */}
            {step.position === 'center' && (
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] pointer-events-auto" />
            )}

            <div className={`absolute p-6 max-w-sm w-full transition-all duration-500 pointer-events-auto ${getPositionClasses()} ${isVisible ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'}`}>
                <div className="bg-white rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden">
                    <div className="h-1.5 w-full bg-slate-100">
                        <div
                            className="h-full bg-indigo-600 transition-all duration-500"
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        />
                    </div>

                    <div className="p-6">
                        <div className="flex items-center space-x-2 mb-3">
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
                                Tip {currentStep + 1}/{steps.length}
                            </span>
                        </div>

                        <h4 className="text-lg font-bold text-slate-900 mb-2 leading-tight">
                            {step.title}
                        </h4>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium">
                            {step.content}
                        </p>

                        <div className="flex items-center justify-between">
                            <button
                                onClick={handleComplete}
                                className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                            >
                                Skip Tour
                            </button>
                            <button
                                onClick={handleNext}
                                className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95"
                            >
                                {currentStep === steps.length - 1 ? 'Get Started' : 'Next Step'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingMessages;
