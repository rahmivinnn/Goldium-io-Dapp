import { StakingClient } from "./client"

export const dynamic = "force-dynamic"

export default function StakingClientPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent mb-2">
            GOLD Staking Dashboard
          </h1>
          <p className="text-gray-300 mb-8">Stake your GOLD tokens to earn rewards</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <StakingClient />
          </div>

          <div className="w-full md:w-64 space-y-4">
            <div className="bg-black/40 backdrop-blur-sm border border-yellow-500/20 rounded-lg p-4">
              <h3 className="text-lg font-bold text-yellow-500 mb-2">Staking Tips</h3>
              <ul className="text-sm space-y-2">
                <li>Connect your wallet to view your staking balance</li>
                <li>Rewards are calculated in real-time</li>
                <li>You can unstake at any time without penalties</li>
                <li>Higher staking amounts may qualify for bonus rewards</li>
              </ul>
            </div>

            <div className="bg-black/40 backdrop-blur-sm border border-yellow-500/20 rounded-lg p-4">
              <h3 className="text-lg font-bold text-yellow-500 mb-2">APY Rates</h3>
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
                  <span className="font-bold text-yellow-500">18.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
