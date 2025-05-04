export default function StakingLoading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-10 w-64 bg-yellow-500/20 rounded animate-pulse mx-auto mb-4"></div>
          <div className="h-6 w-96 bg-yellow-500/10 rounded animate-pulse mx-auto"></div>
        </div>

        <div className="bg-black/50 border border-yellow-500/30 rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className="h-8 w-48 bg-yellow-500/20 rounded animate-pulse mb-4"></div>
              <div className="space-y-4 mb-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 w-full bg-yellow-500/10 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="h-12 w-48 bg-yellow-500/20 rounded animate-pulse"></div>
            </div>

            <div className="flex-shrink-0 w-48 h-48 rounded-full bg-yellow-500/20 animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-black/40 border border-yellow-500/20 rounded-lg p-6">
              <div className="h-6 w-32 bg-yellow-500/20 rounded animate-pulse mb-2"></div>
              <div className="h-8 w-24 bg-yellow-500/20 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-40 bg-yellow-500/10 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
