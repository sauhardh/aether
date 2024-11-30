import { ArrowRight, Share2, Zap, Shield, Facebook, Instagram, Linkedin, MessageSquare } from 'lucide-react'
import { alfa_slab } from './ui/fonts'
import Link from 'next/link'

export default function Home() {

  const how_it_works_data = [
    { id: 1, title: "Connect Your Device", src: "/1ststep.jpeg" },
    { id: 2, title: "Select Best Resources", src: "/2nd_step.jpeg" },
    { id: 3, title: "Start Sharing", src: "/3rd_step.jpeg" }
  ];

  const features_data = [
    { id: 1, title: "Lightning Fast", description: "Experience minimal latency with our optimized connection protocols", comp: Zap },
    { id: 2, title: "Secure by Design", description: "End-to-end encryption and enterprise-grade security protocols", comp: Shield },
    { id: 3, title: "Easy Sharing", description: "Share resources across devices with just a few clicks", comp: Share2 },
  ]

  const choose_aether_data = [
    { id: 1, title: "99.9%", description: "Uptime" },
    { id: 2, title: "10ms", description: "Average Latency" },
    { id: 3, title: "24/7", description: "Active Support" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">

        <div className="text-center space-y-8 pt-10">
          <h1 className={`text-6xl font-bold text-primary  ${alfa_slab.className} `}>Welcome to Aether</h1>
          <p className="text-3xl text-gray-600 max-w-2xl mx-auto">
            Share desktop resources seamlessly across devices with enterprise-grade security
          </p>
          <div className="flex justify-center gap-4">
            <Link href={"/login"} className="px-8 py-4 bg-secondary text-white rounded-lg hover:bg-primary flex items-center">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href={"/about"} className="px-8 py-4 border border-secondary rounded-lg hover:primary hover:bg-primary hover:text-white">
              Learn More
            </Link>
          </div>
        </div>
      </div>
      {/* how it works section*/}
      <div className="container mx-auto px-4 py-16 flex flex-col justify-center items-center bg-secondary">

        <h2 className={`text-3xl font-bold text-center mb-12 ${alfa_slab.className} text-white border-b-[12px]  inline-block border-tertiary `}>How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3  gap-x-20">

          {
            how_it_works_data.map(each => (
              <div
                key={each.id}
                className="flex flex-col  justify-between">
                <div className="relative w-96 shadow-md">
                  <img
                    src={each.src}
                    alt={each.title}
                    className="w-full rounded-3xl border-8  border-gray-300 shadow-lg hover:shadow-inner"
                  />
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold shadow-inner">
                    {each.id}
                  </div>
                </div>
                <h3 className={`text-2xl font-semibold text-center  text-gray-300 w-full p-7  self-start `}>{each.title}</h3>
              </div>

            ))
          }

        </div>
      </div>
      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 flex flex-col justify-center items-center  ">
        <h2 className={`text-3xl font-bold text-center mb-12 ${alfa_slab.className}  text-primary border-b-[12px]  inline-block border-tertiary`}>Our features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {
            features_data.map(each => (
              <div
                key={each.id}
                className="bg-white p-6 rounded-xl shadow-lg space-y-4"
              >
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <each.comp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold">{each.title}</h3>
                <p className="text-gray-600">
                  {each.description}
                </p>
              </div>
            ))
          }
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary py-16 ">
        <div className="container mx-auto px-4 ">

          <div className='flex  justify-center '>
            <h2 className={`text-3xl font-bold text-center mb-12 ${alfa_slab.className}  text-white border-b-[12px]  inline-block border-tertiary`}>Why Choose Aether?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center text-white py-10">
            {
              choose_aether_data.map(each => (
                <div
                  key={each.id}
                >
                  <h3 className="text-4xl font-bold text-tertiary">{each.title}</h3>
                  <p className=" mt-2">{each.description}</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>


      {/* Join Our Community Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className='flex justify-center'>
            <h2 className={`text-3xl font-bold text-center mb-8 ${alfa_slab.className}  text-primary border-b-[12px]  inline-block border-tertiary`}>Join Our Community</h2>
          </div>
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
            </a>

          </div>


        </div>
      </div>
    </div >
  );
}