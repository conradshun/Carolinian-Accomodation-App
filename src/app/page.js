"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function HomePage() {
  const [foodCount, setFoodCount] = useState(0)
  const [leisureCount, setLeisureCount] = useState(0)
  const [serviceCount, setServiceCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setIsLoading(true)

        // Fetch food items count
        const foodResponse = await fetch("/api/food_items")
        if (foodResponse.ok) {
          const foodData = await foodResponse.json()
          setFoodCount(Array.isArray(foodData) ? foodData.length : 0)
        }

        // Fetch leisure items count
        const leisureResponse = await fetch("/api/leisure_items")
        if (leisureResponse.ok) {
          const leisureData = await leisureResponse.json()
          setLeisureCount(Array.isArray(leisureData) ? leisureData.length : 0)
        }

        // Fetch service items count
        const serviceResponse = await fetch("/api/service_items")
        if (serviceResponse.ok) {
          const serviceData = await serviceResponse.json()
          setServiceCount(Array.isArray(serviceData) ? serviceData.length : 0)
        }
      } catch (error) {
        console.error("Error fetching counts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCounts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-700 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-lime-400 opacity-30 animate-float"></div>
      <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-gradient-to-tr from-green-600 to-lime-500 opacity-20 animate-float-delay"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-lime-300 to-yellow-400 opacity-25 animate-float-slow"></div>
      <div className="absolute bottom-40 right-1/3 w-16 h-16 rounded-full bg-gradient-to-l from-green-500 to-lime-600 opacity-20 animate-float"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <header className="text-center mb-16 relative">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-40 h-2 bg-gradient-to-r from-green-600 via-lime-500 to-yellow-400 rounded-full opacity-70"></div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-lime-300 to-yellow-300 mb-4 animate-pulse-slow">
            Carolinian Accommodation App
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto relative">
            Discover the best places to eat, relax, and get services around the campus
            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-lime-500 to-yellow-400 rounded-full"></span>
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Food Places Card */}
          <CategoryCard
            title="Food Places"
            count={foodCount}
            description="Discover delicious dining options and eateries"
            link="/food_places/food_items"
            color="from-green-800 via-green-700 to-green-600"
            hoverColor="from-green-700 via-green-600 to-green-500"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-yellow-300 group-hover:scale-110 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            }
            isLoading={isLoading}
          />

          {/* Leisure Places Card */}
          <CategoryCard
            title="Leisure Places"
            count={leisureCount}
            description="Find places to relax and enjoy your free time"
            link="/leisure_places/leisure_items"
            color="from-green-700 via-lime-600 to-lime-500"
            hoverColor="from-green-600 via-lime-500 to-lime-400"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-yellow-300 group-hover:scale-110 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            }
            isLoading={isLoading}
          />

          {/* Service Places Card */}
          <CategoryCard
            title="Service Places"
            count={serviceCount}
            description="Access essential services and amenities"
            link="/service_places/service_items"
            color="from-lime-600 via-lime-500 to-yellow-500"
            hoverColor="from-lime-500 via-lime-400 to-yellow-400"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-green-900 group-hover:scale-110 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            }
            isLoading={isLoading}
          />
        </div>

        <div className="mt-20 text-center relative">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-green-600 via-lime-500 to-yellow-400 rounded-full"></div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-lime-300 mb-6">
            About This App
          </h2>
          <p className="text-green-100 max-w-3xl mx-auto">
            The Carolinian Accommodation App helps students and visitors find the best places around campus. Whether
            you're looking for a place to eat, relax, or access services, we've got you covered. Browse through our
            curated list of locations, save your favorites, and find exactly what you need.
          </p>

          <div className="mt-12 flex justify-center space-x-4">
            <Link
              href="/food_places/food_items"
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-lime-500 rounded-full text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-green-500 hover:to-lime-400 flex items-center"
            >
              <span>Start Exploring</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2 animate-bounce-x"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Decorative footer element */}
        <div className="mt-16 flex justify-center">
          <div className="w-32 h-1 bg-gradient-to-r from-green-600 via-lime-500 to-yellow-400 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

function CategoryCard({ title, count, description, link, color, hoverColor, icon, isLoading }) {
  return (
    <Link href={link} className="group">
      <div
        className={`bg-gradient-to-br ${color} rounded-xl shadow-xl p-6 h-full transition-all duration-500 transform group-hover:scale-105 group-hover:bg-gradient-to-br ${hoverColor} hover:shadow-2xl relative overflow-hidden group-hover:-rotate-1`}
      >
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-300 opacity-10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-lime-300 opacity-10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>

        <div className="flex flex-col items-center text-center h-full relative z-10">
          <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
            {icon}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors duration-300">
            {title}
          </h2>
          {isLoading ? (
            <div className="w-16 h-6 bg-green-800 animate-pulse rounded-full mb-4"></div>
          ) : (
            <div className="bg-green-900 text-yellow-300 font-bold rounded-full px-4 py-1 mb-4 group-hover:bg-green-800 transition-colors duration-300 transform group-hover:scale-110">
              {count} {count === 1 ? "Place" : "Places"}
            </div>
          )}
          <p className="text-green-100 flex-grow">{description}</p>
          <div className="mt-6 bg-gradient-to-r from-yellow-400 to-yellow-300 text-green-900 font-semibold py-2 px-6 rounded-full hover:from-yellow-300 hover:to-yellow-200 transition-all duration-300 transform group-hover:scale-110 shadow-md group-hover:shadow-lg">
            Explore
          </div>
        </div>
      </div>
    </Link>
  )
}
