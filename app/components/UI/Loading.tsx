"use client"

export function Loading() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/30 backdrop-blur-sm p-8 rounded-xl border border-[#30BFA5]/30 flex flex-col items-center gap-4">
        <div className="loading-spinner"></div>
        <p className="text-white/90 text-lg">Loading...</p>
      </div>
    </div>
  )
} 