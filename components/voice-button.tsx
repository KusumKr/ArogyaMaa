"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"

interface VoiceButtonProps {
  onTranscript: (transcript: string) => void
}

export function VoiceButton({ onTranscript }: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false)

  const handleVoiceInput = () => {
    setIsListening(!isListening)

    // TODO: integrate speech recognition here
    // Example: Use Web Speech API or external service
    if (!isListening) {
      console.log("Starting voice input...")
      // Simulate voice input after 2 seconds
      setTimeout(() => {
        onTranscript("This is a sample voice input")
        setIsListening(false)
      }, 2000)
    } else {
      console.log("Stopping voice input...")
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleVoiceInput}
      className={isListening ? "text-destructive animate-pulse" : "text-muted-foreground"}
    >
      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
    </Button>
  )
}
