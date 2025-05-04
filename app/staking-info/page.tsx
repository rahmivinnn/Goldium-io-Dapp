export const dynamic = "force-dynamic"
export const runtime = "edge"

export default function StakingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "#FFD700" }}>
            GOLD Token Staking
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Stake your GOLD tokens to earn rewards and participate in governance decisions
          </p>
        </div>

        <div className="bg-black/50 border border-yellow-500/30 rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#FFD700" }}>
                Earn Rewards with GOLD Staking
              </h2>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span style={{ color: "#FFD700" }} className="mr-2">
                    •
                  </span>
                  <span>Up to 18.5% APY on your staked GOLD tokens</span>
                </li>
                <li className="flex items-start">
                  <span style={{ color: "#FFD700" }} className="mr-2">
                    •
                  </span>
                  <span>Participate in governance decisions</span>
                </li>
                <li className="flex items-start">
                  <span style={{ color: "#FFD700" }} className="mr-2">
                    •
                  </span>
                  <span>Earn special NFT rewards for long-term stakers</span>
                </li>
                <li className="flex items-start">
                  <span style={{ color: "#FFD700" }} className="mr-2">
                    •
                  </span>
                  <span>No lock-up period - unstake anytime</span>
                </li>
              </ul>

              <a
                href="/staking-client"
                className="inline-block py-3 px-6 rounded-md font-bold text-black"
                style={{ backgroundColor: "#FFD700" }}
              >
                Launch Staking Interface
              </a>
            </div>

            <div className="flex-shrink-0 w-48 h-48 relative">
              <div
                className="w-full h-full rounded-full opacity-80"
                style={{ background: "linear-gradient(135deg, #FFD700, #FFA500)" }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-black">GOLD</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-black/40 border border-yellow-500/20 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2" style={{ color: "#FFD700" }}>
              Total Staked
            </h3>
            <p className="text-2xl font-bold">750,000 GOLD</p>
            <p className="text-sm text-gray-400">75% of circulating supply</p>
          </div>

          <div className="bg-black/40 border border-yellow-500/20 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2" style={{ color: "#FFD700" }}>
              Current APY
            </h3>
            <p className="text-2xl font-bold">18.5%</p>
            <p className="text-sm text-gray-400">Variable based on staking pool</p>
          </div>

          <div className="bg-black/40 border border-yellow-500/20 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2" style={{ color: "#FFD700" }}>
              Rewards Distributed
            </h3>
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
