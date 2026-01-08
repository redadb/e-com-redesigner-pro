
import React, { useMemo, useState, useEffect } from 'react';

interface PreviewProps {
  html: string;
  css?: string;
  title: string;
  isRedesign?: boolean;
}

const Preview: React.FC<PreviewProps> = ({ html, css, title, isRedesign }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const combinedCode = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>${css || ''}</style>
          <style>
            body { 
              margin: 0; 
              padding: 40px; 
              background-color: ${isRedesign ? '#ffffff' : '#f8fafc'}; 
              font-family: 'Inter', -apple-system, sans-serif; 
              display: flex;
              justify-content: center;
            }
            #preview-container {
              width: 100%;
              max-width: 1200px;
            }
            img { max-width: 100%; height: auto; border-radius: 8px; }
            * { box-sizing: border-box; }
            /* Custom scrollbar for inside iframe */
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
          </style>
        </head>
        <body>
          <div id="preview-container">${html}</div>
        </body>
      </html>
    `;
  }, [html, css, isRedesign]);

  // Handle escape key to close full screen
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullScreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const PreviewContent = (
    <div className={`flex flex-col h-full bg-white transition-all duration-300 ${isFullScreen ? 'fixed inset-0 z-[100]' : 'border border-slate-200 rounded-xl overflow-hidden shadow-sm'}`}>
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-3">
          <span className={`w-2.5 h-2.5 rounded-full ${isRedesign ? 'bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.4)]' : 'bg-slate-400'}`}></span>
          <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{title}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Refresh Button */}
          <button 
            onClick={handleRefresh}
            className="flex items-center space-x-1.5 px-2 py-1 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-md transition-all group"
            title="Refresh Preview"
          >
            <svg className={`w-4 h-4 transition-transform duration-500 ${refreshKey > 0 ? 'group-active:rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Reload</span>
          </button>

          <div className="w-px h-4 bg-slate-200 mx-1"></div>

          {/* Full Screen / Exit Button */}
          <button 
            onClick={() => setIsFullScreen(!isFullScreen)}
            className={`flex items-center space-x-1.5 px-2 py-1 rounded-md transition-all ${
              isFullScreen 
                ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                : 'text-slate-400 hover:text-indigo-600 hover:bg-white'
            }`}
            title={isFullScreen ? "Exit Full Screen" : "View Full Screen"}
          >
            {isFullScreen ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-tighter">Exit Full Screen</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-tighter">Full Screen</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-slate-100/30 relative">
        <iframe
          key={refreshKey}
          srcDoc={combinedCode}
          title={title}
          className="w-full h-full border-none"
          sandbox="allow-scripts"
        />
        {/* Helper text for full screen exit */}
        {isFullScreen && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] pointer-events-none opacity-50">
            Press ESC to exit
          </div>
        )}
      </div>
    </div>
  );

  return PreviewContent;
};

export default Preview;
