"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ThumbsUp, ThumbsDown } from "lucide-react"

const wellnessQuotesByTrimester = {
  first: [
    "Your body is creating a miracle. Rest when you need to, you're doing amazing work.",
    "Every moment of nausea, every wave of fatigue - it's all part of creating life. You're stronger than you know.",
    "Listen to your body. It knows what it needs as it nurtures new life.",
    "The first trimester is a time of profound change. Be gentle with yourself.",
  ],
  second: [
    "You're glowing from within. This is your body celebrating the life growing inside you.",
    "Feel your baby move and know that you are their whole world right now.",
    "Your strength is remarkable. You're carrying life and still showing up every day.",
    "The second trimester brings energy and joy. Embrace this beautiful phase.",
  ],
  third: [
    "You're in the final stretch. Every day brings you closer to meeting your little one.",
    "Your body knows how to birth your baby. Trust in your strength and your instincts.",
    "Rest, prepare, and dream. Soon you'll hold the miracle you've been growing.",
    "You are powerful beyond measure. Your body is preparing for the most beautiful moment.",
  ],
}

const nutritionTips = [
  { emoji: "🥦", text: "Include leafy greens in your diet for iron and folate" },
  { emoji: "💧", text: "Stay hydrated - drink at least 8-10 glasses of water daily" },
  { emoji: "🧘‍♀️", text: "Practice gentle prenatal yoga for better flexibility" },
  { emoji: "😴", text: "Get adequate rest - aim for 7-9 hours of sleep" },
  { emoji: "🌾", text: "Whole grains provide essential fiber and nutrients" },
]

export function TipOfTheDay() {
  const [selectedTrimester, setSelectedTrimester] = useState<"first" | "second" | "third">("first")
  const [feedback, setFeedback] = useState<"helpful" | "not-helpful" | null>(null)
  const [showThanks, setShowThanks] = useState(false)

  const randomQuote =
    wellnessQuotesByTrimester[selectedTrimester][
      Math.floor(Math.random() * wellnessQuotesByTrimester[selectedTrimester].length)
    ]
  const randomTip = nutritionTips[Math.floor(Math.random() * nutritionTips.length)]

  const handleFeedback = (isHelpful: boolean) => {
    setFeedback(isHelpful ? "helpful" : "not-helpful")
    setShowThanks(true)
    // TODO: Send feedback to backend
    setTimeout(() => setShowThanks(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedTrimester === "first" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedTrimester("first")}
          className="text-xs"
        >
          1st Trimester
        </Button>
        <Button
          variant={selectedTrimester === "second" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedTrimester("second")}
          className="text-xs"
        >
          2nd Trimester
        </Button>
        <Button
          variant={selectedTrimester === "third" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedTrimester("third")}
          className="text-xs"
        >
          3rd Trimester
        </Button>
      </div>

      <Card className="p-4 bg-gradient-to-r from-secondary/20 via-secondary/10 to-primary/10 border-secondary/30 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-secondary" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-2">Wellness Quote</h3>
            <p className="text-sm text-muted-foreground leading-relaxed italic">{randomQuote}</p>

            <div className="mt-3 pt-3 border-t border-border/50">
              {!showThanks ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">Was this helpful?</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeedback(true)}
                      className="h-7 px-2 hover:bg-primary/10"
                      disabled={feedback !== null}
                    >
                      <ThumbsUp className="w-3.5 h-3.5 mr-1" />
                      <span className="text-xs">Yes</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeedback(false)}
                      className="h-7 px-2 hover:bg-destructive/10"
                      disabled={feedback !== null}
                    >
                      <ThumbsDown className="w-3.5 h-3.5 mr-1" />
                      <span className="text-xs">No</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-primary font-medium">Thank you for your feedback!</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Nutrition Tip Card */}
      <Card className="p-4 bg-gradient-to-r from-accent/10 via-primary/10 to-secondary/10 border-accent/30 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
              Nutrition Tip {randomTip.emoji}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{randomTip.text}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
