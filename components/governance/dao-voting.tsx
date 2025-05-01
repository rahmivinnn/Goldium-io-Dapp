"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useWallet } from "@/hooks/use-wallet"
import { WalletConnectOverlay } from "@/components/wallet-connect-overlay"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import {
  Check,
  X,
  Clock,
  BarChart3,
  FileText,
  Calendar,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Wallet,
  ImageIcon,
} from "lucide-react"

// Sample proposals data
const PROPOSALS = [
  {
    id: "prop1",
    title: "Increase Staking Rewards by 2%",
    description:
      "Proposal to increase the staking rewards from 4.5% to 6.5% APR to incentivize more token holders to stake.",
    status: "active",
    creator: "0x1234...5678",
    createdAt: "2025-04-15T10:00:00Z",
    endTime: "2025-05-15T10:00:00Z",
    votes: {
      for: 650000,
      against: 120000,
      abstain: 30000,
    },
    quorum: 500000,
    category: "treasury",
  },
  {
    id: "prop2",
    title: "Add New NFT Collection: Golden Warriors",
    description:
      "Proposal to launch a new NFT collection featuring warrior characters with unique abilities and traits.",
    status: "active",
    creator: "0x8765...4321",
    createdAt: "2025-04-20T14:30:00Z",
    endTime: "2025-05-10T14:30:00Z",
    votes: {
      for: 430000,
      against: 210000,
      abstain: 45000,
    },
    quorum: 500000,
    category: "nft",
  },
  {
    id: "prop3",
    title: "Implement Token Burn Mechanism",
    description:
      "Proposal to implement a 1% token burn on all marketplace transactions to create deflationary pressure.",
    status: "passed",
    creator: "0x2468...1357",
    createdAt: "2025-03-10T09:15:00Z",
    endTime: "2025-04-10T09:15:00Z",
    votes: {
      for: 820000,
      against: 95000,
      abstain: 25000,
    },
    quorum: 500000,
    category: "tokenomics",
  },
  {
    id: "prop4",
    title: "Integrate with Arbitrum for Lower Gas Fees",
    description: "Proposal to deploy GOLD token and NFT contracts on Arbitrum to provide users with lower gas fees.",
    status: "rejected",
    creator: "0x1357...2468",
    createdAt: "2025-03-05T16:45:00Z",
    endTime: "2025-04-05T16:45:00Z",
    votes: {
      for: 320000,
      against: 580000,
      abstain: 40000,
    },
    quorum: 500000,
    category: "technical",
  },
]

