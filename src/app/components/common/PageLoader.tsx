export function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="text-neutral-500 text-sm">加载中...</span>
      </div>
    </div>
  );
}

export function InlineLoader() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="text-neutral-600 text-xs">加载中...</span>
      </div>
    </div>
  );
}
