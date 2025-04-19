import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header Section */}
      <header className="pt-12 pb-6 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Carolinian Accommodation App</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover the best places to eat, relax, and find services around campus
        </p>
      </header>

      {/* Main Buttons Section */}
      <section className="max-w-6xl mx-auto p-4 grid gap-6 md:grid-cols-3 md:gap-8">
        {/* Food Items Button */}
        <Link href="/food_places/food_items/" className="group">
          <div className="h-full bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border-2 border-transparent hover:border-orange-400">
            <div className="h-48 bg-orange-100 relative">
              <Image src="/placeholder.svg?height=400&width=600" alt="Food Items" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-500/70 to-transparent flex items-end">
                <h2 className="text-white text-3xl font-bold p-6">Food Places</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                Discover restaurants, cafes, and food stalls around campus. Find the perfect place for your next meal.
              </p>
              <div className="mt-4 flex justify-end">
                <span className="inline-flex items-center text-orange-500 font-medium group-hover:text-orange-600">
                  Explore Food Places
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Leisure Items Button */}
        <Link href="/leisure_places/leisure_items/" className="group">
          <div className="h-full bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border-2 border-transparent hover:border-green-400">
            <div className="h-48 bg-green-100 relative">
              <Image src="/placeholder.svg?height=400&width=600" alt="Leisure Items" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-green-500/70 to-transparent flex items-end">
                <h2 className="text-white text-3xl font-bold p-6">Leisure Places</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                Find parks, recreation areas, and entertainment venues. Discover places to relax and have fun.
              </p>
              <div className="mt-4 flex justify-end">
                <span className="inline-flex items-center text-green-500 font-medium group-hover:text-green-600">
                  Explore Leisure Places
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Service Items Button */}
        <Link href="/service_places/service_items/" className="group">
          <div className="h-full bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border-2 border-transparent hover:border-purple-400">
            <div className="h-48 bg-purple-100 relative">
              <Image src="/placeholder.svg?height=400&width=600" alt="Service Items" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/70 to-transparent flex items-end">
                <h2 className="text-white text-3xl font-bold p-6">Service Places</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                Locate essential services like laundromats, pharmacies, and repair shops. Find what you need, when you
                need it.
              </p>
              <div className="mt-4 flex justify-end">
                <span className="inline-flex items-center text-purple-500 font-medium group-hover:text-purple-600">
                  Explore Service Places
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Footer Section */}
      <footer className="mt-16 py-8 bg-gray-50 text-center text-gray-500">
        <p>© {new Date().getFullYear()} Carolinian Accommodation App. All rights reserved.</p>
      </footer>
    </main>
  )
}
