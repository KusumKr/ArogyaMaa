"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Bell, Calendar, CheckCircle2, Circle } from "lucide-react"
import { format, isPast, isToday, isFuture } from "date-fns"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://arogyamaa.onrender.com"

type Reminder = {
  title: string
  description?: string
  type: string
  dueDate: string
  completed: boolean
  completedAt?: string
  createdAt: string
}

type RemindersListProps = {
  reminders: Reminder[]
  sessionId: string
  language: string
  onUpdate: () => void
}

export function RemindersList({ reminders, sessionId, language, onUpdate }: RemindersListProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("other")
  const [dueDate, setDueDate] = useState("")

  // Save reminder to localStorage
  const saveReminderToLocal = (reminder: Reminder) => {
    if (typeof window === 'undefined') return
    try {
      const key = `arogyamaa_reminders_${sessionId}`
      const existing = localStorage.getItem(key)
      const reminders = existing ? JSON.parse(existing) : []
      reminders.push(reminder)
      localStorage.setItem(key, JSON.stringify(reminders))
      console.log("Reminder saved to localStorage")
    } catch (error) {
      console.error("Failed to save reminder to localStorage:", error)
    }
  }

  const handleSubmit = async () => {
    if (!title || !dueDate) {
      alert("Please fill in title and due date")
      return
    }

    const newReminder: Reminder = {
      title,
      description,
      type,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString()
    }

    // Always save to localStorage first
    saveReminderToLocal(newReminder)

    try {
      const response = await fetch(`${API_BASE_URL}/api/progress/${sessionId}/reminder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          type,
          dueDate
        })
      })

      if (response.ok) {
        console.log("Reminder saved to backend")
      } else {
        console.warn("Backend unavailable, using localStorage only")
      }
    } catch (error) {
      console.warn("Failed to add reminder to backend (using localStorage):", error)
    }

    setIsOpen(false)
    setTitle("")
    setDescription("")
    setType("other")
    setDueDate("")
    onUpdate()
  }

  const handleToggleComplete = async (reminder: Reminder) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/progress/${sessionId}/reminder/${reminder.title}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            completed: !reminder.completed
          })
        }
      )

      if (response.ok) {
        onUpdate()
      } else {
        // Backend unavailable, still update locally
        console.warn("Backend unavailable")
        onUpdate()
      }
    } catch (error) {
      // Silently handle - allow UI to continue working
      console.warn("Failed to update reminder (backend may be unavailable):", error)
      onUpdate()
    }
  }

  const typeLabels: Record<string, string> = {
    appointment: language === 'hi' ? 'अपॉइंटमेंट' : 'Appointment',
    medication: language === 'hi' ? 'दवा' : 'Medication',
    checkup: language === 'hi' ? 'जांच' : 'Checkup',
    test: language === 'hi' ? 'टेस्ट' : 'Test',
    other: language === 'hi' ? 'अन्य' : 'Other'
  }

  const typeIcons: Record<string, string> = {
    appointment: "📅",
    medication: "💊",
    checkup: "🏥",
    test: "🧪",
    other: "📌"
  }

  const upcomingReminders = reminders.filter(r => !r.completed && (isFuture(new Date(r.dueDate)) || isToday(new Date(r.dueDate))))
  const pastReminders = reminders.filter(r => !r.completed && isPast(new Date(r.dueDate)))
  const completedReminders = reminders.filter(r => r.completed)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">
          {language === 'hi' ? 'अनुस्मारक' : 'Reminders'}
        </h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {language === 'hi' ? 'नया अनुस्मारक' : 'New Reminder'}
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby="reminder-dialog-description">
            <DialogHeader>
              <DialogTitle>
                {language === 'hi' ? 'अनुस्मारक जोड़ें' : 'Add Reminder'}
              </DialogTitle>
              <p id="reminder-dialog-description" className="sr-only">
                {language === 'hi' 
                  ? 'अपॉइंटमेंट, दवा, जांच या अन्य महत्वपूर्ण तिथियों के लिए अनुस्मारक जोड़ें'
                  : 'Add a reminder for appointments, medications, checkups, or other important dates'}
              </p>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{language === 'hi' ? 'शीर्षक' : 'Title'}</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={language === 'hi' ? 'उदाहरण: डॉक्टर की अपॉइंटमेंट' : 'e.g., Doctor appointment'}
                />
              </div>

              <div>
                <Label>{language === 'hi' ? 'प्रकार' : 'Type'}</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {typeIcons[value]} {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{language === 'hi' ? 'दिनांक' : 'Date'}</Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div>
                <Label>{language === 'hi' ? 'विवरण' : 'Description'}</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={language === 'hi' ? 'अतिरिक्त जानकारी...' : 'Additional details...'}
                  rows={3}
                />
              </div>

              <Button onClick={handleSubmit} className="w-full">
                {language === 'hi' ? 'सेव करें' : 'Save Reminder'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upcoming Reminders */}
      {upcomingReminders.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">
            {language === 'hi' ? 'आगामी' : 'Upcoming'}
          </h4>
          <div className="space-y-2">
            {upcomingReminders.map((reminder, idx) => (
              <Card key={idx} className="p-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleComplete(reminder)}
                    className="mt-1"
                  >
                    {reminder.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{typeIcons[reminder.type]}</span>
                      <h5 className="font-semibold">{reminder.title}</h5>
                      <Badge variant="secondary">{typeLabels[reminder.type]}</Badge>
                      {isToday(new Date(reminder.dueDate)) && (
                        <Badge variant="destructive">
                          {language === 'hi' ? 'आज' : 'Today'}
                        </Badge>
                      )}
                      {isFuture(new Date(reminder.dueDate)) && (
                        <Badge variant="outline">
                          {format(new Date(reminder.dueDate), "MMM dd")}
                        </Badge>
                      )}
                    </div>
                    {reminder.description && (
                      <p className="text-sm text-muted-foreground mb-1">{reminder.description}</p>
                    )}
                    <div className="text-xs text-muted-foreground">
                      📅 {format(new Date(reminder.dueDate), "MMM dd, yyyy")}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past Due */}
      {pastReminders.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2 text-orange-500">
            {language === 'hi' ? 'समय समाप्त' : 'Past Due'}
          </h4>
          <div className="space-y-2">
            {pastReminders.map((reminder, idx) => (
              <Card key={idx} className="p-4 border-orange-500/20">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleComplete(reminder)}
                    className="mt-1"
                  >
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{typeIcons[reminder.type]}</span>
                      <h5 className="font-semibold">{reminder.title}</h5>
                    </div>
                    {reminder.description && (
                      <p className="text-sm text-muted-foreground">{reminder.description}</p>
                    )}
                    <div className="text-xs text-orange-500 mt-1">
                      ⚠️ {format(new Date(reminder.dueDate), "MMM dd, yyyy")}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completedReminders.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2 text-muted-foreground">
            {language === 'hi' ? 'पूर्ण' : 'Completed'}
          </h4>
          <div className="space-y-2">
            {completedReminders.map((reminder, idx) => (
              <Card key={idx} className="p-4 opacity-60">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{typeIcons[reminder.type]}</span>
                      <h5 className="font-semibold line-through">{reminder.title}</h5>
                    </div>
                    {reminder.description && (
                      <p className="text-sm text-muted-foreground">{reminder.description}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {reminders.length === 0 && (
        <Card className="p-8 text-center">
          <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">
            {language === 'hi' 
              ? 'अभी तक कोई अनुस्मारक नहीं है। एक जोड़ें!'
              : 'No reminders yet. Add one!'}
          </p>
        </Card>
      )}
    </div>
  )
}

