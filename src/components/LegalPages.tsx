import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { FileText, Shield } from "lucide-react";

export function LegalPages() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1>Legal Information</h1>
        <p className="text-muted-foreground">
          Our terms of service and privacy policy
        </p>
      </div>

      <Tabs defaultValue="terms" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="terms" className="gap-2">
            <FileText className="size-4" />
            Terms of Service
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Shield className="size-4" />
            Privacy Policy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="terms">
          <Card>
            <CardHeader>
              <CardTitle>Terms of Service</CardTitle>
              <p className="text-sm text-muted-foreground">
                Last updated: November 11, 2025
              </p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  <section>
                    <h3>1. Acceptance of Terms</h3>
                    <p className="text-muted-foreground mt-2">
                      By accessing and using Localytics ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3>2. Use License</h3>
                    <p className="text-muted-foreground mt-2">
                      Permission is granted to temporarily access the materials (information or software) on Localytics for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                      <li>Modify or copy the materials</li>
                      <li>Use the materials for any commercial purpose or public display</li>
                      <li>Attempt to decompile or reverse engineer any software contained on the Service</li>
                      <li>Remove any copyright or other proprietary notations from the materials</li>
                      <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                    </ul>
                  </section>

                  <Separator />

                  <section>
                    <h3>3. User Accounts</h3>
                    <p className="text-muted-foreground mt-2">
                      When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account. You are responsible for safeguarding the password and for all activities that occur under your account.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3>4. User Content</h3>
                    <p className="text-muted-foreground mt-2">
                      Our Service allows you to post, link, store, share and otherwise make available certain information, text, reviews, and ratings ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3>5. Prohibited Uses</h3>
                    <p className="text-muted-foreground mt-2">
                      You may not use the Service:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                      <li>In any way that violates any applicable national or international law or regulation</li>
                      <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
                      <li>To impersonate or attempt to impersonate the Company, another user, or any other person or entity</li>
                      <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
                      <li>To post false, misleading, or fraudulent reviews</li>
                    </ul>
                  </section>

                  <Separator />

                  <section>
                    <h3>6. Business Owner Responsibilities</h3>
                    <p className="text-muted-foreground mt-2">
                      If you register as a business owner, you represent and warrant that you have the authority to bind the business to these Terms. You agree to provide accurate and up-to-date information about your business and to respond professionally to customer reviews and feedback.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3>7. Intellectual Property</h3>
                    <p className="text-muted-foreground mt-2">
                      The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of Localytics and its licensors. The Service is protected by copyright, trademark, and other laws.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3>8. Disclaimer</h3>
                    <p className="text-muted-foreground mt-2">
                      The materials on Localytics are provided on an 'as is' basis. Localytics makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3>9. Limitations</h3>
                    <p className="text-muted-foreground mt-2">
                      In no event shall Localytics or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Localytics, even if Localytics or a Localytics authorized representative has been notified orally or in writing of the possibility of such damage.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3>10. Revisions and Errata</h3>
                    <p className="text-muted-foreground mt-2">
                      The materials appearing on Localytics could include technical, typographical, or photographic errors. Localytics does not warrant that any of the materials on its website are accurate, complete, or current. Localytics may make changes to the materials contained on its website at any time without notice.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3>11. Governing Law</h3>
                    <p className="text-muted-foreground mt-2">
                      These Terms shall be governed and construed in accordance with the laws of the State of Texas, United States, without regard to its conflict of law provisions.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3>12. Changes to Terms</h3>
                    <p className="text-muted-foreground mt-2">
                      We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any significant changes by posting the new Terms on this page and updating the "Last updated" date.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3>13. Contact Us</h3>
                    <p className="text-muted-foreground mt-2">
                      If you have any questions about these Terms, please contact us at legal@localytics.com.
                    </p>
                  </section>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
              <p className="text-sm text-muted-foreground">
                Last updated: November 11, 2025
              </p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  <section>
                    <h3>1. Introduction</h3>
                    <p className="text-muted-foreground mt-2">
                      Localytics ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3>2. Information We Collect</h3>
                    <p className="text-muted-foreground mt-2">
                      We collect information that you provide directly to us, including:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                      <li>Account information (name, email address, password)</li>
                      <li>Profile information</li>
                      <li>Reviews, ratings, and comments</li>
                      <li>Business information (for business owner accounts)</li>
                      <li>Communications with us</li>
                    </ul>
                  </section>

                  <Separator />

                  <section>
                    <h3>3. Automatically Collected Information</h3>
                    <p className="text-muted-foreground mt-2">
                      When you use our Service, we automatically collect certain information, including:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                      <li>Log data (IP address, browser type, pages visited)</li>
                      <li>Device information</li>
                      <li>Usage information</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </section>

                  <Separator />

                  <section>
                    <h3>4. How We Use Your Information</h3>
                    <p className="text-muted-foreground mt-2">
                      We use the information we collect to:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                      <li>Provide, maintain, and improve our Service</li>
                      <li>Process your account registration and manage your account</li>
                      <li>Send you technical notices and support messages</li>
                      <li>Respond to your comments and questions</li>
                      <li>Analyze usage patterns and trends</li>
                      <li>Detect and prevent fraud and abuse</li>
                      <li>Comply with legal obligations</li>
                    </ul>
                  </section>

                  <Separator />

                  <section>
                    <h3>5. Information Sharing</h3>
                    <p className="text-muted-foreground mt-2">
                      We do not sell your personal information. We may share your information in the following circumstances:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                      <li>With your consent</li>
                      <li>Public information (reviews, ratings, profile information you choose to make public)</li>
                      <li>With service providers who assist in operating our Service</li>
                      <li>To comply with legal obligations</li>
                      <li>To protect our rights and prevent fraud</li>
                      <li>In connection with a business transfer or acquisition</li>
                    </ul>
                  </section>

                  <Separator />

                  <section>
                    <h3>6. Data Security</h3>
                    <p className="text-muted-foreground mt-2">
                      We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3>7. Data Retention</h3>
                    <p className="text-muted-foreground mt-2">
                      We retain your personal information for as long as necessary to provide our Service and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3>8. Your Rights</h3>
                    <p className="text-muted-foreground mt-2">
                      You have the right to:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                      <li>Access and receive a copy of your personal information</li>
                      <li>Correct inaccurate information</li>
                      <li>Request deletion of your information</li>
                      <li>Object to or restrict certain processing</li>
                      <li>Data portability</li>
                      <li>Withdraw consent</li>
                    </ul>
                  </section>

                  <Separator />

                  <section>
                    <h3>9. Cookies</h3>
                    <p className="text-muted-foreground mt-2">
                      We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3>10. Third-Party Services</h3>
                    <p className="text-muted-foreground mt-2">
                      Our Service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3>11. Children's Privacy</h3>
                    <p className="text-muted-foreground mt-2">
                      Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3>12. California Privacy Rights</h3>
                    <p className="text-muted-foreground mt-2">
                      If you are a California resident, you have specific rights regarding access to your personal information under the California Consumer Privacy Act (CCPA).
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3>13. International Data Transfers</h3>
                    <p className="text-muted-foreground mt-2">
                      Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3>14. Changes to Privacy Policy</h3>
                    <p className="text-muted-foreground mt-2">
                      We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3>15. Contact Us</h3>
                    <p className="text-muted-foreground mt-2">
                      If you have any questions about this Privacy Policy, please contact us at:
                    </p>
                    <ul className="list-none mt-2 space-y-1 text-muted-foreground">
                      <li>Email: privacy@localytics.com</li>
                      <li>Address: Richardson, TX</li>
                    </ul>
                  </section>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
