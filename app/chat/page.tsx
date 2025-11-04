"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChatMessage } from "@/components/chat-message"
import { VoiceButton } from "@/components/voice-button"
import { TipOfTheDay } from "@/components/tip-of-the-day"
import { Send } from "lucide-react"
import chatAPI from "@/lib/chatAPI"

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

  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [selectedTrimester, setSelectedTrimester] = useState("1")

  const messagesEndRef = useRef(null)

  useEffect(() => {
    initChat()
  }, [])

  const initChat = async () => {
    await chatAPI.initSession({
      language: selectedLanguage,
      trimester: selectedTrimester,
    })

    const history = await chatAPI.getHistory()
    if (history?.messages) setMessages(history.messages)
    else {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: "Namaste! I'm ArogyaMaa, your wellness companion. How can I support you today?",
          timestamp: new Date(),
        },
      ])
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userText = inputValue
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
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "⚠️ Oops! Something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ])
    }

    setLoading(false)
  }

  const handleVoiceInput = (transcript: string) => {
    setInputValue(transcript)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header dropdowns */}
      <div className="p-3 flex gap-2 justify-end">
        <select
          className="border rounded px-2 py-1 text-sm"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
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
            <ChatMessage key={m.id} message={m} />
          ))}

          {loading && (
            <div className="text-sm text-gray-500">ArogyaMaa is typing...</div>
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
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={
                  selectedLanguage === "hi"
                    ? "अपना सवाल पूछें..."
                    : "Ask your question..."
                }
                className="flex-1 bg-transparent outline-none"
              />
              <VoiceButton onTranscript={handleVoiceInput} />
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
        </Card>
      </main>
    </div>
  )
}
