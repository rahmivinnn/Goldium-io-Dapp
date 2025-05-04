export default function StakingLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent">
        Goldium Staking & Yield
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border border-gold/20 bg-black/60 backdrop-blur-sm rounded-lg p-6">
            <div className="text-2xl text-center text-gold mb-2">Loading Staking Interface...</div>
            <div className="text-center text-gray-400 mb-6">Please wait while we load the staking interface</div>
            <div className="h-96 flex items-center justify-center">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gold/20 h-12 w-12"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gold/20 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gold/20 rounded"></div>
                    <div className="h-4 bg-gold/20 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="border border-gold/20 bg-black/60 backdrop-blur-sm rounded-lg p-6">
            <div className="text-xl text-gold mb-4">Top Stakers</div>
            <div className="animate-pulse space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="rounded-full bg-gold/20 h-8 w-8"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gold/20 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gold/20 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gold/20 bg-black/60 backdrop-blur-sm rounded-lg p-6">
            <div className="text-xl text-gold mb-4">Recent Activity</div>
            <div className="animate-pulse space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gold/10 rounded-md"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
