import React from "react"
import { createRoot } from "react-dom/client"
import StakingClient from "../app/staking/client"

export default function renderStakingComponents(container) {
  const root = createRoot(container)
  root.render(React.createElement(StakingClient))
}
