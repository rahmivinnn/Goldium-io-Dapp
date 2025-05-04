export const dynamic = "force-dynamic"
export const runtime = "edge"

export default function StakingClientPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#FFD700" }}>
            GOLD Staking Dashboard
          </h1>
          <p className="text-gray-300 mb-8">Stake your GOLD tokens to earn rewards</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="w-full max-w-md mx-auto p-8 border border-yellow-500/20 rounded-lg bg-black/40">
              <h2 className="text-xl font-bold mb-4" style={{ color: "#FFD700" }}>
                Connect Wallet
              </h2>
              <p className="text-gray-300 mb-6">
                Connect your wallet to access the staking interface and start earning rewards.
              </p>
              <button className="w-full py-3 px-4 rounded font-bold text-black" style={{ backgroundColor: "#FFD700" }}>
                Connect Wallet
              </button>
            </div>
          </div>

          <div className="w-full md:w-64 space-y-4">
            <div className="bg-black/40 border border-yellow-500/20 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2" style={{ color: "#FFD700" }}>
                Staking Tips
              </h3>
              <ul className="text-sm space-y-2">
                <li>Connect your wallet to view your staking balance</li>
                <li>Rewards are calculated in real-time</li>
                <li>You can unstake at any time without penalties</li>
                <li>Higher staking amounts may qualify for bonus rewards</li>
              </ul>
            </div>

            <div className="bg-black/40 border border-yellow-500/20 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2" style={{ color: "#FFD700" }}>
                APY Rates
              </h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Base Rate:</span>
                  <span className="font-bold">15.0%</span>
                </div>
                <div className="flex justify-between">
                  <span>Loyalty Bonus:</span>
                  <span className="font-bold">+2.0%</span>
                </div>
                <div className="flex justify-between">
                  <span>Governance Bonus:</span>
                  <span className="font-bold">+1.5%</span>
                </div>
                <div className="flex justify-between border-t border-yellow-500/20 pt-1 mt-1">
                  <span>Max APY:</span>
                  <span className="font-bold" style={{ color: "#FFD700" }}>
                    18.5%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
