'use client'
import { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
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

  // Redirect if already authenticated
  if (session) {
    router.push('/dashboard')
    return null
  }

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

  const handleOAuthSignIn = (provider) => {
    signIn(provider, { 
      callbackUrl: '/dashboard'
    })
  }

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <div className="max-w-[1128px] mx-auto py-20">
        <div className="mt-8 px-4">
          <div className="max-w-[520px] mx-auto bg-[#f7f6f6] rounded-lg p-6 shadow-2xl">
            <h1 className="text-center text-3xl font-semibold mb-4">Sign in</h1>
            <p className="text-center text-sm text-gray-600 mb-6">
              Transforming unused resources into limitless possibilities.
            </p>

            {errors.auth && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {errors.auth}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mb-4">
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className={`w-full px-3 py-2 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className={`w-full px-3 py-2 border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex justify-end">
                <Link 
                  href="/forgot-password" 
                  className="text-blue-600 font-medium text-sm hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="relative mb-0 mt-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-500"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#f7f6f6] text-gray-500">or</span>
              </div>
            </div>

            <p className='text-xs p-4'>
              By clicking Continue, you agree to Aether's{' '}
              <a href="" className='text-[#2563eb]'>User Agreement</a>,{' '}
              <a href="" className='text-[#2563eb]'>Privacy Policy</a>, and{' '}
              <a href="" className='text-[#2563eb]'>Cookie Policy</a>.
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleOAuthSignIn('google')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-full hover:bg-gray-50"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="h-5 w-5 mr-3"
                />
                <span className="font-medium">Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthSignIn('github')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-full hover:bg-gray-50"
              >
                <img
                  src="https://www.svgrepo.com/show/512317/github-142.svg"
                  alt="GitHub"
                  className="h-5 w-5 mr-3"
                />
                <span className="font-medium">Continue with GitHub</span>
              </button>
            </div>

            <p className="text-center mt-8 text-lg">
              New to Aether?{' '}
              <Link href="/signup" className="text-blue-600 font-medium hover:underline">
                Join now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login