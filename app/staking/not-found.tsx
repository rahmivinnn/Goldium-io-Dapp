export default function StakingNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-black/50 border border-yellow-500/30 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold" style={{ color: "#FFD700" }}>
          Page Not Found
        </h2>
        <p className="my-4 text-gray-300">The staking page you're looking for doesn't exist or has been moved.</p>
        <a
          href="/"
          className="inline-block px-4 py-2 rounded text-black font-medium"
          style={{ backgroundColor: "#FFD700" }}
        >
          Return Home
        </a>
      </div>
    </div>
  )
}
