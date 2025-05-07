"use client"

// Sound effects service for the Goldium dApp
// This service manages sound effects for various actions in the app

// Define sound effect paths
const SOUND_EFFECTS = {
  // Transaction sounds
  transactionSuccess: "/sounds/transaction-success.mp3",
  transactionFailed: "/sounds/transaction-failed.mp3",
  transactionPending: "/sounds/transaction-pending.mp3",
  
  // Wallet sounds
  walletConnected: "/sounds/wallet-connected.mp3",
  walletDisconnected: "/sounds/wallet-disconnected.mp3",
  
  // Token sounds
  tokenClaim: "/sounds/coin-collect.mp3",
  tokenTransfer: "/sounds/transfer-complete.mp3",
  
  // UI sounds
  buttonClick: "/sounds/button-click.mp3",
  notification: "/sounds/notification.mp3",
  error: "/sounds/error.mp3",
  success: "/sounds/success.mp3",
}

// Sound effect volume levels (0.0 to 1.0)
const DEFAULT_VOLUME = 0.5

// Cache for loaded sound effects
const soundCache: Record<string, HTMLAudioElement> = {}

/**
 * Load a sound effect
 * @param soundName The name of the sound effect to load
 * @returns The audio element for the sound effect
 */
export function loadSound(soundName: keyof typeof SOUND_EFFECTS): HTMLAudioElement | null {
  // Only run in browser environment
  if (typeof window === "undefined") return null
  
  const soundPath = SOUND_EFFECTS[soundName]
  
  // Return from cache if already loaded
  if (soundCache[soundPath]) {
    return soundCache[soundPath]
  }
  
  try {
    // Create new audio element
    const audio = new Audio(soundPath)
    audio.volume = DEFAULT_VOLUME
    
    // Add to cache
    soundCache[soundPath] = audio
    
    return audio
  } catch (error) {
    console.error(`Error loading sound effect ${soundName}:`, error)
    return null
  }
}

/**
 * Play a sound effect
 * @param soundName The name of the sound effect to play
 * @param volume Optional volume override (0.0 to 1.0)
 * @returns Promise that resolves when the sound has started playing
 */
export async function playSound(soundName: keyof typeof SOUND_EFFECTS, volume?: number): Promise<void> {
  // Only run in browser environment
  if (typeof window === "undefined") return
  
  // Check if sound effects are enabled
  const soundEnabled = localStorage.getItem("goldium_sound_enabled") !== "false"
  if (!soundEnabled) return
  
  try {
    // Get or load the sound
    const audio = loadSound(soundName)
    if (!audio) return
    
    // Set volume if provided
    if (volume !== undefined) {
      audio.volume = Math.max(0, Math.min(1, volume))
    }
    
    // Reset to start if already playing
    audio.currentTime = 0
    
    // Play the sound
    await audio.play()
  } catch (error) {
    console.error(`Error playing sound effect ${soundName}:`, error)
  }
}

/**
 * Preload commonly used sound effects
 */
export function preloadCommonSounds(): void {
  // Only run in browser environment
  if (typeof window === "undefined") return
  
  // Preload common sounds
  loadSound("transactionSuccess")
  loadSound("walletConnected")
  loadSound("tokenClaim")
  loadSound("notification")
}

/**
 * Enable or disable sound effects
 * @param enabled Whether sound effects should be enabled
 */
export function setSoundEnabled(enabled: boolean): void {
  // Only run in browser environment
  if (typeof window === "undefined") return
  
  localStorage.setItem("goldium_sound_enabled", enabled ? "true" : "false")
}

/**
 * Check if sound effects are enabled
 * @returns Whether sound effects are enabled
 */
export function isSoundEnabled(): boolean {
  // Only run in browser environment
  if (typeof window === "undefined") return false
  
  return localStorage.getItem("goldium_sound_enabled") !== "false"
}

/**
 * Play a transaction sound based on status
 * @param status The transaction status
 */
export function playTransactionSound(status: "success" | "failed" | "pending"): void {
  switch (status) {
    case "success":
      playSound("transactionSuccess")
      break
    case "failed":
      playSound("transactionFailed")
      break
    case "pending":
      playSound("transactionPending")
      break
  }
}

/**
 * Play a wallet connection sound
 * @param connected Whether the wallet was connected or disconnected
 */
export function playWalletSound(connected: boolean): void {
  if (connected) {
    playSound("walletConnected")
  } else {
    playSound("walletDisconnected")
  }
}

/**
 * Play a token claim sound
 */
export function playTokenClaimSound(): void {
  playSound("tokenClaim", 0.7)
}

/**
 * Play a token transfer sound
 */
export function playTokenTransferSound(): void {
  playSound("tokenTransfer", 0.6)
}

/**
 * Play a notification sound
 */
export function playNotificationSound(): void {
  playSound("notification", 0.4)
}

/**
 * Play a UI feedback sound
 * @param type The type of UI feedback
 */
export function playUISound(type: "click" | "error" | "success"): void {
  switch (type) {
    case "click":
      playSound("buttonClick", 0.3)
      break
    case "error":
      playSound("error", 0.5)
      break
    case "success":
      playSound("success", 0.5)
      break
  }
}
