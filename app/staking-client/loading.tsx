export default function StakingClientLoading() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl text-yellow-500">Loading Staking Interface...</p>
      </div>
    </div>
  )
}
