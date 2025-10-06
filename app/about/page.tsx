import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Heart, Globe, Mic, Shield } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary mx-auto flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-primary-foreground" fill="currentColor" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">About ArogyaMaa</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
              Created to empower women with accessible health guidance
            </p>
          </div>

          {/* Mission Statement */}
          <Card className="p-8 bg-gradient-to-br from-accent/5 via-primary/5 to-secondary/5 border-primary/20">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              ArogyaMaa is dedicated to supporting pregnant women and new mothers on their wellness journey. We believe
              that every woman deserves access to personalized, culturally-sensitive health guidance in her own
              language. Through voice-enabled technology, we break down barriers and make maternal health information
              accessible to all.
            </p>
          </Card>

          {/* Features */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Mic className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Voice-First Experience</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Speak naturally and receive guidance through voice, making health information accessible even for
                  those with limited literacy.
                </p>
              </Card>

              <Card className="p-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Multilingual Support</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Get personalized advice in your preferred language, ensuring clear understanding and cultural
                  relevance.
                </p>
              </Card>

              <Card className="p-6">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Personalized Guidance</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Receive nutrition and hygiene tips tailored to your specific stage of pregnancy or postpartum journey.
                </p>
              </Card>

              <Card className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Safe & Private</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your health information is private and secure. We prioritize your safety and confidentiality above
                  all.
                </p>
              </Card>
            </div>
          </div>

          {/* Credits */}
          <Card className="p-8 bg-muted/30">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Credits</h2>
            <div className="space-y-3 text-muted-foreground">
              <p className="leading-relaxed">
                ArogyaMaa was created with love and dedication to improve maternal health outcomes in underserved
                communities.
              </p>
              <p className="leading-relaxed">
                Built with modern web technologies and powered by AI to provide accurate, helpful guidance to mothers
                everywhere.
              </p>
              <p className="text-sm pt-4 border-t border-border">
                © 2025 ArogyaMaa. Empowering motherhood, one conversation at a time.
              </p>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center pt-8">
            <Link href="/chat">
              <Button size="lg" className="px-8 py-6 text-lg rounded-full">
                Start Your Wellness Journey
                <Heart className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
