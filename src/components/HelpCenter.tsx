import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  FileText, 
  Shield, 
  BookOpen,
  Search,
  Send
} from "lucide-react";

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Message sent!", {
      description: "We'll get back to you within 24 hours",
    });
    
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const faqs = [
    {
      category: "General",
      questions: [
        {
          question: "What is Localytics?",
          answer: "Localytics is a comprehensive restaurant rating platform that scores restaurants out of 100 based on six key factors: Food Quality, Service, Ambiance, Value for Money, Cleanliness, and Location. We provide objective, data-driven insights to help you discover the best dining experiences in Richardson, TX."
        },
        {
          question: "How are restaurants scored?",
          answer: "Restaurants are scored using our proprietary LBH Score methodology, which evaluates six key categories. Each category is weighted based on its importance to the overall dining experience. The final score is calculated on a scale of 0-100, with detailed breakdowns available for each category."
        },
        {
          question: "Is Localytics free to use?",
          answer: "Yes! Localytics is completely free for customers. You can browse restaurants, read reviews, compare options, and access all features without any cost. Business owners can also create free accounts to access their dashboard and insights."
        }
      ]
    },
    {
      category: "For Customers",
      questions: [
        {
          question: "How do I leave a review?",
          answer: "To leave a review, you need to be signed in to your account. Navigate to the restaurant's detail page and click the 'Write a Review' button. You can rate your experience and provide detailed feedback on your visit."
        },
        {
          question: "Can I save my favorite restaurants?",
          answer: "Absolutely! Click the heart icon on any restaurant card to add it to your favorites. You can access all your saved restaurants from your profile page."
        },
        {
          question: "How do I compare restaurants?",
          answer: "Use the comparison tool accessible from the main navigation. Select up to 3 restaurants to compare their scores, categories, and features side-by-side."
        },
        {
          question: "What are deals and offers?",
          answer: "Restaurants can post special promotions and limited-time offers. These are displayed on their restaurant cards and detail pages. Make sure to check the terms and validity dates for each deal."
        }
      ]
    },
    {
      category: "For Business Owners",
      questions: [
        {
          question: "How do I add my restaurant to Localytics?",
          answer: "Click the 'Add Your Business' button in the header, fill out the registration form with your restaurant details, and submit. Once approved, you'll have access to your business dashboard with comprehensive operational insights."
        },
        {
          question: "What is the Business Dashboard?",
          answer: "The Business Dashboard is your operational intelligence platform. It provides your LBH Score, competitive benchmarking, score trends, watchlist for competitors, operational insights with priority recommendations, and transparent data source information."
        },
        {
          question: "How can I improve my restaurant's score?",
          answer: "Your dashboard provides priority-ranked, actionable recommendations based on your performance data. Focus on the critical issues highlighted in the Operational Insights tab, which identifies root causes and specific improvements you can make."
        },
        {
          question: "Can I respond to customer reviews?",
          answer: "Yes! As a verified business owner, you can respond to reviews on your restaurant's page. This helps you engage with customers, address concerns, and show your commitment to excellent service."
        },
        {
          question: "How do I create deals and offers?",
          answer: "From your business dashboard, navigate to the Deals section where you can create special promotions, set validity dates, and manage active offers."
        }
      ]
    },
    {
      category: "Privacy & Security",
      questions: [
        {
          question: "How is my data protected?",
          answer: "We take data security seriously. All personal information is encrypted and stored securely. We never share your personal data with third parties without your consent. Read our Privacy Policy for detailed information."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, you can permanently delete your account from the Account Settings page. This will remove all your data including reviews, favorites, and profile information."
        },
        {
          question: "How do I change my password?",
          answer: "Go to Account Settings > Security to change your password. You can also use the 'Forgot Password' link on the sign-in page if you need to reset it."
        }
      ]
    }
  ];

  const filteredFaqs = searchQuery
    ? faqs.map(category => ({
        ...category,
        questions: category.questions.filter(
          q =>
            q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(category => category.questions.length > 0)
    : faqs;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-3">
            <HelpCircle className="size-12 text-primary" />
          </div>
        </div>
        <h1>Help Center</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions, learn how to use Localytics, or get in touch with our support team
        </p>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="faq">FAQs</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {filteredFaqs.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle>{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No results found. Try a different search term or contact support.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="size-5 text-primary" />
                  <CardTitle>Getting Started Guide</CardTitle>
                </div>
                <CardDescription>
                  Learn the basics of using Localytics to discover great restaurants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge>5 min read</Badge>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="size-5 text-primary" />
                  <CardTitle>Business Owner Guide</CardTitle>
                </div>
                <CardDescription>
                  Complete guide to managing your restaurant on Localytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge>10 min read</Badge>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageCircle className="size-5 text-primary" />
                  <CardTitle>Understanding LBH Scores</CardTitle>
                </div>
                <CardDescription>
                  Learn how we calculate and interpret restaurant scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge>7 min read</Badge>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="size-5 text-primary" />
                  <CardTitle>Privacy & Security</CardTitle>
                </div>
                <CardDescription>
                  How we protect your data and ensure platform security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge>6 min read</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="size-5 text-primary" />
                <CardTitle>Contact Support</CardTitle>
              </div>
              <CardDescription>
                Can't find what you're looking for? Send us a message and we'll help you out
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Name</Label>
                    <Input
                      id="contact-name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-subject">Subject</Label>
                  <Input
                    id="contact-subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea
                    id="contact-message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Tell us how we can help..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  <Send className="size-4" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Other Ways to Reach Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="size-5 text-primary mt-0.5" />
                <div>
                  <p>Email</p>
                  <p className="text-muted-foreground">support@localytics.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MessageCircle className="size-5 text-primary mt-0.5" />
                <div>
                  <p>Response Time</p>
                  <p className="text-muted-foreground">Usually within 24 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}