import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner@2.0.3";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ForgotPasswordDialog({ open, onClose }: ForgotPasswordDialogProps) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "code" | "newPassword" | "success">("email");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Password reset code sent!", {
      description: `We've sent a verification code to ${email}`,
    });
    
    setIsSubmitting(false);
    setStep("code");
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (verificationCode.length === 6) {
      toast.success("Code verified!");
      setIsSubmitting(false);
      setStep("newPassword");
    } else {
      toast.error("Invalid code", {
        description: "Please enter a valid 6-digit code",
      });
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please make sure your passwords match",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password too short", {
        description: "Password must be at least 8 characters",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setStep("success");
  };

  const handleClose = () => {
    setEmail("");
    setVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
    setStep("email");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === "email" && (
          <>
            <DialogHeader>
              <DialogTitle>Reset Your Password</DialogTitle>
              <DialogDescription>
                Enter your email address and we'll send you a code to reset your password
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSendResetLink} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Reset Code"}
                </Button>
              </div>
            </form>
          </>
        )}

        {step === "code" && (
          <>
            <DialogHeader>
              <DialogTitle>Enter Verification Code</DialogTitle>
              <DialogDescription>
                We sent a 6-digit code to {email}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  className="text-center tracking-widest"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep("email")}
                  className="gap-1"
                >
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? "Verifying..." : "Verify Code"}
                </Button>
              </div>

              <Button
                type="button"
                variant="link"
                onClick={handleSendResetLink}
                className="w-full"
              >
                Resend code
              </Button>
            </form>
          </>
        )}

        {step === "newPassword" && (
          <>
            <DialogHeader>
              <DialogTitle>Create New Password</DialogTitle>
              <DialogDescription>
                Choose a strong password for your account
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep("code")}
                  className="gap-1"
                >
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </form>
          </>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <DialogTitle>Password Reset Successful!</DialogTitle>
              <DialogDescription>
                Your password has been successfully reset
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center gap-4 py-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                <CheckCircle2 className="size-12 text-green-600 dark:text-green-500" />
              </div>
              <p className="text-center text-muted-foreground">
                You can now sign in with your new password
              </p>
            </div>

            <Button onClick={handleClose} className="w-full">
              Go to Sign In
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
