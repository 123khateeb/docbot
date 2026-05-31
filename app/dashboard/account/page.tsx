"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Check, Loader2, Eye, EyeOff, User, Lock, Trash2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState("")
  const [userId, setUserId] = useState("")
  const [createdAt, setCreatedAt] = useState("")

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  // Email change state
  const [newEmail, setNewEmail] = useState("")
  const [emailSaving, setEmailSaving] = useState(false)
  const [emailSaved, setEmailSaved] = useState(false)
  const [emailError, setEmailError] = useState("")

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteInput, setDeleteInput] = useState("")
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || "")
        setUserId(user.id)
        setCreatedAt(new Date(user.created_at).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'long', year: 'numeric'
        }))
      }
    }
    fetchUser()
  }, [])

  // Password validation
  function validatePassword(pass: string) {
    if (pass.length < 8) return "Password must be at least 8 characters"
    if (!/[A-Z]/.test(pass)) return "Must contain at least one uppercase letter"
    if (!/[0-9]/.test(pass)) return "Must contain at least one number"
    return ""
  }

  async function handlePasswordChange() {
    setPasswordError("")
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }
    const validationError = validatePassword(newPassword)
    if (validationError) {
      setPasswordError(validationError)
      return
    }
    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current password")
      return
    }

    setPasswordSaving(true)
    const supabase = createClient()

    // Re-authenticate with current password first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: currentPassword,
    })

    if (signInError) {
      setPasswordError("Current password is incorrect")
      setPasswordSaving(false)
      return
    }

    // Update to new password
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    setPasswordSaving(false)
    if (error) {
      setPasswordError(error.message)
    } else {
      setPasswordSaved(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => setPasswordSaved(false), 3000)
    }
  }

  async function handleEmailChange() {
    setEmailError("")
    if (!newEmail.trim()) {
      setEmailError("Email is required")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setEmailError("Invalid email address")
      return
    }
    if (newEmail === userEmail) {
      setEmailError("New email must be different from current email")
      return
    }

    setEmailSaving(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ email: newEmail })

    setEmailSaving(false)
    if (error) {
      setEmailError(error.message)
    } else {
      setEmailSaved(true)
      setNewEmail("")
      setTimeout(() => setEmailSaved(false), 5000)
    }
  }

  async function handleDeleteAccount() {
    if (deleteInput !== "DELETE") return
    setDeleting(true)
    const res = await fetch('/api/account/delete', { method: 'POST' })
    if (res.ok) {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/')
    } else {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const passwordStrength = newPassword.length === 0 ? 0
    : newPassword.length < 6 ? 1
    : newPassword.length < 8 ? 2
    : /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) ? 4
    : 3

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Account</h1>
        <p className="text-sm text-muted-foreground">Manage your account details and security settings.</p>
      </div>

      {/* Profile Info Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Profile</CardTitle>
          </div>
          <CardDescription>Your account information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-xl font-bold text-primary-foreground">
                {userEmail?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="space-y-1 min-w-0">
              <p className="font-semibold text-sm truncate">{userEmail}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <p className="text-xs text-muted-foreground">Active account</p>
              </div>
              <p className="text-xs text-muted-foreground">Member since {createdAt}</p>
            </div>
          </div>

          {/* Change Email */}
          <div className="space-y-3 pt-2">
            <Label className="text-xs font-semibold">Change Email Address</Label>
            <p className="text-xs text-muted-foreground">Current: <span className="font-medium text-foreground">{userEmail}</span></p>
            <div className="flex gap-2">
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => { setNewEmail(e.target.value); setEmailError("") }}
                placeholder="Enter new email address"
                className="h-9 text-sm flex-1"
              />
              <button
                type="button"
                onClick={handleEmailChange}
                disabled={emailSaving || !newEmail.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold disabled:opacity-40 flex items-center gap-1.5 transition-opacity hover:opacity-90 whitespace-nowrap"
              >
                {emailSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : emailSaved ? <Check className="h-3.5 w-3.5" /> : null}
                {emailSaved ? "Email sent!" : "Update"}
              </button>
            </div>
            {emailError && <p className="text-xs text-destructive">{emailError}</p>}
            {emailSaved && (
              <p className="text-xs text-green-600 flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" />
                Confirmation email sent to {newEmail}. Please verify to complete the change.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Password Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Change Password</CardTitle>
          </div>
          <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Current Password */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Current Password</Label>
            <div className="relative">
              <Input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => { setCurrentPassword(e.target.value); setPasswordError("") }}
                placeholder="Enter current password"
                className="h-9 text-sm pr-10"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">New Password</Label>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setPasswordError("") }}
                placeholder="Enter new password"
                className="h-9 text-sm pr-10"
              />
              <button type="button" onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {/* Password strength */}
            {newPassword.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex gap-1">
                  {[1,2,3,4].map((level) => (
                    <div key={level} className={`h-1 flex-1 rounded-full transition-all ${
                      passwordStrength >= level ? strengthColor[passwordStrength] : 'bg-muted'
                    }`} />
                  ))}
                </div>
                <p className={`text-[10px] font-medium ${
                  passwordStrength <= 1 ? 'text-red-500' :
                  passwordStrength === 2 ? 'text-yellow-500' :
                  passwordStrength === 3 ? 'text-blue-500' : 'text-green-500'
                }`}>{strengthLabel[passwordStrength]}</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Confirm New Password</Label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError("") }}
                placeholder="Confirm new password"
                className="h-9 text-sm pr-10"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-[10px] text-destructive">Passwords do not match</p>
            )}
            {confirmPassword && newPassword === confirmPassword && confirmPassword.length > 0 && (
              <p className="text-[10px] text-green-600 flex items-center gap-1"><Check className="h-3 w-3" />Passwords match</p>
            )}
          </div>

          {/* Requirements */}
          <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Requirements</p>
            {[
              { text: 'At least 8 characters', met: newPassword.length >= 8 },
              { text: 'One uppercase letter', met: /[A-Z]/.test(newPassword) },
              { text: 'One number', met: /[0-9]/.test(newPassword) },
            ].map((req) => (
              <div key={req.text} className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${req.met ? 'bg-green-500' : 'bg-muted-foreground/20'}`}>
                  {req.met && <Check className="h-2 w-2 text-white" />}
                </div>
                <p className={`text-[10px] ${req.met ? 'text-green-600' : 'text-muted-foreground'}`}>{req.text}</p>
              </div>
            ))}
          </div>

          {passwordError && (
            <p className="text-xs text-destructive flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
              {passwordError}
            </p>
          )}

          <button
            type="button"
            onClick={handlePasswordChange}
            disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
          >
            {passwordSaving ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Updating password...</>
            ) : passwordSaved ? (
              <><Check className="h-4 w-4" />Password updated!</>
            ) : (
              "Update Password"
            )}
          </button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-destructive" />
            <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription>Irreversible actions. Please be careful.</CardDescription>
        </CardHeader>
        <CardContent>
          {!showDeleteConfirm ? (
            <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/20 bg-destructive/5">
              <div>
                <p className="text-sm font-semibold">Delete Account</p>
                <p className="text-xs text-muted-foreground mt-0.5">Permanently delete your account and all data.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Delete Account
              </button>
            </div>
          ) : (
            <div className="space-y-4 p-4 rounded-xl border border-destructive/30 bg-destructive/5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-destructive">This action cannot be undone!</p>
                  <p className="text-xs text-muted-foreground mt-1">All your bots, documents, and data will be permanently deleted.</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Type <span className="font-bold text-destructive">DELETE</span> to confirm</Label>
                <Input
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder="Type DELETE"
                  className="h-9 text-sm border-destructive/30 focus:border-destructive"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowDeleteConfirm(false); setDeleteInput("") }}
                  className="flex-1 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteInput !== "DELETE" || deleting}
                  className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-lg text-xs font-semibold disabled:opacity-40 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  {deleting ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Deleting...</> : "Confirm Delete"}
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}