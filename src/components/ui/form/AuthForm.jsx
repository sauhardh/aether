import React from 'react'
import InputBox from './Input'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

function AuthForm({ isSignUp = false, handleSubmit, handleChange, errors, showPassword, isLoading, setShowPassword, formData }) {

    const oauthComponent = [
        { app: "google", text: "Google", img_src: "https://www.svgrepo.com/show/475656/google-color.svg" },
        { app: "github", text: "Github", img_src: "https://www.svgrepo.com/show/512317/github-142.svg" },
    ]

    const handleOAuthSignIn = (provider) => {
        signIn(provider, {
            callbackUrl: '/dashboard'
        })
    }

    return (
        <div className="bg-[#ffffff]  min-h-screen w-full pt-10 m-0">
            <div className="flex justify-center items-center">
                <div className="bg-[#f7f6f6] rounded-2xl shadow-2xl flex space-x-20 p-14 px-20">

                    {/* Left  */}
                    <div className='w-1/2'>
                        <h1 className="text-3xl font-semibold mb-4">{isSignUp ? "Lets Get Started" : "Sign In"}</h1>
                        <p className="text-lg text-gray-600 mb-6">
                            {isSignUp ?
                                "Make the most of your idle resources"
                                : "Transforming unused resources into limitless possibilities."
                            }
                        </p>
                        {
                            errors.auth &&
                            (<div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                                {errors.auth}
                            </div>)
                        }
                        <form onSubmit={handleSubmit} className="space-y-4 mb-4">

                            {isSignUp &&
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputBox
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="First Name"
                                            className={errors.firstName ? 'border-red-500' : 'border-gray-300'}
                                        />
                                        {errors.firstName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <InputBox
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Last Name"
                                            className={errors.lastName ? 'border-red-500' : 'border-gray-300'}
                                        />
                                        {errors.lastName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                                        )}
                                    </div>
                                </div>
                            }

                            <InputBox
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className={errors.email ? 'border-red-500' : 'border-gray-300'}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                            <div className="space-y-1">
                                <div className="relative">
                                    <InputBox
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        className={errors.password ? 'border-red-500' : 'border-gray-300'}
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

                            {
                                isSignUp
                                &&
                                <div className="space-y-1">
                                    <div className="relative">
                                        <InputBox
                                            type={showPassword.confirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm Password"
                                            className={errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                                        >
                                            {showPassword.confirmPassword ? (
                                                <FaEyeSlash className="h-5 w-5" />
                                            ) : (
                                                <FaEye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </div>
                            }
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Setting up...' :
                                    (isSignUp ? "Sign Up" : "Sign In")
                                }
                            </button>
                        </form>

                        <p className='text-xs p-4'>
                            By clicking Continue, you agree to Aether's&nbsp;
                            <a href="" className='text-[#2563eb]'>User Agreement</a>&nbsp;
                            <a href="" className='text-[#2563eb]'>Privacy Policy</a>, and&nbsp;
                            <a href="" className='text-[#2563eb]'>Cookie Policy</a>.
                        </p>
                    </div>

                    {/* Right */}
                    <div className='flex flex-col items-center justify-center w-1/2'>
                        <div className="space-y-7 w-full">

                            {
                                oauthComponent.map((each, index) =>
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleOAuthSignIn(`${each.app}`)}
                                        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-full hover:bg-gray-50"
                                    >
                                        <img
                                            src={each.img_src}
                                            alt={each.text}
                                            className="h-5 w-5 mr-3"
                                        />
                                        <span className="font-medium">Continue with {each.text}</span>
                                    </button>
                                )
                            }
                        </div>
                        <p className="text-center mt-8 text-base">
                            {/* New to Aether?&nbsp; */}
                            {isSignUp ? "Already have an account?" : "New to aether?"}&nbsp;
                            <Link href={isSignUp ? "/login" : "/signup"}
                                className="text-blue-600  font-medium hover:underline">
                                {isSignUp ? "Log In" : "Sign Up"}
                            </Link>
                        </p>
                    </div>

                </div>
            </div >
        </div >
    )
}

export default AuthForm