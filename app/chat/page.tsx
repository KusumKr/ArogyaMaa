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

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Voice features
  const { speak, stopSpeaking, isSupported } = useVoice()

  useEffect(() => {
    initChat()
  }, [])

  const initChat = async () => {
    await chatAPI.initSession({
      language: selectedLanguage,
      trimester: selectedTrimester,
    })

    const history = await chatAPI.getHistory()
    if (history?.messages) {
      setMessages(history.messages)
    } else {
      const welcomeMsg = {
        id: "1",
        role: "assistant" as const,
        content: selectedLanguage === 'hi' 
          ? "नमस्ते! मैं आरोग्यमाँ हूँ, आपकी स्वास्थ्य साथी। मैं आज आपकी कैसे मदद कर सकती हूँ?"
          : "Namaste! I'm ArogyaMaa, your wellness companion. How can I support you today?",
        timestamp: new Date(),
      }
      setMessages([welcomeMsg])
      
      // Speak welcome message if voice is enabled
      if (voiceEnabled) {
        speak(welcomeMsg.content, selectedLanguage)
      }
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
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

    setMessages((prev) => [...prev, newUserMsg])
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

      setMessages((prev) => [...prev, botReply])

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
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: errorMsg,
          timestamp: new Date(),
        },
      ])
    }

    setLoading(false)
  }

  const handleVoiceInput = (transcript: string) => {
    console.log('Received transcript:', transcript)
    setInputValue(transcript)
    // Optionally auto-send after voice input
    // setTimeout(() => handleSendMessage(), 500)
  }

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
        <TipOfTheDay />

        <div className="flex-1 space-y-4 overflow-y-auto">
          {messages.map((m) => (
            <div key={m.id} className="relative group">
              <ChatMessage message={m} />
              
              {/* Listen button for assistant messages */}
              {m.role === 'assistant' && isSupported && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speak(m.content, selectedLanguage)}
                  className="absolute -bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs gap-1"
                >
                  <Volume2 className="w-3 h-3" />
                  {selectedLanguage === 'hi' ? 'सुनें' : 'Listen'}
                </Button>
              )}
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