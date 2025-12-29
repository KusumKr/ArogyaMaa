"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChatMessage } from "@/components/chat-message"
import { VoiceButton } from "@/components/voice-button"
import { TipOfTheDay } from "@/components/tip-of-the-day"
import { Send, Volume2, VolumeX } from "lucide-react"
import chatAPI from "@/lib/chatAPI"
import { useVoice } from "@/hooks/useVoice"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)

  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [selectedTrimester, setSelectedTrimester] = useState("1")
  const [sessionId, setSessionId] = useState<string>("")

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Voice features
  const { speak, stopSpeaking, isSupported } = useVoice()

  // Helper: Save messages to localStorage
  const saveMessagesToLocal = (msgs: Message[]) => {
    if (typeof window === 'undefined') return
    try {
      const storedSessionId = localStorage.getItem("arogyamaa_session_id") || "default"
      const key = `arogyamaa_chat_messages_${storedSessionId}`
      localStorage.setItem(key, JSON.stringify(msgs))
    } catch (error) {
      console.error("Failed to save messages to localStorage:", error)
    }
  }

  // Helper: Load messages from localStorage
  const loadMessagesFromLocal = (): Message[] => {
    if (typeof window === 'undefined') return []
    try {
      const storedSessionId = localStorage.getItem("arogyamaa_session_id") || "default"
      const key = `arogyamaa_chat_messages_${storedSessionId}`
      const existing = localStorage.getItem(key)
      if (existing) {
        const msgs = JSON.parse(existing)
        // Convert timestamp strings back to Date objects
        return msgs.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }
    } catch (error) {
      console.error("Failed to load messages from localStorage:", error)
    }
    return []
  }

  // Load messages from localStorage IMMEDIATELY on mount (synchronous, before async)
  useEffect(() => {
    const localMessages = loadMessagesFromLocal()
    if (localMessages.length > 0) {
      console.log("Loading", localMessages.length, "messages from localStorage on mount")
      setMessages(localMessages)
    }
  }, [])

  useEffect(() => {
    initChat()
  }, [])

  const initChat = async () => {
    // FIRST: Always try to load from localStorage immediately (fastest)
    const localMessages = loadMessagesFromLocal()
    if (localMessages.length > 0) {
      console.log("Loading messages from localStorage:", localMessages.length)
      setMessages(localMessages)
    }

    // THEN: Initialize session and try backend
    try {
      await chatAPI.initSession({
        language: selectedLanguage,
        trimester: selectedTrimester,
      })

      // Try to load from backend (but don't overwrite if we already have local messages)
      const history = await chatAPI.getHistory()
      if (history?.messages && history.messages.length > 0) {
        // Only update if backend has more messages or different content
        if (history.messages.length > localMessages.length) {
          setMessages(history.messages)
          saveMessagesToLocal(history.messages)
        }
      } else if (localMessages.length === 0) {
        // No local messages and no backend history, show welcome
        const welcomeMsg = {
          id: "1",
          role: "assistant" as const,
          content: selectedLanguage === 'hi' 
            ? "नमस्ते! मैं आरोग्यमाँ हूँ, आपकी स्वास्थ्य साथी। मैं आज आपकी कैसे मदद कर सकती हूँ?"
            : "Namaste! I'm ArogyaMaa, your wellness companion. How can I support you today?",
          timestamp: new Date(),
        }
        setMessages([welcomeMsg])
        saveMessagesToLocal([welcomeMsg])
        
        // Speak welcome message if voice is enabled
        if (voiceEnabled) {
          speak(welcomeMsg.content, selectedLanguage)
        }
      }
    } catch (error) {
      console.warn("Failed to init session, using localStorage only:", error)
      // If backend fails, ensure we have at least welcome message
      if (localMessages.length === 0) {
        const welcomeMsg = {
          id: "1",
          role: "assistant" as const,
          content: selectedLanguage === 'hi' 
            ? "नमस्ते! मैं आरोग्यमाँ हूँ, आपकी स्वास्थ्य साथी। मैं आज आपकी कैसे मदद कर सकती हूँ?"
            : "Namaste! I'm ArogyaMaa, your wellness companion. How can I support you today?",
          timestamp: new Date(),
        }
        setMessages([welcomeMsg])
        saveMessagesToLocal([welcomeMsg])
      }
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessagesToLocal(messages)
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userText = inputValue.trim()
    setInputValue("")

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
      timestamp: new Date(),
    }

      setMessages((prev) => {
        const updated = [...prev, newUserMsg]
        saveMessagesToLocal(updated)
        return updated
      })
      setLoading(true)

      try {
        const res = await chatAPI.sendMessage(userText, {
          language: selectedLanguage,
          trimester: selectedTrimester,
        })

        const botReply: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: res.reply,
          timestamp: new Date(),
        }

        setMessages((prev) => {
          const updated = [...prev, botReply]
          saveMessagesToLocal(updated)
          return updated
        })

        // Track progress - message sent (with localStorage fallback)
        trackProgressWithLocal('message')

      // Speak response if voice is enabled
      if (voiceEnabled && res.reply) {
        // Small delay to ensure message is visible
        setTimeout(() => {
          speak(res.reply, selectedLanguage)
        }, 300)
      }
    } catch (error) {
      const errorMsg = selectedLanguage === 'hi'
        ? "⚠️ कुछ गलत हो गया। कृपया पुनः प्रयास करें।"
        : "⚠️ Oops! Something went wrong. Please try again."
      
      setMessages((prev) => {
        const updated = [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: errorMsg,
            timestamp: new Date(),
          },
        ]
        saveMessagesToLocal(updated)
        return updated
      })
    }

    setLoading(false)
  }

  const handleVoiceInput = (transcript: string) => {
    console.log('Received transcript:', transcript)
    setInputValue(transcript)
    // Track voice interaction
    trackProgress('voice')
    // Optionally auto-send after voice input
    // setTimeout(() => handleSendMessage(), 500)
  }

  // Helper: Update progress metrics in localStorage
  const updateProgressLocal = (activity: string) => {
    if (typeof window === 'undefined') return
    try {
      const storedSessionId = localStorage.getItem("arogyamaa_session_id") || "default"
      const key = `arogyamaa_progress_${storedSessionId}`
      const existing = localStorage.getItem(key)
      const progress = existing ? JSON.parse(existing) : {
        metrics: {
          totalMessages: 0,
          totalTipsViewed: 0,
          totalDaysActive: 1,
          totalVoiceInteractions: 0,
          totalFeedbackGiven: 0,
          streakDays: 1,
          longestStreak: 1,
          lastActiveDate: new Date().toISOString().split('T')[0]
        }
      }

      const today = new Date().toISOString().split('T')[0]
      const lastActive = progress.metrics.lastActiveDate || today

      // Update streak
      if (today !== lastActive) {
        const yesterday = new Date(lastActive)
        yesterday.setDate(yesterday.getDate() + 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]
        
        if (today === yesterdayStr) {
          progress.metrics.streakDays = (progress.metrics.streakDays || 1) + 1
          if (progress.metrics.streakDays > (progress.metrics.longestStreak || 1)) {
            progress.metrics.longestStreak = progress.metrics.streakDays
          }
        } else {
          progress.metrics.streakDays = 1
        }
        
        progress.metrics.totalDaysActive = (progress.metrics.totalDaysActive || 1) + 1
        progress.metrics.lastActiveDate = today
      }

      // Track specific activities
      switch (activity) {
        case 'message':
          progress.metrics.totalMessages = (progress.metrics.totalMessages || 0) + 1
          break
        case 'tip':
          progress.metrics.totalTipsViewed = (progress.metrics.totalTipsViewed || 0) + 1
          break
        case 'voice':
          progress.metrics.totalVoiceInteractions = (progress.metrics.totalVoiceInteractions || 0) + 1
          break
        case 'feedback':
          progress.metrics.totalFeedbackGiven = (progress.metrics.totalFeedbackGiven || 0) + 1
          break
      }

      localStorage.setItem(key, JSON.stringify(progress))
      console.log("Progress updated locally:", activity, progress.metrics)
    } catch (error) {
      console.error("Failed to update progress locally:", error)
    }
  }

  const trackProgressWithLocal = async (activity: string) => {
    // Always update localStorage first
    updateProgressLocal(activity)
    
    // Also try backend
    if (typeof window === 'undefined') return
    try {
      const storedSessionId = localStorage.getItem("arogyamaa_session_id")
      if (!storedSessionId) return

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://arogyamaa.onrender.com"}/api/progress/${storedSessionId}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activity })
      })
      
      if (response.ok) {
        console.log("Progress tracked on backend:", activity)
      } else {
        // Backend unavailable, but localStorage already updated
        console.warn("Progress tracking unavailable (backend may be down), using localStorage")
      }
    } catch (error) {
      // Backend unavailable, but localStorage already updated
      // Don't log to avoid console spam
    }
  }

  const trackProgress = trackProgressWithLocal

  const toggleVoiceOutput = () => {
    if (voiceEnabled) {
      stopSpeaking()
    }
    setVoiceEnabled(!voiceEnabled)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header dropdowns */}
      <div className="p-3 flex gap-2 justify-end items-center">
        {/* Voice Output Toggle */}
        {isSupported && (
          <Button
            variant={voiceEnabled ? "default" : "outline"}
            size="sm"
            onClick={toggleVoiceOutput}
            className="gap-2"
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-xs">
              {voiceEnabled 
                ? (selectedLanguage === 'hi' ? 'आवाज़ चालू' : 'Voice On')
                : (selectedLanguage === 'hi' ? 'आवाज़ बंद' : 'Voice Off')
              }
            </span>
          </Button>
        )}

        <select
          className="border rounded px-2 py-1 text-sm"
          value={selectedLanguage}
          onChange={(e) => {
            setSelectedLanguage(e.target.value)
            stopSpeaking() // Stop any ongoing speech
          }}
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
        </select>

        <select
          className="border rounded px-2 py-1 text-sm"
          value={selectedTrimester}
          onChange={(e) => setSelectedTrimester(e.target.value)}
        >
          <option value="1">1st Trimester</option>
          <option value="2">2nd Trimester</option>
          <option value="3">3rd Trimester</option>
        </select>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col gap-6 max-w-4xl">
        <TipOfTheDay 
          onTipViewed={() => trackProgress('tip')}
          sessionId={sessionId}
          language={selectedLanguage}
        />

        <div className="flex-1 space-y-4 overflow-y-auto">
          {messages.map((m) => (
            <div key={m.id} className="relative group">
              <ChatMessage 
                message={m} 
                onBookmark={(content) => {
                  // Bookmark functionality handled in component
                }}
                language={selectedLanguage}
              />
            </div>
          ))}

          {loading && (
            <div className="text-sm text-gray-500 animate-pulse">
              {selectedLanguage === 'hi' ? 'आरोग्यमाँ टाइप कर रही है...' : 'ArogyaMaa is typing...'}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <Card className="p-4 sticky bottom-0 bg-card shadow-lg">
          <div className="flex items-end gap-3">
            <div className="flex-1 flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder={
                  selectedLanguage === "hi"
                    ? "अपना सवाल पूछें..."
                    : "Ask your question..."
                }
                className="flex-1 bg-transparent outline-none"
              />
              <VoiceButton 
                onTranscript={handleVoiceInput} 
                language={selectedLanguage}
              />
            </div>

            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || loading}
              className="h-12 w-12 rounded-xl"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>

          {/* Voice hint */}
          {isSupported && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              {selectedLanguage === 'hi'
                ? '🎤 माइक बटन दबाएं और बोलें'
                : '🎤 Press mic to speak your question'}
            </p>
          )}
        </Card>
      </main>
    </div>
  )
}