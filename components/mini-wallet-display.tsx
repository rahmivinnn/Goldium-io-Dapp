export default function MiniWalletDisplay() {
  return (
    <div className="flex items-center gap-3 bg-black/60 rounded-lg border border-yellow-500/30 px-3 py-2">
      <div className="text-xs text-gray-400">7Xf3...j8kP</div>
      <div className="h-4 w-px bg-gray-700"></div>
      <div className="text-xs">0.01667 SOL</div>
      <div className="text-xs text-yellow-500">100.00 GOLD</div>
    </div>
  )
}
