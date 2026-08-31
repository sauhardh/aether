'use client'
import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import InputBox from '@/components/ui/form/Input'
import AuthForm from '@/components/ui/form/AuthForm'
import "@/app/globals.css"

const Signup = () => {

  useEffect(() => {
    document.title = 'SignUp • Aether'
  }, [])
  const router = useRouter()
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
      // Add your signup API call here
      router.push('/login')
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
