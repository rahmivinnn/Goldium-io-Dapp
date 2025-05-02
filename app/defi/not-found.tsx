import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold mb-4 text-center">DeFi Page Not Found</h2>
      <p className="mb-8 text-center text-gray-400 max-w-md">
        The DeFi page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/dashboard"
        className="px-4 py-2 bg-amber-500 text-black rounded-md hover:bg-amber-400 transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  )
}
