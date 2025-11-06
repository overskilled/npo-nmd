import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <Link
          href="/contribute"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to contribution
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">NMD Association Terms and Conditions</CardTitle>
            <p className="text-sm text-muted-foreground">Last Updated: November 2024</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6 text-foreground">
            <section>
              <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
              <p className="leading-relaxed text-muted-foreground">
                Welcome to NMD Association ("the Association," "we," "us," or "our"). By making contributions, creating an account, 
                or using our services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, 
                please do not use our services or make contributions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">2. Membership and Contributions</h2>
              <h3 className="text-lg font-medium mt-4">2.1 Eligibility</h3>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Members must be at least 18 years of age</li>
                <li>Members must provide accurate and complete registration information</li>
                <li>Membership is subject to approval by the Association</li>
              </ul>

              <h3 className="text-lg font-medium mt-4">2.2 Contribution Requirements</h3>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Minimum contribution of $25 USD for NMD account creation</li>
                <li>Contributions are voluntary and non-refundable</li>
                <li>Members may choose their preferred allocation category for contributions</li>
                <li>All contributions support the Association's mission and operations</li>
              </ul>

              <h3 className="text-lg font-medium mt-4">2.3 Membership Benefits</h3>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Access to Association updates and transparency reports</li>
                <li>Detailed breakdown of fund allocation and utilization</li>
                <li>Participation in Association events and activities</li>
                <li>Voting rights in general assemblies (where applicable)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">3. Use of Funds and Transparency</h2>
              <h3 className="text-lg font-medium mt-4">3.1 Fund Allocation</h3>
              <p className="leading-relaxed text-muted-foreground">
                Contributions are allocated according to the following categories:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li><strong>Mission Work</strong>: Community projects and direct mission activities (75% allocation)</li>
                <li><strong>Training & Education</strong>: Student training programs and educational initiatives (90% allocation)</li>
                <li><strong>Operations</strong>: Administrative costs and organizational maintenance (10-25% allocation)</li>
                <li><strong>Balanced Support</strong>: Distributed across all areas for maximum impact</li>
              </ul>

              <h3 className="text-lg font-medium mt-4">3.2 Financial Transparency</h3>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Regular financial reports published quarterly</li>
                <li>Detailed breakdown of fund utilization available to members</li>
                <li>Annual independent financial review</li>
                <li>Open access to allocation decisions and impact assessments</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">4. Member Responsibilities</h2>
              <h3 className="text-lg font-medium mt-4">4.1 Account Security</h3>
              <p className="leading-relaxed text-muted-foreground">
                Members are responsible for:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Maintaining the confidentiality of account credentials</li>
                <li>All activities that occur under their account</li>
                <li>Promptly notifying the Association of any unauthorized use</li>
              </ul>

              <h3 className="text-lg font-medium mt-4">4.2 Conduct</h3>
              <p className="leading-relaxed text-muted-foreground">
                Members agree to:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Respect other members and Association staff</li>
                <li>Use Association services for lawful purposes only</li>
                <li>Not engage in any activities that may harm the Association's reputation</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">5. Intellectual Property</h2>
              <h3 className="text-lg font-medium mt-4">5.1 Ownership</h3>
              <p className="leading-relaxed text-muted-foreground">
                All content, logos, and materials provided by the Association are the property of NMD Association 
                and are protected by intellectual property laws.
              </p>

              <h3 className="text-lg font-medium mt-4">5.2 Usage Rights</h3>
              <p className="leading-relaxed text-muted-foreground">
                Members may use Association materials for personal, non-commercial purposes related to the 
                Association's mission. Commercial use requires prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">6. Privacy and Data Protection</h2>
              <h3 className="text-lg font-medium mt-4">6.1 Data Collection</h3>
              <p className="leading-relaxed text-muted-foreground">
                We collect and process personal information including:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Contact information and identification details</li>
                <li>Contribution history and payment information</li>
                <li>Communication preferences and account activity</li>
                <li>Participation in Association activities</li>
              </ul>

              <h3 className="text-lg font-medium mt-4">6.2 Data Usage</h3>
              <p className="leading-relaxed text-muted-foreground">
                Personal data is used for:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Processing contributions and maintaining accounts</li>
                <li>Sending updates, reports, and transparency documentation</li>
                <li>Improving our services and member experience</li>
                <li>Legal compliance and regulatory requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">7. Limitation of Liability</h2>
              <h3 className="text-lg font-medium mt-4">7.1 No Warranty</h3>
              <p className="leading-relaxed text-muted-foreground">
                Services are provided "as is" without warranties of any kind, either express or implied. 
                The Association makes no guarantees regarding specific outcomes from contributions.
              </p>

              <h3 className="text-lg font-medium mt-4">7.2 Liability Limit</h3>
              <p className="leading-relaxed text-muted-foreground">
                The Association shall not be liable for:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of data or profits</li>
                <li>Issues arising from member misconduct</li>
                <li>Third-party actions or service interruptions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">8. Contribution and Refund Policy</h2>
              <h3 className="text-lg font-medium mt-4">8.1 Contribution Nature</h3>
              <p className="leading-relaxed text-muted-foreground">
                All contributions are voluntary donations to support the Association's mission. 
                No goods or services are provided in exchange for contributions, unless specifically 
                stated in the case of NMD account creation.
              </p>

              <h3 className="text-lg font-medium mt-4">8.2 Refund Policy</h3>
              <p className="leading-relaxed text-muted-foreground">
                Contributions are generally non-refundable except:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>In cases of proven processing errors</li>
                <li>When required by applicable law</li>
                <li>At the discretion of the Association's board for exceptional circumstances</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">9. Modification of Terms</h2>
              <h3 className="text-lg font-medium mt-4">9.1 Changes to Terms</h3>
              <p className="leading-relaxed text-muted-foreground">
                The Association reserves the right to modify these Terms and Conditions at any time. 
                Members will be notified of significant changes via email or through their account dashboard.
              </p>

              <h3 className="text-lg font-medium mt-4">9.2 Continued Use</h3>
              <p className="leading-relaxed text-muted-foreground">
                Continued use of services after changes constitutes acceptance of modified terms. 
                Members who do not agree with changes may terminate their membership.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">10. Termination</h2>
              <h3 className="text-lg font-medium mt-4">10.1 Member Termination</h3>
              <p className="leading-relaxed text-muted-foreground">
                Members may terminate their membership by submitting a written request and settling any 
                outstanding obligations.
              </p>

              <h3 className="text-lg font-medium mt-4">10.2 Association Termination</h3>
              <p className="leading-relaxed text-muted-foreground">
                The Association may terminate membership for:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Violation of these Terms and Conditions</li>
                <li>Fraudulent or harmful activities</li>
                <li>Non-compliance with applicable laws</li>
                <li>Actions that threaten the Association's mission or reputation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">11. Dispute Resolution</h2>
              <h3 className="text-lg font-medium mt-4">11.1 Governing Law</h3>
              <p className="leading-relaxed text-muted-foreground">
                These Terms shall be governed by the laws of the jurisdiction where the Association is registered.
              </p>

              <h3 className="text-lg font-medium mt-4">11.2 Dispute Process</h3>
              <p className="leading-relaxed text-muted-foreground">
                Members agree to attempt informal resolution first. Formal disputes shall be resolved 
                through mediation, with arbitration required before litigation in most cases.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">12. Contact Information</h2>
              <p className="leading-relaxed text-muted-foreground">
                For questions about these Terms or the Association, please contact us at:
              </p>
              <p className="leading-relaxed text-muted-foreground">
                <strong>NMD Association</strong><br />
                Email: contact@nmdassociation.org<br />
                Phone: [Phone Number]<br />
                Address: [Physical Address]
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">13. Miscellaneous</h2>
              <h3 className="text-lg font-medium mt-4">13.1 Force Majeure</h3>
              <p className="leading-relaxed text-muted-foreground">
                The Association is not liable for delays or failures in performance resulting from causes 
                beyond its reasonable control.
              </p>

              <h3 className="text-lg font-medium mt-4">13.2 Severability</h3>
              <p className="leading-relaxed text-muted-foreground">
                If any provision of these Terms is found invalid, the remaining provisions shall remain in effect.
              </p>

              <h3 className="text-lg font-medium mt-4">13.3 Entire Agreement</h3>
              <p className="leading-relaxed text-muted-foreground">
                These Terms constitute the entire agreement between members and the Association regarding 
                the subject matter herein.
              </p>
            </section>

            <section className="bg-muted/50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold">Acknowledgement</h2>
              <p className="leading-relaxed text-muted-foreground">
                By creating an NMD account or making a contribution, I acknowledge that I have read, understood, 
                and agree to be bound by these Terms and Conditions. I understand that my contribution supports 
                the Association's mission and is not payment for goods or services, except where NMD account 
                creation is specifically included.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}