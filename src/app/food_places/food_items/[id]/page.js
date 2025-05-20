"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

// Custom hook for favorites functionality
function useFavorites(type) {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    // Load favorites from localStorage on component mount
    const storedFavorites = localStorage.getItem(`${type}Favorites`)
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites))
      } catch (e) {
        console.error("Error parsing favorites:", e)
        setFavorites([])
      }
    }
  }, [type])

  const toggleFavorite = (id) => {
    const newFavorites = favorites.includes(id) ? favorites.filter((itemId) => itemId !== id) : [...favorites, id]

    setFavorites(newFavorites)
    localStorage.setItem(`${type}Favorites`, JSON.stringify(newFavorites))
  }

  const isFavorite = (id) => favorites.includes(id)

  return { favorites, toggleFavorite, isFavorite }
}

export default function FoodItemDetails() {
  const { id } = useParams()
  const [foodItem, setFoodItem] = useState(null)
  const [imageSrc, setImageSrc] = useState("")
  const [tags, setTags] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isFavorite, toggleFavorite } = useFavorites("food")

  useEffect(() => {
    if (id) {
      const fetchFoodItem = async () => {
        try {
          setIsLoading(true)
          const response = await fetch(`/api/food_items/${id}?includeTags=true`)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data = await response.json()
          setFoodItem(data)

          // Safely extract tags
          if (data.tags && Array.isArray(data.tags)) {
            // Handle both formats: direct tags array or nested tag objects
            const extractedTags = data.tags.map((tag) => (tag.tag ? tag.tag : tag)).filter((tag) => tag) // Filter out any null/undefined tags

            setTags(extractedTags)
          } else {
            setTags([])
          }

          setError(null)
        } catch (error) {
          console.error("Error fetching food item:", error)
          setError("Failed to load food item details. Please try again later.")
        } finally {
          setIsLoading(false)
        }
      }
      fetchFoodItem()
    }
  }, [id])

  useEffect(() => {
    if (foodItem && foodItem.image) {
      try {
        const byteArray = new Uint8Array(foodItem.image)
        let binary = ""
        const len = byteArray.byteLength
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(byteArray[i])
        }
        const base64String = btoa(binary)
        setImageSrc(`data:image/jpeg;base64,${base64String}`)
      } catch (error) {
        console.error("Error processing image:", error)
        setImageSrc("")
      }
    } else {
      setImageSrc("")
    }
  }, [foodItem])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-700 flex justify-center items-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-lime-300 border-t-yellow-300 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-lime-500 rounded-full animate-spin-slow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-300 font-medium">
            Loading
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-700">
        <div className="container mx-auto px-4 py-8">
          <div
            className="bg-gradient-to-r from-red-800 to-red-700 border border-red-600 text-red-100 px-6 py-4 rounded-xl shadow-lg"
            role="alert"
          >
            <div className="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-red-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <strong className="font-bold text-xl">Error</strong>
            </div>
            <span className="block sm:inline">{error}</span>
            <div className="mt-4 bg-red-900 bg-opacity-50 p-3 rounded-lg">
              <p className="text-red-200">Please try again or contact support if the problem persists.</p>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <Link
              href="/food_places/food_items"
              className="bg-gradient-to-r from-green-700 to-green-600 text-yellow-300 px-6 py-3 rounded-full hover:from-green-600 hover:to-green-500 transition duration-300 shadow-lg transform hover:-translate-y-1 hover:shadow-xl flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Food Places
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!foodItem) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-700">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center bg-gradient-to-r from-green-800 to-green-700 p-8 rounded-xl shadow-lg border border-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto mb-4 text-yellow-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-2xl text-green-100 mb-4">Food item not found.</p>
            <p className="text-green-200 mb-6">The item you're looking for may have been removed or doesn't exist.</p>
            <Link
              href="/food_places/food_items"
              className="bg-gradient-to-r from-green-700 to-green-600 text-yellow-300 px-6 py-3 rounded-full hover:from-green-600 hover:to-green-500 transition duration-300 shadow-lg inline-flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Food Places
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: imageSrc ? `url(${imageSrc})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay with blur effect */}
      <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-b from-green-900 via-green-800 to-green-700 bg-opacity-70"></div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-lime-400 opacity-20 animate-float"></div>
      <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-gradient-to-tr from-green-600 to-lime-500 opacity-15 animate-float-delay"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-lime-300 to-yellow-400 opacity-20 animate-float-slow"></div>

      <div className="relative container mx-auto px-4 py-8 z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <Link
              href="/"
              className="bg-gradient-to-r from-green-800 to-green-700 text-yellow-300 px-6 py-3 rounded-full hover:from-green-700 hover:to-green-600 transition duration-300 flex items-center shadow-lg transform hover:-translate-y-1 hover:shadow-xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Back to Home
            </Link>
            <Link
              href="/food_places/food_items"
              className="bg-gradient-to-r from-lime-600 to-lime-500 text-green-900 px-6 py-3 rounded-full hover:from-lime-500 hover:to-lime-400 transition duration-300 shadow-lg font-medium transform hover:-translate-y-1 hover:shadow-xl flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Food Places
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-800 to-green-700 rounded-xl shadow-xl overflow-hidden border border-green-600 transform transition-all duration-500 hover:shadow-2xl">
          <div className="md:flex">
            <div className="md:w-1/2 relative overflow-hidden group">
              {imageSrc ? (
                <img
                  className="w-full h-64 md:h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  src={imageSrc || "/placeholder.svg"}
                  alt={foodItem.name}
                />
              ) : (
                <div className="w-full h-64 md:h-full flex items-center justify-center bg-green-900">
                  <span className="text-green-400">No image available</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-green-900 to-transparent opacity-40"></div>
              <button
                onClick={() => toggleFavorite(Number.parseInt(id))}
                className="absolute top-4 right-4 p-3 bg-green-900 bg-opacity-80 rounded-full shadow-md hover:bg-opacity-100 transition-all transform hover:scale-110 hover:rotate-12 z-10"
                aria-label={isFavorite(Number.parseInt(id)) ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavorite(Number.parseInt(id)) ? (
                  <span className="text-yellow-300 text-2xl animate-pulse">♥</span>
                ) : (
                  <span className="text-green-100 text-2xl hover:text-yellow-300">♡</span>
                )}
              </button>
            </div>

            <div className="p-6 md:w-1/2 relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-300 opacity-5 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-lime-300 opacity-5 rounded-full"></div>

              <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-lime-300">
                {foodItem.name}
              </h1>

              {foodItem.description && (
                <div className="mb-6 bg-green-700 bg-opacity-50 p-4 rounded-lg border border-green-600 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <h2 className="text-lg font-semibold mb-2 text-lime-300 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Description
                  </h2>
                  <p className="text-green-100">{foodItem.description}</p>
                </div>
              )}

              {foodItem.openHours && (
                <div className="mb-6 bg-green-700 bg-opacity-50 p-4 rounded-lg border border-green-600 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <h2 className="text-lg font-semibold mb-2 text-lime-300 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Open Hours
                  </h2>
                  <p className="text-green-100">{foodItem.openHours}</p>
                </div>
              )}

              {foodItem.directionLink && (
                <div className="mb-6 bg-green-700 bg-opacity-50 p-4 rounded-lg border border-green-600 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <h2 className="text-lg font-semibold mb-2 text-lime-300 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Location
                  </h2>
                  <a
                    href={foodItem.directionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-300 hover:text-yellow-200 transition-colors duration-300 flex items-center group"
                  >
                    Get Directions
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1 group-hover:ml-2 transition-all duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              )}

              {/* Tags */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3 text-lime-300 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Tags
                </h2>
                {tags && tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag.id || Math.random()}
                        className="bg-gradient-to-r from-green-700 to-green-600 text-yellow-300 px-3 py-1 rounded-full text-sm border border-green-600 transform transition-transform hover:scale-105 hover:-rotate-2"
                      >
                        {tag.name || "Unknown"}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-green-300 bg-green-700 bg-opacity-50 p-3 rounded-lg border border-green-600">
                    No tags available
                  </p>
                )}
              </div>

              {/* Share button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: foodItem.name,
                        text: `Check out ${foodItem.name} on Carolinian Accommodation App!`,
                        url: window.location.href,
                      })
                    } else {
                      navigator.clipboard.writeText(window.location.href)
                      alert("Link copied to clipboard!")
                    }
                  }}
                  className="bg-gradient-to-r from-green-700 to-green-600 text-yellow-300 px-4 py-2 rounded-full hover:from-green-600 hover:to-green-500 transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative footer element */}
        <div className="mt-12 flex justify-center">
          <div className="w-32 h-1 bg-gradient-to-r from-green-600 via-lime-500 to-yellow-400 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
