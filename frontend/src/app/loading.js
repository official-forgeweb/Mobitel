export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        {/* Main Logo */}
        <div className="relative z-10">
          <img src="/logo/main_logo.png" alt="Mobitel Logo" className="h-16 md:h-20 object-contain drop-shadow-xl animate-pulse" />
        </div>
        
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mt-2">
            Initializing Repair Systems...
        </p>
      </div>
    </div>
  );
}
