// This script will be loaded client-side only
;(() => {
  // Create a container for our client components
  const container = document.createElement("div")
  container.id = "staking-client-container"

  // Replace the static content with our container
  const staticContent = document.querySelector(".grid.grid-cols-1.lg\\:grid-cols-3")
  if (staticContent && staticContent.parentNode) {
    staticContent.parentNode.replaceChild(container, staticContent)

    // Now load the actual React component
    import("/staking-components.js")
      .then((module) => {
        module.default(container)
      })
      .catch((error) => {
        console.error("Failed to load staking components:", error)
        container.innerHTML = `
          <div class="p-6 bg-red-900/20 border border-red-500 rounded-lg">
            <h3 class="text-xl text-red-500 mb-2">Error Loading Staking Interface</h3>
            <p>There was a problem loading the staking interface. Please refresh the page or try again later.</p>
          </div>
        `
      })
  }
})()
