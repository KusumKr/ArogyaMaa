import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Sparkles, Mic, Globe, Lightbulb, MessageCircle, Shield, Clock, CheckCircle, Star } from "lucide-react"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-accent/5 to-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-primary/30 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-base font-semibold text-primary">Your multilingual wellness companion</span>
            <Sparkles className="w-5 h-5 text-secondary" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground text-balance leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Empowering Motherhood with <span className="text-primary">Personalized Care</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Your multilingual wellness companion for motherhood. Get personalized nutrition and hygiene tips in your
            local language, powered by voice.
          </p>

          {/* CTA Button */}
          <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Link href="/chat">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all">
                Start Chat
                <Heart className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Illustration */}
          <div className="pt-8 animate-in fade-in zoom-in-95 duration-700 delay-500">
            <div className="relative w-full max-w-lg mx-auto">
              <img
                src="/warm-illustration-of-pregnant-woman-with-healthcar.jpg"
                alt="Maternal health care illustration"
                className="w-full h-auto"
              />
            </div>
          </div>

          <div id="features" className="grid md:grid-cols-3 gap-6 pt-12">
            {/* Voice Enabled Card */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
              <div className="relative z-10">
                <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Mic className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-xl text-foreground mb-2">Voice Enabled</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Speak naturally in your language and get instant responses
                </p>
              </div>
            </div>

            {/* Multilingual Card */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent border border-secondary/20 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-colors" />
              <div className="relative z-10">
                <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Globe className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="font-bold text-xl text-foreground mb-2">Multilingual</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  English, Hindi, and more languages for your comfort
                </p>
              </div>
            </div>

            {/* Personalized Card */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border border-accent/20 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-colors" />
              <div className="relative z-10">
                <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="font-bold text-xl text-foreground mb-2">Personalized</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Tips and guidance tailored specifically for your journey
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="container mx-auto px-4 py-16 md:py-24 bg-accent/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get personalized maternal health support in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-foreground">Choose Your Language</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Select your preferred language from English, Hindi, or other regional languages for comfortable
                  communication
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center text-3xl font-bold text-secondary-foreground shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-foreground">Ask Your Questions</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Use voice or text to ask about nutrition, hygiene, pregnancy care, or any maternal health concerns
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center text-3xl font-bold text-accent-foreground shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold text-foreground">Get Personalized Tips</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Receive instant, personalized advice tailored to your trimester and specific needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Why Choose ArogyaMaa?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trusted support for every stage of your motherhood journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-2">24/7 Availability</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Get answers to your questions anytime, day or night, whenever you need support
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-2">Safe & Private</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Your conversations are completely private and secure, ensuring confidentiality
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-2">Easy to Use</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Simple voice or text interface designed for mothers of all tech comfort levels
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-2">Evidence-Based</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    All advice is based on trusted medical guidelines and maternal health best practices
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="testimonials" className="container mx-auto px-4 py-16 md:py-24 bg-accent/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Mothers Love ArogyaMaa</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real stories from mothers who found support and guidance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed">
                "ArogyaMaa helped me understand proper nutrition during my pregnancy. The voice feature made it so easy
                to use while cooking!"
              </p>
              <div>
                <p className="font-semibold text-foreground">Priya S.</p>
                <p className="text-sm text-muted-foreground">New Mother, Mumbai</p>
              </div>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed">
                "Being able to ask questions in Hindi made all the difference. I finally got answers I could truly
                understand."
              </p>
              <div>
                <p className="font-semibold text-foreground">Anjali M.</p>
                <p className="text-sm text-muted-foreground">Expecting Mother, Delhi</p>
              </div>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed">
                "The daily tips and trimester-specific advice gave me confidence throughout my pregnancy journey."
              </p>
              <div>
                <p className="font-semibold text-foreground">Meera K.</p>
                <p className="text-sm text-muted-foreground">Mother of Two, Bangalore</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6 p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Ready to Start Your Journey?</h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of mothers who trust ArogyaMaa for personalized maternal health guidance
          </p>
          <Link href="/chat">
            <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all">
              Start Chatting Now
              <Heart className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
