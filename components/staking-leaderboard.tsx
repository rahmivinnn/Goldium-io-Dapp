export default function StakingLeaderboard() {
  const leaderboard = [
    { rank: 1, player: "GoldenKnight", staked: 25000 },
    { rank: 2, player: "CryptoWizard", staked: 18750 },
    { rank: 3, player: "TokenMaster", staked: 15420 },
    { rank: 4, player: "NFTHunter", staked: 12950 },
    { rank: 5, player: "BlockchainBaron", staked: 11340 },
  ]

  return (
    <div className="space-y-3">
      {leaderboard.map((item) => (
        <div
          key={item.rank}
          className="flex items-center justify-between p-2 border border-gold/20 rounded-lg hover:bg-gold/5"
        >
          <div className="flex items-center">
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full mr-2 ${
                item.rank === 1
                  ? "bg-gold text-black"
                  : item.rank === 2
                    ? "bg-gray-300 text-black"
                    : item.rank === 3
                      ? "bg-amber-700 text-white"
                      : "bg-gray-700 text-white"
              }`}
            >
              {item.rank}
            </div>
            <span>{item.player}</span>
          </div>
          <span className="font-bold text-gold">{item.staked.toLocaleString()} GOLD</span>
        </div>
      ))}
    </div>
  )
}
