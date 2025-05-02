export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent">
        Goldium DeFi Hub
      </h1>

      <div className="border border-amber-200/20 bg-black/60 backdrop-blur-sm rounded-lg p-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700/50 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-700/50 rounded w-1/2 mx-auto mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="h-24 bg-gray-700/50 rounded"></div>
            <div className="h-24 bg-gray-700/50 rounded"></div>
            <div className="h-24 bg-gray-700/50 rounded"></div>
          </div>
          <div className="h-64 bg-gray-700/50 rounded mb-6"></div>
        </div>
      </div>
    </div>
  )
}
