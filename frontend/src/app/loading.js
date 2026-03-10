export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        {/* Shimmering Logo Effect */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
          </div>
          {/* Circular Loader Around Logo */}
          <div className="absolute -inset-4 border-2 border-primary/20 rounded-full"></div>
          <div className="absolute -inset-4 border-2 border-primary rounded-full border-t-transparent animate-spin"></div>
        </div>

        <div className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-black text-dark tracking-tight">
                Mobi<span className="text-primary font-bold">tel</span>
            </h2>
            <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
            </div>
        </div>
        
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mt-2">
            Initializing Repair Systems...
        </p>
      </div>
    </div>
  );
}
