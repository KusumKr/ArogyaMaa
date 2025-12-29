"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Calendar, Smile, Activity } from "lucide-react"
import { format } from "date-fns"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://arogyamaa.onrender.com"

type JournalEntry = {
  date: string
  mood: string
  symptoms: string[]
  weight?: number
  notes?: string
  energyLevel: number
  sleepHours?: number
}

type HealthJournalProps = {
  journal: JournalEntry[]
  sessionId: string
  language: string
  onUpdate: () => void
}

export function HealthJournal({ journal, sessionId, language, onUpdate }: HealthJournalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mood, setMood] = useState("neutral")
  const [symptoms, setSymptoms] = useState("")
  const [weight, setWeight] = useState("")
  const [notes, setNotes] = useState("")
  const [energyLevel, setEnergyLevel] = useState([5])
  const [sleepHours, setSleepHours] = useState("")
  const [localJournal, setLocalJournal] = useState<JournalEntry[]>([])

  // Load journal from localStorage on mount
  useEffect(() => {
    const loadJournalFromLocal = () => {
      try {
        const key = `arogyamaa_journal_${sessionId || "default"}`
        const existing = localStorage.getItem(key)
        if (existing) {
          const entries = JSON.parse(existing)
          setLocalJournal(entries)
        }
      } catch (error) {
        console.error("Failed to load journal from localStorage:", error)
      }
    }
    loadJournalFromLocal()
  }, [sessionId])

  // Merge journal prop with local journal
  const displayJournal = localJournal.length > 0 ? localJournal : journal

  // Helper: Save journal entry to localStorage
  const saveJournalToLocal = (entry: any) => {
    try {
      const key = `arogyamaa_journal_${sessionId || "default"}`
      const existing = localStorage.getItem(key)
      const entries = existing ? JSON.parse(existing) : []
      entries.push(entry)
      localStorage.setItem(key, JSON.stringify(entries))
      console.log("Journal entry saved to localStorage:", entry)
    } catch (error) {
      console.error("Failed to save journal entry to localStorage:", error)
    }
  }

  const handleSubmit = async () => {
    const journalEntry = {
      date: new Date().toISOString(),
      mood,
      symptoms: symptoms.split(",").map(s => s.trim()).filter(Boolean),
      weight: weight ? parseFloat(weight) : undefined,
      notes,
      energyLevel: energyLevel[0],
      sleepHours: sleepHours ? parseFloat(sleepHours) : undefined
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/progress/${sessionId}/journal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(journalEntry)
      })

      if (response.ok) {
        // Also save to localStorage as backup
        saveJournalToLocal(journalEntry)
        setLocalJournal(prev => [...prev, journalEntry])
        setIsOpen(false)
        setMood("neutral")
        setSymptoms("")
        setWeight("")
        setNotes("")
        setEnergyLevel([5])
        setSleepHours("")
        onUpdate()
      } else {
        // Backend unavailable, save to localStorage
        console.warn("Backend unavailable, saving to localStorage")
        saveJournalToLocal(journalEntry)
        setLocalJournal(prev => [...prev, journalEntry])
        setIsOpen(false)
        setMood("neutral")
        setSymptoms("")
        setWeight("")
        setNotes("")
        setEnergyLevel([5])
        setSleepHours("")
        onUpdate()
      }
    } catch (error) {
      // Network error, save to localStorage
      console.warn("Failed to add journal entry (backend may be unavailable):", error)
      saveJournalToLocal(journalEntry)
      setLocalJournal(prev => [...prev, journalEntry])
      setIsOpen(false)
      setMood("neutral")
      setSymptoms("")
      setWeight("")
      setNotes("")
      setEnergyLevel([5])
      setSleepHours("")
      onUpdate()
    }
  }

  const moodEmojis: Record<string, string> = {
    excited: "😃",
    happy: "😊",
    neutral: "😐",
    anxious: "😰",
    tired: "😴",
    stressed: "😟"
  }

  const moodLabels: Record<string, string> = {
    excited: language === 'hi' ? 'उत्साहित' : 'Excited',
    happy: language === 'hi' ? 'खुश' : 'Happy',
    neutral: language === 'hi' ? 'सामान्य' : 'Neutral',
    anxious: language === 'hi' ? 'चिंतित' : 'Anxious',
    tired: language === 'hi' ? 'थका हुआ' : 'Tired',
    stressed: language === 'hi' ? 'तनावग्रस्त' : 'Stressed'
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">
          {language === 'hi' ? 'स्वास्थ्य जर्नल' : 'Health Journal'}
        </h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {language === 'hi' ? 'नई प्रविष्टि' : 'New Entry'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="journal-dialog-description">
            <DialogHeader>
              <DialogTitle>
                {language === 'hi' ? 'जर्नल प्रविष्टि जोड़ें' : 'Add Journal Entry'}
              </DialogTitle>
              <p id="journal-dialog-description" className="sr-only">
                {language === 'hi' 
                  ? 'अपने मूड, लक्षण, वजन और अन्य स्वास्थ्य जानकारी को ट्रैक करें'
                  : 'Track your mood, symptoms, weight, and other health information'}
              </p>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{language === 'hi' ? 'मूड' : 'Mood'}</Label>
                <Select value={mood} onValueChange={setMood}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(moodLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {moodEmojis[value]} {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{language === 'hi' ? 'ऊर्जा स्तर' : 'Energy Level'}</Label>
                <div className="space-y-2">
                  <Slider
                    value={energyLevel}
                    onValueChange={setEnergyLevel}
                    min={1}
                    max={10}
                    step={1}
                  />
                  <div className="text-center text-sm text-muted-foreground">
                    {energyLevel[0]}/10
                  </div>
                </div>
              </div>

              <div>
                <Label>{language === 'hi' ? 'लक्षण (अल्पविराम से अलग करें)' : 'Symptoms (comma separated)'}</Label>
                <Input
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder={language === 'hi' ? 'उदाहरण: मतली, थकान' : 'e.g., nausea, fatigue'}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{language === 'hi' ? 'वजन (किलो)' : 'Weight (kg)'}</Label>
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="kg"
                  />
                </div>
                <div>
                  <Label>{language === 'hi' ? 'नींद के घंटे' : 'Sleep Hours'}</Label>
                  <Input
                    type="number"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(e.target.value)}
                    placeholder="hours"
                  />
                </div>
              </div>

              <div>
                <Label>{language === 'hi' ? 'नोट्स' : 'Notes'}</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={language === 'hi' ? 'अपने दिन के बारे में लिखें...' : 'Write about your day...'}
                  rows={4}
                />
              </div>

              <Button onClick={handleSubmit} className="w-full">
                {language === 'hi' ? 'सेव करें' : 'Save Entry'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {displayJournal.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">
            {language === 'hi' 
              ? 'अभी तक कोई जर्नल प्रविष्टि नहीं है। एक जोड़ें!'
              : 'No journal entries yet. Add one!'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayJournal.map((entry, idx) => (
            <Card key={idx} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{moodEmojis[entry.mood]}</span>
                  <div>
                    <div className="font-semibold">{moodLabels[entry.mood]}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(entry.date), "MMM dd, yyyy")}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    {language === 'hi' ? 'ऊर्जा' : 'Energy'}: {entry.energyLevel}/10
                  </div>
                  {entry.sleepHours && (
                    <div className="text-sm text-muted-foreground">
                      💤 {entry.sleepHours} {language === 'hi' ? 'घंटे' : 'hours'}
                    </div>
                  )}
                </div>
              </div>
              
              {entry.symptoms && entry.symptoms.length > 0 && (
                <div className="mb-2">
                  <span className="text-sm font-medium">
                    {language === 'hi' ? 'लक्षण' : 'Symptoms'}: 
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {entry.symptoms.map((symptom, i) => (
                      <span key={i} className="text-xs bg-muted px-2 py-1 rounded">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {entry.notes && (
                <p className="text-sm text-muted-foreground mt-2">{entry.notes}</p>
              )}

              {entry.weight && (
                <div className="text-sm text-muted-foreground mt-2">
                  ⚖️ {entry.weight} kg
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

