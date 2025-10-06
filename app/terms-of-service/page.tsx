import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, AlertCircle, CheckCircle, XCircle, Scale } from "lucide-react"

export default function TermsOfServicePage() {
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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-secondary/70 mb-4">
              <Scale className="w-10 h-10 text-secondary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Terms of Service</h1>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">Agreement to Terms</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using ArogyaMaa, you accept and agree to be bound by these Terms of Service. If you do
                not agree to these terms, please do not use our service. These terms apply to all users, including
                expectant mothers, new mothers, and healthcare professionals.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">Medical Disclaimer</h2>
              </div>
              <div className="bg-secondary/10 border-l-4 border-secondary p-6 rounded-r-lg">
                <p className="text-foreground font-semibold mb-2">Important Notice</p>
                <p className="text-muted-foreground leading-relaxed">
                  ArogyaMaa provides general maternal health information and wellness tips. Our service is NOT a
                  substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your
                  physician or qualified healthcare provider with any questions regarding a medical condition or
                  pregnancy.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">Acceptable Use</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                You agree to use ArogyaMaa only for lawful purposes and in accordance with these Terms. You agree NOT
                to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Use the service in any way that violates applicable laws or regulations</li>
                <li>Attempt to gain unauthorized access to our systems or networks</li>
                <li>Transmit any harmful code, viruses, or malicious software</li>
                <li>Impersonate another person or misrepresent your affiliation</li>
                <li>Harass, abuse, or harm other users or our staff</li>
                <li>Use automated systems to access the service without permission</li>
              </ul>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">Service Description</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                ArogyaMaa provides a multilingual, voice-enabled maternal health assistant that offers:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Personalized nutrition and hygiene tips for pregnancy and postpartum</li>
                <li>Trimester-specific wellness quotes and emotional support</li>
                <li>Voice and text-based interaction in multiple languages</li>
                <li>Daily health tips and educational content</li>
                <li>General maternal health information and guidance</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content, features, and functionality of ArogyaMaa, including but not limited to text, graphics,
                logos, icons, images, audio clips, and software, are the exclusive property of ArogyaMaa and are
                protected by copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">User Content</h2>
              <p className="text-muted-foreground leading-relaxed">
                By submitting questions, feedback, or other content to ArogyaMaa, you grant us a non-exclusive,
                worldwide, royalty-free license to use, reproduce, and analyze such content for the purpose of improving
                our services. We will not share your personal content with third parties without your consent.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">Limitation of Liability</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To the fullest extent permitted by law, ArogyaMaa shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages resulting from your use or inability to use the service. We
                do not guarantee the accuracy, completeness, or usefulness of any information provided.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Service Availability</h2>
              <p className="text-muted-foreground leading-relaxed">
                We strive to provide continuous service availability but do not guarantee uninterrupted access. We
                reserve the right to modify, suspend, or discontinue any part of the service at any time without prior
                notice. We are not liable for any service interruptions or technical issues.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to terminate or suspend your access to ArogyaMaa immediately, without prior notice,
                for any reason, including breach of these Terms. Upon termination, your right to use the service will
                cease immediately.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by
                posting the updated Terms on this page. Your continued use of ArogyaMaa after changes constitutes
                acceptance of the modified Terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to
                its conflict of law provisions. Any disputes arising from these Terms shall be subject to the exclusive
                jurisdiction of the courts in India.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-accent/10 p-6 rounded-lg border border-accent/20">
                <p className="text-foreground font-semibold">Email: legal@arogyamaa.com</p>
                <p className="text-foreground font-semibold">Support: support@arogyamaa.com</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
