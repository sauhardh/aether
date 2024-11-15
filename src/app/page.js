import { ArrowRight, Monitor, Share2, Shield, Zap, Facebook, Instagram, Linkedin, MessageSquare } from 'lucide-react';
import Link from 'next/link';
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="w-full h-[70vh] bg-cover bg-center" style={{ backgroundImage: 'url(/bg_landing.webp)' }}>
        <div className="flex items-center justify-center h-full w-full">
          <div className="text-center space-y-8 text-white">
            <h1 className="text-5xl font-bold">Welcome to Aether</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Share desktop resources seamlessly across devices with enterprise-grade security
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                <Link href={"/about"} className="text-white">Learn More</Link>
            </button>
            </div>
          </div>
        </div>
      </div>
      {/* how it works section*/}

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* first step */}
          <div className="space-y-4 border rounded-lg border-gray-400">
            <div className="relative">
              <img
                src="/1st_step.jpeg"
                alt="First Step"
                className="w-full rounded-lg shadow-lg"
              />
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                1
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center">Connect Your Device</h3>
            <div className="bg-white p-6 rounded-lg ">
              <p className="text-gray-700 leading-relaxed">
                Begin by creating your Aether account and choosing your role - either as a
                <span className="font-semibold text-blue-600"> Resource Provider </span>
                or a
                <span className="font-semibold text-green-600"> Resource User</span>.
                As a Provider, you'll register your device by specifying its capabilities:
              </p>
              <ul className="mt-3 space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Hardware specifications (CPU, RAM, GPU)
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Available time slots
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Pricing preferences
                </li>
              </ul>
              <p className="mt-3 text-gray-700">
                Once registered, you can easily toggle your device's availability and start
                earning when your computer would otherwise be idle.
              </p>
            </div>
          </div>
          {/* second step */}
          <div className="space-y-4 border rounded-lg border-gray-400">
            <div className="relative">
              <img
                src="/2nd_step.jpeg"
                alt="Second Step"
                className="w-full rounded-lg shadow-lg"
              />
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                2
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center">Select Best Resources</h3>
            <div className="bg-white p-6 rounded-lg shadow-sm">
    <p className="text-gray-700 leading-relaxed">
      As a <span className="font-semibold text-green-600">Resource User</span>, 
      find the perfect device match using our advanced search filters. Specify exactly what you need:
    </p>
    <ul className="mt-3 space-y-2 text-gray-600">
      <li className="flex items-start">
        <span className="mr-2">•</span>
        <div>
          <span className="font-medium">Computing Power:</span> Filter by CPU cores, RAM, and GPU specifications
        </div>
      </li>
      <li className="flex items-start">
        <span className="mr-2">•</span>
        <div>
          <span className="font-medium">Time Duration:</span> Choose hourly, daily, or weekly rental periods
        </div>
      </li>
      <li className="flex items-start">
        <span className="mr-2">•</span>
        <div>
          <span className="font-medium">Budget Range:</span> Set your preferred price range and compare options
        </div>
      </li>
      <li className="flex items-start">
        <span className="mr-2">•</span>
        <div>
          <span className="font-medium">Availability:</span> View real-time device status and scheduling
        </div>
      </li>
    </ul>
    <p className="mt-3 text-gray-700">
      Compare multiple devices, check user ratings, and view performance metrics before making your selection.Once selected make payments for booked time slot. Our secure payment system ensures a safe transaction for both parties.
    </p>
   
  </div>

          </div>
          {/* third step */}
          <div className="space-y-4 border rounded-lg border-gray-400">
            <div className="relative">
              <img
                src="/3rd_step.jpeg"
                alt="Third Step"
                className="w-full rounded-lg shadow-lg"
              />
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                3
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center">Start Sharing</h3>
            <div className="bg-white p-6 rounded-lg shadow-sm">
    <p className="text-gray-700 leading-relaxed">
      Once you've selected your ideal device and make deal, connecting and starting your work is seamless. Our platform ensures:
    </p>
    <ul className="mt-3 space-y-2 text-gray-600">
      <li className="flex items-start">
        <span className="mr-2">•</span>
        <div>
          <span className="font-medium">One-Click Connection:</span> Connect to your selected device instantly through our secure desktop application
        </div>
      </li>
      <li className="flex items-start">
        <span className="mr-2">•</span>
        <div>
          <span className="font-medium">Real-time Monitoring:</span> Track resource usage, connection speed, and performance metrics live
        </div>
      </li>
      <li className="flex items-start">
        <span className="mr-2">•</span>
        <div>
          <span className="font-medium">Secure Data Transfer:</span> End-to-end encryption ensures your work and data remain private
        </div>
      </li>
     
    </ul>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-sm text-green-800">
          <span className="font-semibold">For Users:</span> Access your remote workspace through any device with our cross-platform compatibility.
        </p>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">For Providers:</span>
          Receive instant payments and ensure your device is protected from unauthorized access or illegal activities.

           
        </p>
      </div>
    </div>
   
  </div>
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold">Lightning Fast</h3>
            <p className="text-gray-600">
              Experience minimal latency with our optimized connection protocols
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">Secure by Design</h3>
            <p className="text-gray-600">
              End-to-end encryption and enterprise-grade security protocols
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Share2 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold">Easy Sharing</h3>
            <p className="text-gray-600">
              Share resources across devices with just a few clicks
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Aether?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

            <div>
              <h3 className="text-4xl font-bold text-blue-600">99.9%</h3>
              <p className="text-gray-600 mt-2">Uptime</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-blue-600">10ms</h3>
              <p className="text-gray-600 mt-2">Average Latency</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-blue-600">24/7</h3>
              <p className="text-gray-600 mt-2">Active Support</p>
            </div>
          </div>
        </div>
      </div>


      {/* Join Our Community Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Join Our Community</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Connect with us on social media to stay updated with the latest features, tips, and community highlights.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <a href="#" className="group flex flex-col items-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Facebook className="h-8 w-8 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600 mt-2 block">Facebook</span>
            </a>
            <a href="#" className="group flex flex-col items-center">
              <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600 mt-2 block">Discord</span>
            </a>
            <a href="#" className="group flex flex-col items-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Linkedin className="h-8 w-8 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600 mt-2 block">LinkedIn</span>
            </a>
            <a href="#" className="group flex flex-col items-center">
              <div className="h-16 w-16 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                <Instagram className="h-8 w-8 text-pink-600" />
              </div>
              <span className="text-sm text-gray-600 mt-2 block">Instagram</span>
            </a>          </div>        </div>      </div>    </div>  );}