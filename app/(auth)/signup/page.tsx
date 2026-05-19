'use client'

import { useState } from "react"
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignupPage (){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword , setConfirmPassword ] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const supabase = createClient()

    async function handleSignup(){
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }
        router.push('/dashboard')
    }

    return (
    

    <div className="w-full max-w-sm space-y-8">
    {/* Brand */}
    <div className="text-center space-y-2">
      <h1 className="text-2xl font-bold">DocBot</h1>
      <p className="text-muted-foreground text-sm">Welcome back</p>
    </div>

    {/* Form */}
    <div className="space-y-5">
      {/* fields yahan */}

      <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
          className="h-11"
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
          className="h-11"
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm_password">Confirm password</Label>
          <Input
            className="h-11"
            id="confirm_password"
            type="text"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

         {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Button
          onClick={handleSignup}
          disabled={loading}
          className="w-full h-11 cursor-pointer"
        >
          {loading ? 'Creating account...' : 'Sign up'}
        </Button>
    </div>

    {/* Footer */}

    <p className="text-center text-sm text-muted-foreground w-full">
          Account already exist?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
  </div>
  )
}