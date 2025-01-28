"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { signInWithGoogle, signUpWithEmail } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isLogin) {
        // Implement login logic here
        console.log("Login with:", email, password)
      } else {
        await signUpWithEmail(email, password)
        toast({
          title: "Account created successfully",
          description: "You can now log in with your new account.",
        })
      }
      router.push("/")
    } catch (error) {
      toast({
        title: `Error ${isLogin ? "logging in" : "signing up"}`,
        description: "There was a problem. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle()
      router.push("/")
    } catch (error) {
      toast({
        title: "Error signing in with Google",
        description: "There was a problem. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="container mx-auto py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          {isLogin ? "Login" : "Sign Up"}
        </Button>
      </form>
      <div className="mt-4 text-center">
        <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
        </Button>
      </div>
      <div className="mt-6">
        <Button variant="outline" onClick={handleGoogleAuth} className="w-full">
          Continue with Google
        </Button>
      </div>
    </main>
  )
}

