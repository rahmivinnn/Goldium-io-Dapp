"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, Clock } from "lucide-react"

export default function DAOVoting() {
  const [proposals, setProposals] = useState([
    {
      id: 1,
      title: "Increase Staking Rewards by 2%",
      description: "A proposal to increase staking rewards by 2% for all tiers.",
      votesFor: 78,
      votesAgainst: 22,
      status: "active",
      endsIn: "3 days",
    },
    {
      id: 2,
      title: "Implement New Governance Module",
      description: "A proposal to implement a new governance module for community voting.",
      votesFor: 62,
      votesAgainst: 38,
      status: "pending",
      endsIn: "5 days",
    },
    {
      id: 3,
      title: "Reduce Transaction Fees",
      description: "A proposal to reduce transaction fees by 10% for all users.",
      votesFor: 45,
      votesAgainst: 55,
      status: "closed",
      endsIn: "Ended 2 days ago",
    },
  ])

  const handleVote = (proposalId: number, vote: "for" | "against") => {
    setProposals((prevProposals) =>
      prevProposals.map((proposal) => {
        if (proposal.id === proposalId) {
          return {
            ...proposal,
            votesFor: vote === "for" ? proposal.votesFor + 1 : proposal.votesFor,
            votesAgainst: vote === "against" ? proposal.votesAgainst + 1 : proposal.votesAgainst,
          }
        }
        return proposal
      }),
    )
  }

  return (
    <div className="space-y-6">
      {proposals.map((proposal) => (
        <Card key={proposal.id} className="border-gold bg-black">
          <CardHeader>
            <CardTitle>{proposal.title}</CardTitle>
            <CardDescription>{proposal.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                <span className="text-sm text-gray-400">{proposal.endsIn}</span>
              </div>
              <div className="text-sm text-gray-400">Status: {proposal.status}</div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <ThumbsUp className="h-4 w-4 mr-1 text-green-500" />
                <span>{proposal.votesFor}%</span>
              </div>
              <div className="flex items-center">
                <ThumbsDown className="h-4 w-4 mr-1 text-red-500" />
                <span>{proposal.votesAgainst}%</span>
              </div>
            </div>

            <div className="flex justify-between">
              <Button className="gold-button" onClick={() => handleVote(proposal.id, "for")}>
                Vote For
              </Button>
              <Button
                variant="outline"
                className="border-gold text-gold hover:bg-gold/10"
                onClick={() => handleVote(proposal.id, "against")}
              >
                Vote Against
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
