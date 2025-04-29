"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sword, Shield, Wand2, Heart, Zap, User, UserX, Trophy, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Card {
  id: string
  name: string
  type: "attack" | "defense" | "magic"
  power: number
  image: string
}

interface Deck {
  id: string
  name: string
  cards: Card[]
}

// Sample cards and decks
const SAMPLE_CARDS: Card[] = [
  { id: "card1", name: "Dragon's Fury", type: "attack", power: 8, image: "/emerald-inferno.png" },
  { id: "card2", name: "Knight's Shield", type: "defense", power: 7, image: "/guardian-crest.png" },
  { id: "card3", name: "Arcane Blast", type: "magic", power: 9, image: "/arcane-blast.png" },
  { id: "card4", name: "Assassin's Strike", type: "attack", power: 6, image: "/shadow-blade-card.png" },
  {
    id: "card5",
    name: "Stone Wall",
    type: "defense",
    power: 8,
    image: "/enchanted-stone-card.png",
  },
  {
    id: "card6",
    name: "Healing Light",
    type: "magic",
    power: 5,
    image: "/ethereal-mend.png",
  },
  {
    id: "card7",
    name: "Berserker Rage",
    type: "attack",
    power: 10,
    image: "/bloodrage-warrior.png",
  },
  {
    id: "card8",
    name: "Ice Barrier",
    type: "defense",
    power: 9,
    image: "/glacial-aegis.png",
  },
  {
    id: "card9",
    name: "Lightning Bolt",
    type: "magic",
    power: 7,
    image: "/arcane-lightning-strike.png",
  },
]

const SAMPLE_DECKS: Deck[] = [
  {
    id: "deck1",
    name: "Warrior's Might",
    cards: [SAMPLE_CARDS[0], SAMPLE_CARDS[1], SAMPLE_CARDS[3], SAMPLE_CARDS[4], SAMPLE_CARDS[6]],
  },
  {
    id: "deck2",
    name: "Arcane Mastery",
    cards: [SAMPLE_CARDS[2], SAMPLE_CARDS[5], SAMPLE_CARDS[7], SAMPLE_CARDS[8], SAMPLE_CARDS[1]],
  },
]

