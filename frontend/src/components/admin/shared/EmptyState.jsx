export default function EmptyState({ title = "Nothing here yet", message = "No records found.", action, icon }) {
  const DefaultIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0891b2"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
    </svg>
  );
  return (
    <div role="status" aria-live="polite"
      className="flex flex-col items-center justify-center py-20 px-6 rounded-2xl text-center
        bg-slate-50 border border-dashed border-slate-300 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5
        bg-cyan-50 border border-cyan-200 animate-float">
        {icon ?? <DefaultIcon />}
      </div>
      <p className="text-base font-bold text-slate-700 mb-1.5">{title}</p>
      <p className="text-sm text-slate-400 max-w-xs leading-relaxed">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
