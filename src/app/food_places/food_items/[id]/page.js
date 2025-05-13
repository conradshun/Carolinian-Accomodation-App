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
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <div className="mt-4">
          <Link href="/food_places/food_items" className="text-blue-500 hover:underline">
            ← Back to Food Places
          </Link>
        </div>
      </div>
    )
  }

  if (!foodItem) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Food item not found.</p>
        <div className="mt-4 text-center">
          <Link href="/food_places/food_items" className="text-blue-500 hover:underline">
            ← Back to Food Places
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <Link
            href="/"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200 flex items-center"
          >
            <span className="mr-2">←</span> Back to Home
          </Link>
          <Link
            href="/food_places/food_items"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            ← Back to Food Places
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 relative">
            {imageSrc ? (
              <img
                className="w-full h-64 md:h-full object-cover"
                src={imageSrc || "/placeholder.svg"}
                alt={foodItem.name}
              />
            ) : (
              <div className="w-full h-64 md:h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
            <button
              onClick={() => toggleFavorite(Number.parseInt(id))}
              className="absolute top-4 right-4 p-3 bg-white bg-opacity-80 rounded-full shadow-md hover:bg-opacity-100 transition-all"
              aria-label={isFavorite(Number.parseInt(id)) ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite(Number.parseInt(id)) ? (
                <span className="text-red-500 text-2xl">♥</span>
              ) : (
                <span className="text-gray-400 text-2xl hover:text-red-500">♡</span>
              )}
            </button>
          </div>

          <div className="p-6 md:w-1/2">
            <h1 className="text-3xl font-bold mb-4">{foodItem.name}</h1>

            {foodItem.description && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-700">{foodItem.description}</p>
              </div>
            )}

            {foodItem.openHours && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Open Hours</h2>
                <p className="text-gray-700">{foodItem.openHours}</p>
              </div>
            )}

            {foodItem.directionLink && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Location</h2>
                <a
                  href={foodItem.directionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Get Directions
                </a>
              </div>
            )}

            {/* Tags */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Tags</h2>
              {tags && tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag.id || Math.random()}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag.name || "Unknown"}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No tags available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
