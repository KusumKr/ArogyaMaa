import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, FileText } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-accent/5 to-background">
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 mb-4">
              <Shield className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Privacy Policy</h1>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">Introduction</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                At ArogyaMaa, we are committed to protecting your privacy and ensuring the security of your personal
                information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                when you use our maternal health assistant application.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Database className="w-5 h-5 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">Information We Collect</h2>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">Personal Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Language preferences and communication settings</li>
                  <li>Questions and queries you submit through voice or text</li>
                  <li>Trimester information (if provided) for personalized tips</li>
                  <li>Feedback and ratings on tips and advice</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mt-4">Technical Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Device information and browser type</li>
                  <li>IP address and location data (if permitted)</li>
                  <li>Usage patterns and interaction data</li>
                  <li>Voice recordings (temporarily stored for processing)</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">How We Use Your Information</h2>
              </div>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>To provide personalized maternal health advice and tips</li>
                <li>To process voice commands and deliver responses in your preferred language</li>
                <li>To improve our AI models and service quality</li>
                <li>To send you relevant health tips and wellness quotes</li>
                <li>To analyze usage patterns and enhance user experience</li>
                <li>To ensure the security and proper functioning of our services</li>
              </ul>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">Data Security</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to protect your personal information. All data
                transmissions are encrypted using SSL/TLS protocols. Voice recordings are processed in real-time and not
                permanently stored. We regularly update our security practices to ensure your data remains protected.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">Your Rights</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Access your personal data and request a copy</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal data</li>
                <li>Opt-out of data collection for analytics</li>
                <li>Withdraw consent for data processing at any time</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may use third-party services for voice recognition, AI processing, and analytics. These services are
                carefully selected and comply with strict data protection standards. We do not sell your personal
                information to third parties.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                ArogyaMaa is designed for expectant and new mothers. We do not knowingly collect information from
                children under 18 years of age. If you believe we have inadvertently collected such information, please
                contact us immediately.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any significant changes by
                posting the new policy on this page and updating the "Last updated" date. We encourage you to review
                this policy periodically.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="bg-accent/10 p-6 rounded-lg border border-accent/20">
                <p className="text-foreground font-semibold">Email: privacy@arogyamaa.com</p>
                <p className="text-foreground font-semibold">Support: support@arogyamaa.com</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
