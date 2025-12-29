"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bookmark, Trash2 } from "lucide-react"
import { format } from "date-fns"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://arogyamaa.onrender.com"

type BookmarkedTip = {
  tipId: string
  tipContent: string
  category: string
  bookmarkedAt: string
}

type BookmarkedTipsProps = {
  tips: BookmarkedTip[]
  sessionId: string
  language: string
  onUpdate: () => void
}

export function BookmarkedTips({ tips, sessionId, language, onUpdate }: BookmarkedTipsProps) {
  // Helper: Remove bookmark from localStorage
  const removeBookmarkFromLocal = (tipId: string) => {
    try {
      const key = `arogyamaa_bookmarks_${sessionId || "default"}`
      const existing = localStorage.getItem(key)
      if (existing) {
        const bookmarks = JSON.parse(existing)
        const filtered = bookmarks.filter((b: any) => b.tipId !== tipId)
        localStorage.setItem(key, JSON.stringify(filtered))
        console.log("Bookmark removed from localStorage:", tipId)
      }
    } catch (error) {
      console.error("Failed to remove bookmark from localStorage:", error)
    }
  }

  const handleRemove = async (tipId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/progress/${sessionId}/bookmark/${tipId}`,
        {
          method: "DELETE"
        }
      )

      if (response.ok) {
        // Also remove from localStorage
        removeBookmarkFromLocal(tipId)
        onUpdate()
      } else {
        // Backend unavailable, remove from localStorage
        console.warn("Backend unavailable, removing from localStorage")
        removeBookmarkFromLocal(tipId)
        onUpdate()
      }
    } catch (error) {
      // Network error - remove from localStorage
      console.warn("Failed to remove bookmark (backend may be unavailable):", error)
      removeBookmarkFromLocal(tipId)
      onUpdate()
    }
  }

  if (tips.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Bookmark className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground mb-2">
          {language === 'hi' 
            ? 'अभी तक कोई बुकमार्क नहीं है।'
            : 'No bookmarked tips yet.'}
        </p>
        <p className="text-sm text-muted-foreground">
          {language === 'hi' 
            ? 'चैट में टिप्स को बुकमार्क करने के लिए बुकमार्क आइकन पर क्लिक करें।'
            : 'Click the bookmark icon on tips in chat to save them here.'}
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">
          {language === 'hi' ? 'बुकमार्क किए गए टिप्स' : 'Bookmarked Tips'}
        </h3>
        <span className="text-sm text-muted-foreground">
          {tips.length} {language === 'hi' ? 'टिप्स' : 'tips'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, idx) => (
          <Card key={idx} className="p-4 relative">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Bookmark className="w-4 h-4 text-primary fill-primary" />
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {tip.category}
                  </span>
                </div>
                <p className="text-sm">{tip.tipContent}</p>
                <div className="text-xs text-muted-foreground mt-2">
                  {format(new Date(tip.bookmarkedAt), "MMM dd, yyyy")}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(tip.tipId)}
                className="flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

