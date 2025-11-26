import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ForgotPasswordDialog } from "./ForgotPasswordDialog";
import { Card } from "./ui/card";
import { UserCircle, Building2, Mail, Lock, LogIn, UserPlus, Sparkles } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSignIn: (email: string, isBusiness: boolean) => void;
}

export function AuthModal({ open, onClose, onSignIn }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState<"user" | "business">("user");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onSignIn(email, accountType === "business");
      setEmail("");
      setPassword("");
      setName("");
      onClose();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
          <div className="relative">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-6 w-6" />
                <DialogTitle className="text-2xl text-white">Welcome to Localytics</DialogTitle>
              </div>
              <DialogDescription className="text-blue-100">
                {activeTab === "signin" 
                  ? "Sign in to save favorites, write reviews, and more" 
                  : "Create an account to discover amazing restaurants"}
              </DialogDescription>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6 pt-6">
                <TabsList className="grid w-full grid-cols-2 h-12 bg-muted/50">
                  <TabsTrigger 
                    value="signin" 
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Sign In Form */}
              <TabsContent value="signin" className="px-6 pb-6 mt-6">
                <Card className="border-2 border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 p-6">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Input */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 border-2 focus:border-blue-600"
                        required
                      />
                    </div>
                    
                    {/* Password Input */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-blue-600" />
                          Password
                        </Label>
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto p-0 text-xs text-blue-600 hover:text-blue-700"
                          onClick={() => {
                            onClose();
                            setShowForgotPassword(true);
                          }}
                        >
                          Forgot password?
                        </Button>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 border-2 focus:border-blue-600"
                        required
                      />
                    </div>

                    {/* Account Type */}
                    <div className="space-y-3">
                      <Label className="text-sm">I am a:</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Card 
                          className={`cursor-pointer transition-all ${
                            accountType === "user" 
                              ? "border-2 border-blue-600 bg-blue-50 dark:bg-blue-950/50" 
                              : "border-2 border-muted hover:border-blue-300"
                          }`}
                          onClick={() => setAccountType("user")}
                        >
                          <label className="flex items-center gap-3 p-4 cursor-pointer">
                            <input
                              type="radio"
                              name="accountType"
                              value="user"
                              checked={accountType === "user"}
                              onChange={(e) => setAccountType(e.target.value as "user" | "business")}
                              className="w-4 h-4 text-blue-600"
                            />
                            <UserCircle className={`h-5 w-5 ${accountType === "user" ? "text-blue-600" : "text-muted-foreground"}`} />
                            <div className="flex-1">
                              <div className={`font-medium ${accountType === "user" ? "text-blue-600" : ""}`}>Customer</div>
                              <div className="text-xs text-muted-foreground">Find & review</div>
                            </div>
                          </label>
                        </Card>
                        
                        <Card 
                          className={`cursor-pointer transition-all ${
                            accountType === "business" 
                              ? "border-2 border-blue-600 bg-blue-50 dark:bg-blue-950/50" 
                              : "border-2 border-muted hover:border-blue-300"
                          }`}
                          onClick={() => setAccountType("business")}
                        >
                          <label className="flex items-center gap-3 p-4 cursor-pointer">
                            <input
                              type="radio"
                              name="accountType"
                              value="business"
                              checked={accountType === "business"}
                              onChange={(e) => setAccountType(e.target.value as "user" | "business")}
                              className="w-4 h-4 text-blue-600"
                            />
                            <Building2 className={`h-5 w-5 ${accountType === "business" ? "text-blue-600" : "text-muted-foreground"}`} />
                            <div className="flex-1">
                              <div className={`font-medium ${accountType === "business" ? "text-blue-600" : ""}`}>Business</div>
                              <div className="text-xs text-muted-foreground">Manage listings</div>
                            </div>
                          </label>
                        </Card>
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In to Localytics
                    </Button>
                  </form>
                </Card>
              </TabsContent>
              
              {/* Sign Up Form */}
              <TabsContent value="signup" className="px-6 pb-6 mt-6">
                <Card className="border-2 border-green-100 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20 p-6">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Input */}
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4 text-green-600" />
                        Full Name
                      </Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-11 border-2 focus:border-green-600"
                        required
                      />
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-green-600" />
                        Email Address
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 border-2 focus:border-green-600"
                        required
                      />
                    </div>
                    
                    {/* Password Input */}
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-green-600" />
                        Password
                      </Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 border-2 focus:border-green-600"
                        required
                      />
                      <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                    </div>

                    {/* Account Type */}
                    <div className="space-y-3">
                      <Label className="text-sm">I want to:</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Card 
                          className={`cursor-pointer transition-all ${
                            accountType === "user" 
                              ? "border-2 border-green-600 bg-green-50 dark:bg-green-950/50" 
                              : "border-2 border-muted hover:border-green-300"
                          }`}
                          onClick={() => setAccountType("user")}
                        >
                          <label className="flex items-center gap-3 p-4 cursor-pointer">
                            <input
                              type="radio"
                              name="signupAccountType"
                              value="user"
                              checked={accountType === "user"}
                              onChange={(e) => setAccountType(e.target.value as "user" | "business")}
                              className="w-4 h-4 text-green-600"
                            />
                            <UserCircle className={`h-5 w-5 ${accountType === "user" ? "text-green-600" : "text-muted-foreground"}`} />
                            <div className="flex-1">
                              <div className={`font-medium ${accountType === "user" ? "text-green-600" : ""}`}>Customer</div>
                              <div className="text-xs text-muted-foreground">Find & review</div>
                            </div>
                          </label>
                        </Card>
                        
                        <Card 
                          className={`cursor-pointer transition-all ${
                            accountType === "business" 
                              ? "border-2 border-green-600 bg-green-50 dark:bg-green-950/50" 
                              : "border-2 border-muted hover:border-green-300"
                          }`}
                          onClick={() => setAccountType("business")}
                        >
                          <label className="flex items-center gap-3 p-4 cursor-pointer">
                            <input
                              type="radio"
                              name="signupAccountType"
                              value="business"
                              checked={accountType === "business"}
                              onChange={(e) => setAccountType(e.target.value as "user" | "business")}
                              className="w-4 h-4 text-green-600"
                            />
                            <Building2 className={`h-5 w-5 ${accountType === "business" ? "text-green-600" : "text-muted-foreground"}`} />
                            <div className="flex-1">
                              <div className={`font-medium ${accountType === "business" ? "text-green-600" : ""}`}>Business</div>
                              <div className="text-xs text-muted-foreground">Manage listings</div>
                            </div>
                          </label>
                        </Card>
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-11 bg-green-600 hover:bg-green-700 text-white">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create Account
                    </Button>
                    
                    <p className="text-xs text-center text-muted-foreground">
                      By signing up, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      <ForgotPasswordDialog
        open={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </>
  );
}
