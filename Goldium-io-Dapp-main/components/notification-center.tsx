"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Bell, Gift, Coins, Sword, ShoppingBag } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "reward",
      title: "Daily Reward Available",
      message: "Your daily login bonus of 50 GOLD is ready to claim!",
      time: "Just now",
      read: false,
    },
    {
      id: 2,
      type: "staking",
      title: "Staking Rewards",
      message: "You've earned 18.5 GOLD from your staking rewards",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "game",
      title: "Tournament Starting",
      message: "The Weekend Warrior tournament starts in 1 day",
      time: "5 hours ago",
      read: true,
    },
    {
      id: 4,
      type: "marketplace",
      title: "NFT Price Drop",
      message: "Dragon's Breath Sword price reduced by 15%",
      time: "Yesterday",
      read: true,
    },
    {
      id: 5,
      type: "system",
      title: "New Feature Added",
      message: "Check out the new Card Battle game mode!",
      time: "2 days ago",
      read: true,
    },
  ])

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))

    toast({
      title: "Notifications Marked as Read",
      description: "All notifications have been marked as read.",
    })
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  // Add functionality to clear notifications
  const clearAllNotifications = () => {
    setNotifications([])

    toast({
      title: "Notifications Cleared",
      description: "All notifications have been cleared.",
    })
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "reward":
        return <Gift className="h-5 w-5 text-gold" />
      case "staking":
        return <Coins className="h-5 w-5 text-blue-500" />
      case "game":
        return <Sword className="h-5 w-5 text-purple-500" />
      case "marketplace":
        return <ShoppingBag className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-400" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full border-gold bg-black shadow-lg hover:bg-gold/10 z-40"
        >
          <Bell className="h-5 w-5 text-gold" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black border-gold sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-gold" />
              Notifications
            </span>
            {unreadCount > 0 && (
              <Button variant="link" className="text-gold p-0 h-auto" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
            <Button
              variant="outline"
              className="text-red-500 border-red-500 p-0 h-auto text-xs"
              onClick={clearAllNotifications}
            >
              Clear all
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto pr-1">
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${notification.read ? "border-gold/20 bg-black" : "border-gold bg-gold/5"}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5">{getIcon(notification.type)}</div>
                    <div className="flex-1">
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                    </div>
                    {!notification.read && <div className="w-2 h-2 rounded-full bg-gold"></div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="h-10 w-10 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No notifications yet</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
