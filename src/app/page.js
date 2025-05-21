"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Head from "next/head"

export default function HomePage() {
  const [foodCount, setFoodCount] = useState(0)
  const [leisureCount, setLeisureCount] = useState(0)
  const [serviceCount, setServiceCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Set the document title
    document.title = "Tultool"
    
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
    <div className="min-h-screen bg-[#f8f8f0] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-lime-400 opacity-30 animate-float blur-xl"></div>
      <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-gradient-to-tr from-green-600 to-lime-500 opacity-20 animate-float-delay blur-xl"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-lime-300 to-yellow-400 opacity-25 animate-float-slow blur-xl"></div>
      <div className="absolute bottom-40 right-1/3 w-16 h-16 rounded-full bg-gradient-to-l from-green-500 to-lime-600 opacity-20 animate-float blur-xl"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <header className="text-center mb-16 relative">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-lime-500 to-yellow-400 mb-4 animate-pulse-slow tracking-tight">
            Tultool
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto relative">
            Your ultimate campus companion! Discover, explore, and enjoy the best spots around USC with just a few taps.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Food Places Card */}
          <CategoryCard
            title="Food Places"
            count={foodCount}
            description="Satisfy your cravings with delicious local eats"
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
            isLoading={isLoading}
          />

          {/* Leisure Places Card */}
          <CategoryCard
            title="Leisure Places"
            count={leisureCount}
            description="Unwind and recharge at the best hangout spots"
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
            description="Find essential services to make campus life easier"
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            }
            isLoading={isLoading}
          />
        </div>

        <div className="mt-20 text-center relative">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-lime-500 mb-6">
            About Tultool
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Tultool is your go-to campus companion, designed to help students and visitors discover the best places around USC. 
            Whether you're craving a delicious meal, looking for a spot to relax between classes, or need to find essential services, 
            Tultool has got you covered. Explore, save your favorites, and make the most of your campus experience!
          </p>

          <div className="mt-12 flex justify-center space-x-4">
            <Link
              href="/food_places/food_items"
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-lime-500 rounded-full text-white font-medium shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 hover:from-green-500 hover:to-lime-400 flex items-center"
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

        {/* Copyright text */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2025 by Rafiq Esler, Enzo Basuil and Conrad Nestor Mativo</p>
        </div>
      </div>
    </div>
  )
}

function CategoryCard({ title, count, description, link, color, hoverColor, icon, isLoading }) {
  return (
    <Link href={link} className="group">
      <div
        className={`bg-gradient-to-br ${color} rounded-3xl shadow-xl p-8 h-full transition-all duration-500 transform group-hover:scale-105 group-hover:bg-gradient-to-br ${hoverColor} hover:shadow-2xl relative overflow-hidden group-hover:-rotate-1`}
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
            <div className="bg-green-900 text-yellow-300 font-bold rounded-full px-4 py-1 mb-4 group-hover:bg-green-800 transition-colors duration-300 transform group-hover:scale-110 shadow-lg">
              {count} {count === 1 ? "Place" : "Places"}
            </div>
          )}
          <p className="text-green-100 flex-grow">{description}</p>
          <div className="mt-6 bg-gradient-to-r from-yellow-400 to-yellow-300 text-green-900 font-semibold py-3 px-8 rounded-full hover:from-yellow-300 hover:to-yellow-200 transition-all duration-300 transform group-hover:scale-110 shadow-lg group-hover:shadow-xl">
            Explore Now
          </div>
        </div>
      </div>
    </Link>
  )
}
