export default function StakingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent mb-4">
            GOLD Token Staking
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Stake your GOLD tokens to earn rewards and participate in governance decisions
          </p>
        </div>

        <div className="bg-black/50 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-yellow-500 mb-4">Earn Rewards with GOLD Staking</h2>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Up to 18.5% APY on your staked GOLD tokens</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Participate in governance decisions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Earn special NFT rewards for long-term stakers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>No lock-up period - unstake anytime</span>
                </li>
              </ul>

              <a
                href="/staking-client"
                className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-md transition-colors"
              >
                Launch Staking Interface
              </a>
            </div>

            <div className="flex-shrink-0 w-48 h-48 relative">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-300 to-amber-600 opacity-80"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-black">GOLD</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-black/40 backdrop-blur-sm border border-yellow-500/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-yellow-500 mb-2">Total Staked</h3>
            <p className="text-2xl font-bold">750,000 GOLD</p>
            <p className="text-sm text-gray-400">75% of circulating supply</p>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-yellow-500/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-yellow-500 mb-2">Current APY</h3>
            <p className="text-2xl font-bold">18.5%</p>
            <p className="text-sm text-gray-400">Variable based on staking pool</p>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-yellow-500/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-yellow-500 mb-2">Rewards Distributed</h3>
            <p className="text-2xl font-bold">125,000 GOLD</p>
            <p className="text-sm text-gray-400">Since program launch</p>
          </div>
        </div>

        <div className="text-center text-sm text-gray-400">
          <p>
            Note: The staking interface requires a connected wallet and client-side rendering for optimal functionality.
          </p>
        </div>
      </div>
    </div>
  )
}
