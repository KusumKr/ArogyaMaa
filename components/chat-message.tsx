"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2, Bookmark, BookmarkCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
  onBookmark?: (content: string) => void
  isBookmarked?: boolean
  language?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://arogyamaa.onrender.com"

export function ChatMessage({ message, onBookmark, isBookmarked = false, language = "en" }: ChatMessageProps) {
  const isUser = message.role === "user"
  const [bookmarked, setBookmarked] = useState(isBookmarked)

  const handlePlayAudio = () => {
    // TODO: integrate text-to-speech here
    console.log("Playing audio for:", message.content)
  }

  // Helper: Save bookmark to localStorage as fallback
  const saveBookmarkToLocal = (bookmarkData: { tipId: string; tipContent: string; category: string }) => {
    try {
      const sessionId = localStorage.getItem("arogyamaa_session_id") || "default"
      const key = `arogyamaa_bookmarks_${sessionId}`
      const existing = localStorage.getItem(key)
      const bookmarks = existing ? JSON.parse(existing) : []
      
      // Check if already exists
      if (!bookmarks.find((b: any) => b.tipId === bookmarkData.tipId)) {
        bookmarks.push({
          ...bookmarkData,
          bookmarkedAt: new Date().toISOString()
        })
        localStorage.setItem(key, JSON.stringify(bookmarks))
        console.log("Bookmark saved to localStorage:", bookmarkData)
      }
    } catch (error) {
      console.error("Failed to save bookmark to localStorage:", error)
    }
  }

  // Helper: Load bookmarks from localStorage
  const loadBookmarksFromLocal = (): any[] => {
    try {
      const sessionId = localStorage.getItem("arogyamaa_session_id") || "default"
      const key = `arogyamaa_bookmarks_${sessionId}`
      const existing = localStorage.getItem(key)
      return existing ? JSON.parse(existing) : []
    } catch (error) {
      console.error("Failed to load bookmarks from localStorage:", error)
      return []
    }
  }

  const handleBookmark = async () => {
    if (!onBookmark) return
    
    const sessionId = localStorage.getItem("arogyamaa_session_id")
    if (!sessionId) {
      console.warn("No session ID found, cannot bookmark")
      return
    }

    try {
      if (!bookmarked) {
        const bookmarkData = {
          tipId: message.id,
          tipContent: message.content,
          category: "chat"
        }
        
        console.log("Bookmarking:", bookmarkData)
        
        // Try backend first
        const response = await fetch(`${API_BASE_URL}/api/progress/${sessionId}/bookmark`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookmarkData)
        })
        
        if (response.ok) {
          const result = await response.json()
          console.log("Bookmark saved successfully to backend:", result)
          setBookmarked(true)
          if (onBookmark) onBookmark(message.content)
          
          // Also save to localStorage as backup
          saveBookmarkToLocal(bookmarkData)
          
          // Show success toast
          toast.success(
            language === 'hi' 
              ? 'टिप सहेजी गई! प्रगति पृष्ठ पर देखें।'
              : 'Tip saved! Check your Progress page.',
            {
              description: language === 'hi' 
                ? 'आप इसे प्रगति ट्रैकर में देख सकते हैं'
                : 'You can view it in your Progress tracker'
            }
          )
          
          // Trigger a custom event to notify progress page to refresh
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('bookmark-updated'))
          }
        } else {
          // Backend unavailable (404 or other error) - use localStorage fallback
          console.warn("Backend unavailable, using localStorage fallback")
          saveBookmarkToLocal(bookmarkData)
          setBookmarked(true)
          if (onBookmark) onBookmark(message.content)
          
          // Show info toast
          toast.info(
            language === 'hi' 
              ? 'टिप स्थानीय रूप से सहेजी गई'
              : 'Tip saved locally',
            {
              description: language === 'hi' 
                ? 'बैकएंड अपडेट होने तक स्थानीय रूप से संग्रहीत'
                : 'Stored locally until backend is updated'
            }
          )
          
          // Trigger event for progress page
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('bookmark-updated'))
          }
        }
      } else {
        // Unbookmark functionality (optional)
        console.log("Already bookmarked, skipping")
      }
    } catch (error) {
      // Network error - use localStorage fallback
      console.warn("Network error, using localStorage fallback:", error)
      const bookmarkData = {
        tipId: message.id,
        tipContent: message.content,
        category: "chat"
      }
      saveBookmarkToLocal(bookmarkData)
      setBookmarked(true)
      if (onBookmark) onBookmark(message.content)
      
      toast.info(
        language === 'hi' 
          ? 'टिप स्थानीय रूप से सहेजी गई'
          : 'Tip saved locally',
        {
          description: language === 'hi' 
            ? 'नेटवर्क त्रुटि - स्थानीय रूप से संग्रहीत'
            : 'Network error - stored locally'
        }
      )
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bookmark-updated'))
      }
    }
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

        {/* Action Buttons for Assistant Messages */}
        {!isUser && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlayAudio}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              <Volume2 className="w-4 h-4 mr-1" />
              <span className="text-xs">{language === 'hi' ? 'सुनें' : 'Listen'}</span>
            </Button>
            {onBookmark && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={cn(
                  "h-8 px-2 text-muted-foreground hover:text-foreground",
                  bookmarked && "text-primary"
                )}
              >
                {bookmarked ? (
                  <BookmarkCheck className="w-4 h-4 mr-1" />
                ) : (
                  <Bookmark className="w-4 h-4 mr-1" />
                )}
                <span className="text-xs">{language === 'hi' ? 'सहेजें' : 'Save'}</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
