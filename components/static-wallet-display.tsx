export default function StaticWalletDisplay() {
  return (
    <div className="border border-yellow-500/30 bg-black/60 rounded-lg p-4 max-w-md">
      <h2 className="text-lg font-bold text-yellow-500 mb-3">Wallet Balance</h2>

      <div className="mb-3">
        <div className="text-sm text-gray-400 mb-1">Address</div>
        <div className="font-mono text-sm bg-black/40 p-2 rounded">7Xf3...j8kP</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-sm text-gray-400 mb-1">SOL Balance</div>
          <div className="text-xl font-bold">0.01667</div>
        </div>

        <div>
          <div className="text-sm text-gray-400 mb-1">GOLD Balance</div>
          <div className="text-xl font-bold text-yellow-500">100.00</div>
        </div>
      </div>
    </div>
  )
}
