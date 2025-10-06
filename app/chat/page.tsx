"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChatMessage } from "@/components/chat-message"
import { VoiceButton } from "@/components/voice-button"
import { TipOfTheDay } from "@/components/tip-of-the-day"
import { Send } from "lucide-react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Namaste! I'm ArogyaMaa, your wellness companion. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // TODO: integrate AI response here
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Thank you for your question. I'm here to provide personalized nutrition and hygiene guidance. This is a demo response.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  const handleVoiceInput = (transcript: string) => {
    // TODO: integrate speech recognition here
    setInputValue(transcript)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Chat Area */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col gap-6 max-w-4xl">
        {/* Tip of the Day */}
        <TipOfTheDay />

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>

        {/* Input Area */}
        <Card className="p-4 sticky bottom-0 bg-card shadow-lg">
          <div className="flex items-end gap-3">
            <div className="flex-1 flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              />
              <VoiceButton onTranscript={handleVoiceInput} />
            </div>
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="h-12 w-12 rounded-xl"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
