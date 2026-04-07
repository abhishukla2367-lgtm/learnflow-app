export default function ErrorState({ onRetry }) {
  return (
    <div role="alert" aria-live="assertive"
      className="flex flex-col items-center justify-center py-20 px-6 rounded-2xl text-center
        bg-red-50 border border-dashed border-red-200 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-red-100 border border-red-200 animate-pulse">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444"
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className="text-base font-bold text-red-600 mb-1.5">Something went wrong</p>
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-5">
        Couldn't load data. Check your connection and try again.
      </p>
      {onRetry && (
        <button onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold
            bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300
            transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-200">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Try Again
        </button>
      )}
    </div>
  );
}
