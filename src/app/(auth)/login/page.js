'use client'
import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { usePathname, useSearchParams } from 'next/navigation'
import AuthForm from '@/components/ui/form/AuthForm.jsx'
import "@/app/globals.css"

const Login = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname();


  useEffect(() => {
    document.title = "Login • Aether"
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (session) {


      // router.push('/dashboard')

      if (pathname == "/login") {
        router.push("/")
      }
      console.log("There is session", session)
    }
  }, [session, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formErrors = validateForm()

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })
      if (result?.error) {
        setErrors({ auth: 'Invalid email or password' })
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      setErrors({ auth: 'Something went wrong. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <  AuthForm
      isSignUp={false}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      errors={errors}
      formData={formData}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      isLoading={isLoading}
    />
  )
}

export default Login