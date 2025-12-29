"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy, 
  MessageSquare, 
  Lightbulb, 
  Mic, 
  Calendar, 
  TrendingUp,
  Bookmark,
  BookOpen,
  Bell,
  Heart,
  Award,
  Flame,
  RefreshCw
} from "lucide-react"
import chatAPI from "@/lib/chatAPI"
import { HealthJournal } from "@/components/health-journal"
import { RemindersList } from "@/components/reminders-list"
import { BookmarkedTips } from "@/components/bookmarked-tips"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://arogyamaa.onrender.com"

type ProgressData = {
  metrics: {
    totalMessages: number
    totalTipsViewed: number
    totalDaysActive: number
    totalVoiceInteractions: number
    totalFeedbackGiven: number
    streakDays: number
    longestStreak: number
    lastActiveDate: string
  }
  achievements: Array<{
    badgeId: string
    badgeName: string
    description: string
    category: string
    unlockedAt: string
  }>
  milestones: Array<any>
  bookmarkedTips: Array<any>
  healthJournal: Array<any>
  reminders: Array<any>
}

export default function ProgressPage() {
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")

  // Load from localStorage IMMEDIATELY on mount (synchronous, before any async)
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const localBookmarks = loadBookmarksFromLocal()
    const localJournal = loadJournalFromLocal()
    const localProgress = loadProgressFromLocal()
    const localReminders = loadRemindersFromLocal()
    
    const initialProgress: ProgressData = {
      metrics: localProgress?.metrics || {
        totalMessages: 0,
        totalTipsViewed: 0,
        totalDaysActive: 1,
        totalVoiceInteractions: 0,
        totalFeedbackGiven: 0,
        streakDays: 1,
        longestStreak: 1,
        lastActiveDate: new Date().toISOString().split('T')[0]
      },
      achievements: localProgress?.achievements || [],
      milestones: localProgress?.milestones || [],
      bookmarkedTips: localBookmarks,
      healthJournal: localJournal,
      reminders: localReminders.length > 0 ? localReminders : (localProgress?.reminders || [])
    }
    
    console.log("Loading progress from localStorage on mount:", {
      messages: initialProgress.metrics.totalMessages,
      bookmarks: initialProgress.bookmarkedTips.length,
      journal: initialProgress.healthJournal.length
    })
    
    setProgress(initialProgress)
    setLoading(false) // Show data immediately, don't wait for backend
  }, [])

  useEffect(() => {
    // Try backend in background (but don't block UI)
    loadProgress()
    
    // Refresh when page becomes visible (user navigates back to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadProgress()
      }
    }
    
    // Refresh when window gains focus
    const handleFocus = () => {
      loadProgress()
    }
    
    // Listen for bookmark updates from chat page
    const handleBookmarkUpdate = () => {
      console.log("Bookmark updated event received, refreshing progress...")
      loadProgress(true)
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('bookmark-updated', handleBookmarkUpdate)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('bookmark-updated', handleBookmarkUpdate)
    }
  }, [])

  // Helper: Load bookmarks from localStorage
  const loadBookmarksFromLocal = (): any[] => {
    if (typeof window === 'undefined') return []
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

  // Helper: Load progress from localStorage
  const loadProgressFromLocal = () => {
    if (typeof window === 'undefined') return null
    try {
      const sessionId = localStorage.getItem("arogyamaa_session_id") || "default"
      const key = `arogyamaa_progress_${sessionId}`
      const existing = localStorage.getItem(key)
      if (existing) {
        return JSON.parse(existing)
      }
    } catch (error) {
      console.error("Failed to load progress from localStorage:", error)
    }
    return null
  }

  // Helper: Load journal entries from localStorage
  const loadJournalFromLocal = (): any[] => {
    if (typeof window === 'undefined') return []
    try {
      const sessionId = localStorage.getItem("arogyamaa_session_id") || "default"
      const key = `arogyamaa_journal_${sessionId}`
      const existing = localStorage.getItem(key)
      return existing ? JSON.parse(existing) : []
    } catch (error) {
      console.error("Failed to load journal from localStorage:", error)
      return []
    }
  }

  // Helper: Load reminders from localStorage
  const loadRemindersFromLocal = (): any[] => {
    if (typeof window === 'undefined') return []
    try {
      const sessionId = localStorage.getItem("arogyamaa_session_id") || "default"
      const key = `arogyamaa_reminders_${sessionId}`
      const existing = localStorage.getItem(key)
      return existing ? JSON.parse(existing) : []
    } catch (error) {
      console.error("Failed to load reminders from localStorage:", error)
      return []
    }
  }

  const loadProgress = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    
    try {
      const sessionId = localStorage.getItem("arogyamaa_session_id")
      if (!sessionId) {
        // Even without session, try to load local bookmarks
        const localBookmarks = loadBookmarksFromLocal()
        setProgress({
          metrics: {
            totalMessages: 0,
            totalTipsViewed: 0,
            totalDaysActive: 1,
            totalVoiceInteractions: 0,
            totalFeedbackGiven: 0,
            streakDays: 1,
            longestStreak: 1,
            lastActiveDate: new Date().toISOString().split('T')[0]
          },
          achievements: [],
          milestones: [],
          bookmarkedTips: localBookmarks,
          healthJournal: [],
          reminders: []
        })
        setLoading(false)
        setRefreshing(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/progress/${sessionId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
      
      if (!response.ok) {
        // If 404 or other error, try loading from localStorage
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.ok && data.progress) {
        // Load reminders from localStorage
        const localReminders = loadRemindersFromLocal()
        
        // Merge backend data with localStorage (localStorage takes priority for user-generated content)
        const mergedProgress = {
          ...data.progress,
          // Use localStorage metrics if they're higher (more up-to-date)
          metrics: {
            ...data.progress.metrics,
            ...(localProgress?.metrics || {}),
            // Take the higher value for counts
            totalMessages: Math.max(
              data.progress.metrics?.totalMessages || 0,
              localProgress?.metrics?.totalMessages || 0
            ),
            totalTipsViewed: Math.max(
              data.progress.metrics?.totalTipsViewed || 0,
              localProgress?.metrics?.totalTipsViewed || 0
            ),
            totalVoiceInteractions: Math.max(
              data.progress.metrics?.totalVoiceInteractions || 0,
              localProgress?.metrics?.totalVoiceInteractions || 0
            ),
            // Use localStorage for streak (more accurate)
            streakDays: localProgress?.metrics?.streakDays || data.progress.metrics?.streakDays || 1,
            longestStreak: Math.max(
              data.progress.metrics?.longestStreak || 1,
              localProgress?.metrics?.longestStreak || 1
            )
          },
          // Always prefer localStorage for user-generated content
          bookmarkedTips: localBookmarks.length > 0 
            ? localBookmarks 
            : (data.progress.bookmarkedTips || []),
          healthJournal: localJournal.length > 0
            ? localJournal
            : (data.progress.healthJournal || []),
          reminders: localReminders.length > 0
            ? localReminders
            : (data.progress.reminders || []),
          // Merge achievements
          achievements: [
            ...(localProgress?.achievements || []),
            ...(data.progress.achievements || [])
          ].filter((v, i, a) => a.findIndex(t => t.badgeId === v.badgeId) === i) // Remove duplicates
        }
        setProgress(mergedProgress)
        console.log("Progress merged from backend and localStorage:", {
          messages: mergedProgress.metrics.totalMessages,
          bookmarks: mergedProgress.bookmarkedTips?.length || 0,
          journal: mergedProgress.healthJournal?.length || 0
        })
      }
      // If backend returns no data, we already set from localStorage above
    } catch (error) {
      // Backend unavailable - we already loaded from localStorage above
      console.warn("Progress API unavailable, using localStorage only:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const refreshProgress = () => {
    loadProgress(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {selectedLanguage === 'hi' ? 'प्रगति लोड हो रही है...' : 'Loading progress...'}
          </p>
        </div>
      </div>
    )
  }

  if (!progress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">
            {selectedLanguage === 'hi' ? 'प्रगति ट्रैकिंग' : 'Progress Tracking'}
          </h2>
          <p className="text-muted-foreground mb-4">
            {selectedLanguage === 'hi' 
              ? 'प्रगति देखने के लिए कृपया पहले चैट शुरू करें।'
              : 'Please start a chat session to track your progress.'}
          </p>
        </Card>
      </div>
    )
  }

  const metrics = progress.metrics
  const achievements = progress.achievements || []
  const bookmarkedTips = progress.bookmarkedTips || []
  const healthJournal = progress.healthJournal || []
  const reminders = progress.reminders || []

  // Calculate engagement score
  const engagementScore = Math.min(
    (metrics.totalMessages * 2 + 
     metrics.totalTipsViewed * 3 + 
     metrics.totalDaysActive * 5 + 
     metrics.streakDays * 2) / 10,
    100
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {selectedLanguage === 'hi' ? 'आपकी प्रगति' : 'Your Progress'}
            </h1>
            <p className="text-muted-foreground">
              {selectedLanguage === 'hi' 
                ? 'अपनी यात्रा और उपलब्धियों को ट्रैक करें'
                : 'Track your journey and achievements'}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshProgress}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {selectedLanguage === 'hi' ? 'रिफ्रेश करें' : 'Refresh'}
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {selectedLanguage === 'hi' ? 'संदेश' : 'Messages'}
                </span>
              </div>
            </div>
            <div className="text-3xl font-bold">{metrics.totalMessages}</div>
            <Progress value={Math.min((metrics.totalMessages / 50) * 100, 100)} className="mt-2" />
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-muted-foreground">
                  {selectedLanguage === 'hi' ? 'टिप्स देखे' : 'Tips Viewed'}
                </span>
              </div>
            </div>
            <div className="text-3xl font-bold">{metrics.totalTipsViewed}</div>
            <Progress value={Math.min((metrics.totalTipsViewed / 20) * 100, 100)} className="mt-2" />
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-sm text-muted-foreground">
                  {selectedLanguage === 'hi' ? 'स्ट्रीक' : 'Streak'}
                </span>
              </div>
            </div>
            <div className="text-3xl font-bold">{metrics.streakDays}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedLanguage === 'hi' ? 'दिन लगातार' : 'days in a row'}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-muted-foreground">
                  {selectedLanguage === 'hi' ? 'उपलब्धियां' : 'Achievements'}
                </span>
              </div>
            </div>
            <div className="text-3xl font-bold">{achievements.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedLanguage === 'hi' ? 'अनलॉक किए गए' : 'unlocked'}
            </p>
          </Card>
        </div>

        {/* Engagement Score */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-1">
                {selectedLanguage === 'hi' ? 'सगाई स्कोर' : 'Engagement Score'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedLanguage === 'hi' 
                  ? 'आपकी सक्रियता का माप'
                  : 'Measure of your activity'}
              </p>
            </div>
            <div className="text-4xl font-bold text-primary">{Math.round(engagementScore)}%</div>
          </div>
          <Progress value={engagementScore} className="h-3" />
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="achievements" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="achievements">
              <Award className="w-4 h-4 mr-2" />
              {selectedLanguage === 'hi' ? 'उपलब्धियां' : 'Achievements'}
            </TabsTrigger>
            <TabsTrigger value="journal">
              <BookOpen className="w-4 h-4 mr-2" />
              {selectedLanguage === 'hi' ? 'जर्नल' : 'Journal'}
            </TabsTrigger>
            <TabsTrigger value="bookmarks">
              <Bookmark className="w-4 h-4 mr-2" />
              {selectedLanguage === 'hi' ? 'बुकमार्क' : 'Bookmarks'}
            </TabsTrigger>
            <TabsTrigger value="reminders">
              <Bell className="w-4 h-4 mr-2" />
              {selectedLanguage === 'hi' ? 'अनुस्मारक' : 'Reminders'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">
                {selectedLanguage === 'hi' ? 'आपकी उपलब्धियां' : 'Your Achievements'}
              </h3>
              {achievements.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    {selectedLanguage === 'hi' 
                      ? 'अभी तक कोई उपलब्धि नहीं मिली। चैट करना शुरू करें!'
                      : 'No achievements yet. Start chatting to unlock badges!'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement, idx) => (
                    <Card key={idx} className="p-4 border-2 border-primary/20">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Award className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold">{achievement.badgeName}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          <Badge variant="secondary" className="mt-2">
                            {achievement.category}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="journal">
            <HealthJournal 
              journal={healthJournal} 
              sessionId={localStorage.getItem("arogyamaa_session_id") || ""}
              language={selectedLanguage}
              onUpdate={refreshProgress}
            />
          </TabsContent>

          <TabsContent value="bookmarks">
            <BookmarkedTips 
              tips={bookmarkedTips}
              sessionId={localStorage.getItem("arogyamaa_session_id") || ""}
              language={selectedLanguage}
              onUpdate={refreshProgress}
            />
          </TabsContent>

          <TabsContent value="reminders">
            <RemindersList 
              reminders={reminders}
              sessionId={localStorage.getItem("arogyamaa_session_id") || ""}
              language={selectedLanguage}
              onUpdate={refreshProgress}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