export default function CardBattleGame() {
  const [gameStage, setGameStage] = useState<"entry" | "deck" | "battle" | "result">("entry")
  const [entryFee, setEntryFee] = useState(50)
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null)
  const [playerHealth, setPlayerHealth] = useState(20)
  const [opponentHealth, setOpponentHealth] = useState(20)
  const [playerCards, setPlayerCards] = useState<Card[]>([])
  const [opponentCards, setOpponentCards] = useState<Card[]>([])
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [opponentCard, setOpponentCard] = useState<Card | null>(null)
  const [battleLog, setBattleLog] = useState<string[]>([])
  const [roundResult, setRoundResult] = useState<"win" | "lose" | "draw" | null>(null)
  const [gameResult, setGameResult] = useState<"win" | "lose" | null>(null)
  const [winnings, setWinnings] = useState(0)
  const { toast } = useToast()

  const handleEntryFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (isNaN(value)) {
      setEntryFee(50)
    } else {
      setEntryFee(Math.min(Math.max(value, 10), 200))
    }
  }

  const startGame = () => {
    setGameStage("deck")
  }

  const selectDeck = (deck: Deck) => {
    setSelectedDeck(deck)

    // Shuffle cards for player and opponent
    const shuffledPlayerCards = [...deck.cards].sort(() => Math.random() - 0.5)
    const shuffledOpponentCards = [...SAMPLE_CARDS].sort(() => Math.random() - 0.5).slice(0, 5)

    setPlayerCards(shuffledPlayerCards)
    setOpponentCards(shuffledOpponentCards)

    setGameStage("battle")
    setBattleLog(["Battle started! Select a card to play."])
  }

  const playCard = (card: Card) => {
    if (selectedCard) return // Already selected a card for this round

    // Prevent multiple clicks
    if (roundResult !== null) return

    setSelectedCard(card)

    // Remove the played card from player's hand
    setPlayerCards(playerCards.filter((c) => c.id !== card.id))

    // Opponent selects a random card
    const randomIndex = Math.floor(Math.random() * opponentCards.length)
    const selectedOpponentCard = opponentCards[randomIndex]
    setOpponentCard(selectedOpponentCard)

    // Remove the played card from opponent's hand
    setOpponentCards(opponentCards.filter((c) => c.id !== selectedOpponentCard.id))

    // Add card play sound effect (simulated)
    const playCardSound = () => {
      // In a real implementation, this would play a sound
      console.log("Card played sound effect")
    }
    playCardSound()

    // Determine round winner
    setTimeout(() => {
      const result = determineRoundWinner(card, selectedOpponentCard)
      setRoundResult(result)

      // Update health based on result
      if (result === "win") {
        setOpponentHealth((prev) => Math.max(0, prev - card.power))
        setBattleLog((prev) => [...prev, `You played ${card.name} and dealt ${card.power} damage!`])
      } else if (result === "lose") {
        setPlayerHealth((prev) => Math.max(0, prev - selectedOpponentCard.power))
        setBattleLog((prev) => [
          ...prev,
          `Opponent played ${selectedOpponentCard.name} and dealt ${selectedOpponentCard.power} damage!`,
        ])
      } else {
        setBattleLog((prev) => [...prev, `Both played similar cards. It's a draw!`])
      }

      // Check if game is over
      setTimeout(() => {
        if (opponentHealth - (result === "win" ? card.power : 0) <= 0) {
          endGame("win")
        } else if (playerHealth - (result === "lose" ? selectedOpponentCard.power : 0) <= 0) {
          endGame("lose")
        } else {
          // Continue to next round
          setSelectedCard(null)
          setOpponentCard(null)
          setRoundResult(null)

          // Check if out of cards
          if (playerCards.length === 0 && opponentCards.length === 0) {
            // Determine winner by health
            if (playerHealth > opponentHealth) {
              endGame("win")
            } else if (opponentHealth > playerHealth) {
              endGame("lose")
            } else {
              // It's a draw, but give a small win to the player
              endGame("win")
            }
          }
        }
      }, 1000)
    }, 1000)
  }

  const determineRoundWinner = (playerCard: Card, opponentCard: Card): "win" | "lose" | "draw" => {
    // Type advantages: attack > magic > defense > attack
    if (playerCard.type === opponentCard.type) {
      return playerCard.power > opponentCard.power ? "win" : playerCard.power < opponentCard.power ? "lose" : "draw"
    }

    if (
      (playerCard.type === "attack" && opponentCard.type === "magic") ||
      (playerCard.type === "magic" && opponentCard.type === "defense") ||
      (playerCard.type === "defense" && opponentCard.type === "attack")
    ) {
      return "win"
    }

    return "lose"
  }

  const endGame = (result: "win" | "lose") => {
    setGameResult(result)

    if (result === "win") {
      const winAmount = entryFee * 2
      setWinnings(winAmount)
      toast({
        title: "Victory!",
        description: `You won ${winAmount} GOLD!`,
      })
    } else {
      toast({
        title: "Defeat",
        description: "Better luck next time!",
        variant: "destructive",
      })
    }

    setGameStage("result")
  }

  const resetGame = () => {
    setGameStage("entry")
    setSelectedDeck(null)
    setPlayerHealth(20)
    setOpponentHealth(20)
    setPlayerCards([])
    setOpponentCards([])
    setSelectedCard(null)
    setOpponentCard(null)
    setBattleLog([])
    setRoundResult(null)
    setGameResult(null)
    setWinnings(0)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "attack":
        return <Sword className="h-5 w-5 text-red-500" />
      case "defense":
        return <Shield className="h-5 w-5 text-blue-500" />
      case "magic":
        return <Wand2 className="h-5 w-5 text-purple-500" />
      default:
        return null
    }
  }

  // Entry Fee Screen
  if (gameStage === "entry") {
    return (
      <div className="max-w-md mx-auto">
        <h3 className="text-xl font-bold mb-4">Card Battle</h3>
        <p className="text-gray-400 mb-6">
          Strategic card battle game where you build your deck and battle other players for GOLD rewards.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Entry Fee (GOLD)</label>
          <div className="flex items-center">
            <Input
              type="number"
              value={entryFee}
              onChange={handleEntryFeeChange}
              min={10}
              max={200}
              className="bg-black border-gold/50 focus:border-gold"
            />
          </div>
          <div className="text-xs text-gray-400 mt-1">Min: 10 GOLD | Max: 200 GOLD</div>
        </div>

        <div className="mb-6">
          <div className="bg-gold/5 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Entry Fee</span>
              <span className="font-bold text-gold">{entryFee} GOLD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Potential Win</span>
              <span className="font-bold text-green-500">{entryFee * 2} GOLD</span>
            </div>
          </div>
        </div>

        <Button className="gold-button w-full" onClick={startGame}>
          Enter Battle
        </Button>
      </div>
    )
  }

  // Deck Selection Screen
  if (gameStage === "deck") {
    return (
      <div>
        <h3 className="text-xl font-bold mb-4">Select Your Deck</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {SAMPLE_DECKS.map((deck) => (
            <div
              key={deck.id}
              className="border border-gold/50 rounded-lg p-4 cursor-pointer hover:border-gold hover:bg-gold/5"
              onClick={() => selectDeck(deck)}
            >
              <h4 className="text-lg font-bold mb-2">{deck.name}</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {deck.cards.map((card) => (
                  <div key={card.id} className="flex items-center bg-black/50 rounded px-2 py-1">
                    {getTypeIcon(card.type)}
                    <span className="ml-1 text-sm">{card.name}</span>
                  </div>
                ))}
              </div>
              <Button className="gold-button w-full">Select Deck</Button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Battle Screen
  if (gameStage === "battle") {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <User className="h-5 w-5 text-gold mr-2" />
            <div>
              <div className="text-sm">You</div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 text-red-500 mr-1" />
                <span className="font-bold">{playerHealth}</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-400">Round</div>
            <div className="font-bold">{6 - playerCards.length - (selectedCard ? 1 : 0)}</div>
          </div>

          <div className="flex items-center">
            <div className="text-right">
              <div className="text-sm">Opponent</div>
              <div className="flex items-center justify-end">
                <Heart className="h-4 w-4 text-red-500 mr-1" />
                <span className="font-bold">{opponentHealth}</span>
              </div>
            </div>
            <UserX className="h-5 w-5 text-red-500 ml-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-lg font-bold mb-2">Your Cards</h4>
            <div className="space-y-2">
              {playerCards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between border border-gold/30 rounded-lg p-3 cursor-pointer hover:border-gold hover:bg-gold/5"
                  onClick={() => playCard(card)}
                >
                  <div className="flex items-center">
                    {getTypeIcon(card.type)}
                    <span className="ml-2 font-medium">{card.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 text-gold mr-1" />
                    <span>{card.power}</span>
                  </div>
                </div>
              ))}

              {playerCards.length === 0 && !selectedCard && (
                <div className="text-center text-gray-400 py-4">No cards left</div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-2">Battle Arena</h4>
            <div className="border border-gold/30 rounded-lg p-4 min-h-[200px]">
              {selectedCard && opponentCard ? (
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`border rounded-lg p-2 text-center ${
                      roundResult === "win"
                        ? "border-green-500"
                        : roundResult === "lose"
                          ? "border-red-500"
                          : "border-gold/50"
                    }`}
                  >
                    <div className="font-medium mb-1">{selectedCard.name}</div>
                    <div className="flex items-center justify-center mb-1">
                      {getTypeIcon(selectedCard.type)}
                      <span className="ml-1">{selectedCard.type}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Zap className="h-4 w-4 text-gold mr-1" />
                      <span>{selectedCard.power}</span>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-2 text-center ${
                      roundResult === "lose"
                        ? "border-green-500"
                        : roundResult === "win"
                          ? "border-red-500"
                          : "border-gold/50"
                    }`}
                  >
                    <div className="font-medium mb-1">{opponentCard.name}</div>
                    <div className="flex items-center justify-center mb-1">
                      {getTypeIcon(opponentCard.type)}
                      <span className="ml-1">{opponentCard.type}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Zap className="h-4 w-4 text-gold mr-1" />
                      <span>{opponentCard.power}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">
                    {selectedCard ? "Opponent is choosing a card..." : "Select a card to play"}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 border border-gold/30 rounded-lg p-3 max-h-[150px] overflow-y-auto">
              <h4 className="text-sm font-bold mb-2">Battle Log</h4>
              <div className="space-y-1 text-sm">
                {battleLog.map((log, index) => (
                  <div key={index} className="text-gray-400">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Result Screen
  if (gameStage === "result") {
    return (
      <div className="max-w-md mx-auto text-center">
        <h3 className="text-2xl font-bold mb-4">{gameResult === "win" ? "Victory!" : "Defeat!"}</h3>

        <div className="mb-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-black border-4 border-gold flex items-center justify-center mb-4">
            {gameResult === "win" ? (
              <Trophy className="h-12 w-12 text-gold" />
            ) : (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
          </div>

          {gameResult === "win" ? (
            <div>
              <p className="text-gray-400 mb-2">Congratulations! You've won the battle.</p>
              <p className="text-2xl font-bold text-gold mb-4">+{winnings} GOLD</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-400 mb-2">You've been defeated. Better luck next time!</p>
              <p className="text-xl font-bold text-red-500 mb-4">-{entryFee} GOLD</p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold/10 flex-1" onClick={resetGame}>
            New Battle
          </Button>
          <Button className="gold-button flex-1">View Rewards</Button>
        </div>
      </div>
    )
  }

  return null
}
