import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";
import { User, Bell, Lock, Mail, Trash2, Save, Eye, EyeOff } from "lucide-react";
import { User as UserType } from "../types/restaurant";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface AccountSettingsProps {
  user: UserType;
  onUpdateUser: (updates: Partial<UserType>) => void;
  onDeleteAccount: () => void;
}

export function AccountSettings({ user, onUpdateUser, onDeleteAccount }: AccountSettingsProps) {
  const [name, setName] = useState(user.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [reviewNotifications, setReviewNotifications] = useState(true);
  const [dealNotifications, setDealNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onUpdateUser({ name });
    toast.success("Profile updated!", {
      description: "Your profile information has been saved",
    });
    
    setIsSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
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

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Password changed!", {
      description: "Your password has been updated successfully",
    });
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsSaving(false);
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Notification preferences saved!", {
      description: "Your notification settings have been updated",
    });
    
    setIsSaving(false);
  };

  const handleDeleteAccount = () => {
    onDeleteAccount();
    toast.success("Account deleted", {
      description: "Your account has been permanently deleted",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div>
        <h2>Account Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Separator />

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="size-5 text-primary" />
            <CardTitle>Profile Information</CardTitle>
          </div>
          <CardDescription>
            Update your personal information and email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email address cannot be changed. Contact support if you need to update it.
            </p>
          </div>

          {user.isBusiness && (
            <div className="space-y-2">
              <Label>Account Type</Label>
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md">
                <span className="text-sm">Business Owner Account</span>
              </div>
            </div>
          )}

          <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2">
            <Save className="size-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="size-5 text-primary" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>
            Change your password and manage security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            <Button type="submit" disabled={isSaving || !currentPassword || !newPassword}>
              {isSaving ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="size-5 text-primary" />
            <CardTitle>Notification Preferences</CardTitle>
          </div>
          <CardDescription>
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email updates about your account
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Review Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when someone responds to your reviews
              </p>
            </div>
            <Switch
              checked={reviewNotifications}
              onCheckedChange={setReviewNotifications}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Deal & Offer Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about special deals from restaurants
              </p>
            </div>
            <Switch
              checked={dealNotifications}
              onCheckedChange={setDealNotifications}
            />
          </div>

          <Button onClick={handleSaveNotifications} disabled={isSaving} className="gap-2">
            <Save className="size-4" />
            {isSaving ? "Saving..." : "Save Preferences"}
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="size-5 text-destructive" />
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="size-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove all your data from our servers, including:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>All your reviews and ratings</li>
                    <li>Your favorites and bookmarks</li>
                    <li>Your profile information</li>
                    {user.isBusiness && <li>Your business dashboard data</li>}
                  </ul>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Yes, Delete My Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