export function DAOVoting() {
  const { connected, balance } = useWallet()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("active")
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null)
  const [voteAmount, setVoteAmount] = useState(0)
  const [voteChoice, setVoteChoice] = useState<"for" | "against" | "abstain" | null>(null)
  const [votingPower, setVotingPower] = useState(1500)

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Calculate time remaining
  const getTimeRemaining = (endTimeString: string) => {
    const endTime = new Date(endTimeString).getTime()
    const now = new Date().getTime()
    const timeRemaining = endTime - now

    if (timeRemaining <= 0) return "Ended"

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    return `${days}d ${hours}h remaining`
  }

  // Calculate vote percentages
  const calculateVotePercentage = (proposal: (typeof PROPOSALS)[0], type: "for" | "against" | "abstain") => {
    const totalVotes = proposal.votes.for + proposal.votes.against + proposal.votes.abstain
    if (totalVotes === 0) return 0
    return Math.round((proposal.votes[type] / totalVotes) * 100)
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded-full text-xs font-medium">Active</span>
      case "passed":
        return <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-medium">Passed</span>
      case "rejected":
        return <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded-full text-xs font-medium">Rejected</span>
      case "pending":
        return (
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs font-medium">Pending</span>
        )
      default:
        return null
    }
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "treasury":
        return <Wallet className="h-5 w-5 text-gold" />
      case "nft":
        return <ImageIcon className="h-5 w-5 text-purple-500" />
      case "tokenomics":
        return <BarChart3 className="h-5 w-5 text-blue-500" />
      case "technical":
        return <FileText className="h-5 w-5 text-gray-400" />
      default:
        return <FileText className="h-5 w-5 text-gray-400" />
    }
  }

  // Handle vote submission
  const handleVoteSubmit = () => {
    if (!voteChoice) {
      toast({
        title: "Vote Choice Required",
        description: "Please select a vote choice (For, Against, or Abstain)",
        variant: "destructive",
      })
      return
    }

    if (voteAmount <= 0) {
      toast({
        title: "Invalid Vote Amount",
        description: "Please enter a vote amount greater than 0",
        variant: "destructive",
      })
      return
    }

    if (voteAmount > votingPower) {
      toast({
        title: "Insufficient Voting Power",
        description: `You only have ${votingPower} voting power available`,
        variant: "destructive",
      })
      return
    }

    // Simulate vote submission
    toast({
      title: "Vote Submitted",
      description: `You voted ${voteChoice} with ${voteAmount} GOLD on proposal "${PROPOSALS.find((p) => p.id === selectedProposal)?.title}"`,
    })

    // Reset vote state
    setSelectedProposal(null)
    setVoteChoice(null)
    setVoteAmount(0)
  }

  // Filter proposals based on active tab
  const filteredProposals = PROPOSALS.filter((proposal) => {
    if (activeTab === "active") return proposal.status === "active"
    if (activeTab === "passed") return proposal.status === "passed"
    if (activeTab === "rejected") return proposal.status === "rejected"
    return true
  })

  if (!connected) {
    return (
      <Card className="border-gold bg-black w-full">
        <CardHeader>
          <CardTitle>DAO Governance</CardTitle>
          <CardDescription>Vote on proposals to shape the future of Goldium</CardDescription>
        </CardHeader>
        <CardContent>
          <WalletConnectOverlay message="Connect your wallet to participate in governance" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full">
      <Card className="border-gold bg-black mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div>
              <CardTitle>DAO Governance</CardTitle>
              <CardDescription>Vote on proposals to shape the future of Goldium</CardDescription>
            </div>
            <Button className="gold-button mt-4 md:mt-0">Create Proposal</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="border-gold/30 bg-black">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Your Voting Power</h3>
                  <div className="text-xs px-2 py-1 bg-gold/20 text-gold rounded-full">GOLD Token</div>
                </div>
                <div className="text-3xl font-bold text-gold">{votingPower} votes</div>
                <div className="text-sm text-gray-400 mt-1">Based on your GOLD holdings</div>
              </CardContent>
            </Card>

            <Card className="border-gold/30 bg-black">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Active Proposals</h3>
                  <div className="text-xs px-2 py-1 bg-blue-500/20 text-blue-500 rounded-full">
                    {PROPOSALS.filter((p) => p.status === "active").length} Open
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-500">
                  {PROPOSALS.filter((p) => p.status === "active").length}
                </div>
                <div className="text-sm text-gray-400 mt-1">Proposals requiring your vote</div>
              </CardContent>
            </Card>

            <Card className="border-gold/30 bg-black">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Your Participation</h3>
                  <div className="text-xs px-2 py-1 bg-green-500/20 text-green-500 rounded-full">Active Voter</div>
                </div>
                <div className="text-3xl font-bold text-green-500">75%</div>
                <div className="text-sm text-gray-400 mt-1">Of proposals you've voted on</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="active" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                <Clock className="mr-2 h-5 w-5" />
                Active
              </TabsTrigger>
              <TabsTrigger value="passed" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                <Check className="mr-2 h-5 w-5" />
                Passed
              </TabsTrigger>
              <TabsTrigger value="rejected" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                <X className="mr-2 h-5 w-5" />
                Rejected
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                <FileText className="mr-2 h-5 w-5" />
                All
              </TabsTrigger>
            </TabsList>

            <div className="space-y-4">
              {filteredProposals.length > 0 ? (
                filteredProposals.map((proposal) => (
                  <Card
                    key={proposal.id}
                    className={`border-gold/30 bg-black hover:border-gold/60 transition-colors cursor-pointer ${selectedProposal === proposal.id ? "border-gold" : ""}`}
                    onClick={() => setSelectedProposal(proposal.id === selectedProposal ? null : proposal.id)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                        <div className="flex items-center mb-2 md:mb-0">
                          <div className="mr-3 bg-gold/10 p-2 rounded-full">{getCategoryIcon(proposal.category)}</div>
                          <div>
                            <h3 className="font-bold text-gold">{proposal.title}</h3>
                            <div className="flex items-center text-xs text-gray-400 mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Created {formatDate(proposal.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {getStatusBadge(proposal.status)}
                          {proposal.status === "active" && (
                            <div className="ml-3 text-xs text-gray-400">{getTimeRemaining(proposal.endTime)}</div>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-300 mb-4 line-clamp-2">{proposal.description}</p>

                      <div className="space-y-2 mb-4">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-green-500">For ({calculateVotePercentage(proposal, "for")}%)</span>
                            <span>{proposal.votes.for.toLocaleString()} GOLD</span>
                          </div>
                          <Progress
                            value={calculateVotePercentage(proposal, "for")}
                            className="h-2 bg-gray-700"
                            indicatorClassName="bg-green-500"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-red-500">
                              Against ({calculateVotePercentage(proposal, "against")}%)
                            </span>
                            <span>{proposal.votes.against.toLocaleString()} GOLD</span>
                          </div>
                          <Progress
                            value={calculateVotePercentage(proposal, "against")}
                            className="h-2 bg-gray-700"
                            indicatorClassName="bg-red-500"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">
                              Abstain ({calculateVotePercentage(proposal, "abstain")}%)
                            </span>
                            <span>{proposal.votes.abstain.toLocaleString()} GOLD</span>
                          </div>
                          <Progress
                            value={calculateVotePercentage(proposal, "abstain")}
                            className="h-2 bg-gray-700"
                            indicatorClassName="bg-gray-400"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-400">
                          <span className="font-medium text-gray-300">Quorum: </span>
                          {(
                            ((proposal.votes.for + proposal.votes.against + proposal.votes.abstain) / proposal.quorum) *
                            100
                          ).toFixed(1)}
                          % ({(proposal.votes.for + proposal.votes.against + proposal.votes.abstain).toLocaleString()} /{" "}
                          {proposal.quorum.toLocaleString()})
                        </div>

                        {proposal.status === "active" && (
                          <Button variant="outline" size="sm" className="border-gold/50 text-gold hover:bg-gold/10">
                            Vote Now
                          </Button>
                        )}
                      </div>

                      {selectedProposal === proposal.id && proposal.status === "active" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-6 pt-6 border-t border-gold/20"
                        >
                          <h4 className="font-bold mb-4">Cast Your Vote</h4>

                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <Button
                              variant={voteChoice === "for" ? "default" : "outline"}
                              className={
                                voteChoice === "for"
                                  ? "bg-green-500 hover:bg-green-600 text-white"
                                  : "border-green-500/50 text-green-500 hover:bg-green-500/10"
                              }
                              onClick={() => setVoteChoice("for")}
                            >
                              <ThumbsUp className="mr-2 h-4 w-4" />
                              For
                            </Button>
                            <Button
                              variant={voteChoice === "against" ? "default" : "outline"}
                              className={
                                voteChoice === "against"
                                  ? "bg-red-500 hover:bg-red-600 text-white"
                                  : "border-red-500/50 text-red-500 hover:bg-red-500/10"
                              }
                              onClick={() => setVoteChoice("against")}
                            >
                              <ThumbsDown className="mr-2 h-4 w-4" />
                              Against
                            </Button>
                            <Button
                              variant={voteChoice === "abstain" ? "default" : "outline"}
                              className={
                                voteChoice === "abstain"
                                  ? "bg-gray-500 hover:bg-gray-600 text-white"
                                  : "border-gray-500/50 text-gray-400 hover:bg-gray-500/10"
                              }
                              onClick={() => setVoteChoice("abstain")}
                            >
                              Abstain
                            </Button>
                          </div>

                          <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <div className="flex-1">
                              <label className="block text-sm font-medium mb-1">Voting Power</label>
                              <input
                                type="number"
                                value={voteAmount}
                                onChange={(e) => setVoteAmount(Math.max(0, Number.parseInt(e.target.value) || 0))}
                                className="w-full bg-black border border-gold/50 rounded-md px-3 py-2 focus:border-gold focus:outline-none"
                                placeholder="Enter amount"
                                max={votingPower}
                              />
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-400">Available: {votingPower} GOLD</span>
                                <button
                                  className="text-xs text-gold hover:underline"
                                  onClick={() => setVoteAmount(votingPower)}
                                >
                                  Max
                                </button>
                              </div>
                            </div>

                            <div className="md:self-end">
                              <Button
                                className="gold-button w-full md:w-auto"
                                onClick={handleVoteSubmit}
                                disabled={!voteChoice || voteAmount <= 0 || voteAmount > votingPower}
                              >
                                Submit Vote
                              </Button>
                            </div>
                          </div>

                          <div className="bg-blue-500/10 text-blue-500 rounded-lg p-3 text-sm flex items-start">
                            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Important Note</p>
                              <p className="text-blue-400">
                                Voting requires a small gas fee. Your GOLD tokens will be locked until the proposal
                                ends.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-black/50 border border-gold/20 rounded-lg">
                  <FileText className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                  <h3 className="text-xl font-bold mb-2">No Proposals Found</h3>
                  <p className="text-gray-400">
                    There are no {activeTab !== "all" ? activeTab : ""} proposals at this time.
                  </p>
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
