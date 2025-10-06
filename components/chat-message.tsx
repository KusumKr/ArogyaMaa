"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  const handlePlayAudio = () => {
    // TODO: integrate text-to-speech here
    console.log("Playing audio for:", message.content)
  }

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0",
          isUser ? "bg-secondary" : "bg-primary",
        )}
      >
        {isUser ? "👤" : "❤️"}
      </div>

      {/* Message Content */}
      <div className={cn("flex flex-col gap-2 max-w-[75%]", isUser ? "items-end" : "items-start")}>
        <Card
          className={cn(
            "p-4 shadow-sm",
            isUser ? "bg-secondary text-secondary-foreground" : "bg-card text-card-foreground border-primary/20",
          )}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </Card>

        {/* Voice Playback for Assistant Messages */}
        {!isUser && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePlayAudio}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <Volume2 className="w-4 h-4 mr-1" />
            <span className="text-xs">Listen</span>
          </Button>
        )}
      </div>
    </div>
  )
}
