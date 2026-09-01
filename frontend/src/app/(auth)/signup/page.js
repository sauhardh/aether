'use client'
import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useRouter, usePathname } from 'next/navigation'
import InputBox from '@/components/ui/form/Input'
import AuthForm from '@/components/ui/form/AuthForm'
import "@/app/globals.css"

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:7878'

const Signup = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()

  useEffect(() => {
    document.title = 'SignUp • Aether'
  }, [])

  // Auto-redirect if already authenticated (e.g. after GitHub signup)
  useEffect(() => {
    if (session) {
      if (pathname === "/signup") {
        router.push("/lobby")
      }
    }
  }, [session, router, pathname])

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      const username = `${formData.firstName.trim()}_${formData.lastName.trim()}`
      const res = await fetch(`${SERVER_URL}/api/authenticate-user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.ok) {
        setErrors({ auth: data.message || 'Signup failed' })
        return
      }

      // Automatically sign in upon successful signup
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        router.push('/login')
      } else {
        router.push('/lobby')
      }
    } catch (error) {
      setErrors({ auth: 'Something went wrong. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (

    <  AuthForm
      isSignUp={true}
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
export default Signup
