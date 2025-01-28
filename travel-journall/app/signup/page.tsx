import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})

  const { signUpWithEmail, signInWithGoogle } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    const errors: any = {}
    if (!formData.email) {
      errors.email = "Email is required"
    }
    if (!formData.password) {
      errors.password = "Password is required"
    }
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length === 0) {
      try {
        await signUpWithEmail(formData.email, formData.password)
        toast({
          title: "Account created successfully",
          description: "You can now log in with your new account.",
        })
        router.push("/login")
      } catch (error) {
        toast({
          title: "Error creating account",
          description: "There was a problem creating your account. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      setErrors(validationErrors)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      router.push("/")
    } catch (error) {
      toast({
        title: "Error signing in with Google",
        description: "There was a problem signing in with Google. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />
      </div>
      <Button type="submit">Sign up</Button>
    </form>
  )
}

export default SignUp < div
className =
  "mt-6" >
  (
    <Button type="button" variant="outline" onClick={handleGoogleSignIn} className="w-full">
      Sign up with Google
    </Button>
  )
</div>

