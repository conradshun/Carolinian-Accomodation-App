"use client"
import { useEffect, useState } from "react"
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

export default function ServicePlaces() {
  const [serviceData, setServiceData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchTagTerm, setSearchTagTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [tagResults, setTagResults] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  // Add a new state to track whether we're showing favorites
  const [showingFavorites, setShowingFavorites] = useState(() => {
    // Check localStorage for the saved state
    const saved = localStorage.getItem("serviceShowingFavorites")
    return saved ? JSON.parse(saved) : false
  })
  const { favorites, toggleFavorite, isFavorite } = useFavorites("service")

  const fetchServiceData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/service_items?includeTags=true`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setServiceData(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching service data:", error)
      setServiceData([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/service_items?includeTags=true`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()

        let processedData = Array.isArray(data) ? data : []

        // Filter by favorites if needed
        if (showingFavorites && favorites.length > 0) {
          processedData = processedData.filter((item) => favorites.includes(item.id))
        }

        setServiceData(processedData)
      } catch (error) {
        console.error("Error fetching service data:", error)
        setServiceData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [showingFavorites, favorites])

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/search?query=${searchTerm}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const results = await response.json()
      setSearchResults(results)
    } catch (error) {
      console.error("Error during search:", error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleTagSearch = async () => {
    if (!searchTagTerm.trim()) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/tagSearch?query=${searchTagTerm}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const results = await response.json()
      setTagResults(results)
    } catch (error) {
      console.error("Error during tag search:", error)
      setTagResults([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/"
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200 flex items-center"
        >
          <span className="mr-2">←</span> Back to Home
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">Service Places</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Name Search */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Search by Name</h2>
          <div className="flex">
            <input
              type="text"
              placeholder="Search for services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-purple-500 text-white px-4 py-2 rounded-r-lg hover:bg-purple-600 transition duration-200"
            >
              Search
            </button>
          </div>

          {/* Display search results */}
          {searchResults.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Search Results:</h3>
              <ul className="bg-gray-50 p-3 rounded-md">
                {searchResults.map((item) => (
                  <li key={item.id} className="mb-2">
                    <Link href={`/service_places/service_items/${item.id}`} className="text-purple-600 hover:underline">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Tag Search */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Search by Tags</h2>
          <div className="flex">
            <input
              type="text"
              placeholder="Search by tags..."
              value={searchTagTerm}
              onChange={(e) => setSearchTagTerm(e.target.value)}
              className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyPress={(e) => e.key === "Enter" && handleTagSearch()}
            />
            <button
              onClick={handleTagSearch}
              className="bg-purple-500 text-white px-4 py-2 rounded-r-lg hover:bg-purple-600 transition duration-200"
            >
              Search
            </button>
          </div>

          {/* Display tag search results */}
          {tagResults.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Tag Search Results:</h3>
              <ul className="bg-gray-50 p-3 rounded-md">
                {tagResults.map((item) => (
                  <li key={item.id} className="mb-2">
                    <Link href={`/service_places/service_items/${item.id}`} className="text-purple-600 hover:underline">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Favorites Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Favorites</h2>
          <button
            onClick={() => {
              // Toggle the showing favorites state
              const newState = !showingFavorites
              // Store the state in localStorage
              localStorage.setItem("serviceShowingFavorites", JSON.stringify(newState))
              // Refresh the page
              window.location.reload()
            }}
            className={`px-4 py-2 rounded-lg transition duration-200 flex items-center ${
              showingFavorites
                ? "bg-purple-500 text-white hover:bg-purple-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            disabled={favorites.length === 0}
          >
            <span className="mr-2">{showingFavorites ? "♥" : "♡"}</span>
            {showingFavorites ? "Showing Favorites" : "Show Favorites"}
          </button>
        </div>
        {favorites.length === 0 && <p className="text-gray-500 mt-2">You haven't added any favorites yet.</p>}
      </div>

      {/* Service Item List */}
      <h2 className="text-2xl font-semibold mb-4">All Services</h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : serviceData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceData.map((item) => (
            <ServiceItem key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No services found.</p>
      )}
    </div>
  )
}

function ServiceItem({ item }) {
  const [imageSrc, setImageSrc] = useState("")
  const { isFavorite, toggleFavorite } = useFavorites("service")

  useEffect(() => {
    if (item?.image) {
      try {
        const byteArray = new Uint8Array(item.image)
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
  }, [item?.image])

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className="relative">
        <Link href={`/service_places/service_items/${item.id}`}>
          <div className="h-48 bg-gray-200 relative">
            {imageSrc ? (
              <img className="w-full h-full object-cover" src={imageSrc || "/placeholder.svg"} alt={item.name} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleFavorite(item.id)
          }}
          className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full shadow-md hover:bg-opacity-100 transition-all"
          aria-label={isFavorite(item.id) ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite(item.id) ? (
            <span className="text-red-500 text-xl">♥</span>
          ) : (
            <span className="text-gray-400 text-xl hover:text-red-500">♡</span>
          )}
        </button>
      </div>

      <div className="p-4">
        <Link href={`/service_places/service_items/${item.id}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-purple-500">{item.name}</h3>
        </Link>

        {item.description && <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>}

        {item.openHours && (
          <p className="text-sm text-gray-500 mb-2">
            <span className="font-medium">Hours:</span> {item.openHours}
          </p>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tagRelation) => (
                <span
                  key={tagRelation.tag?.id || Math.random()}
                  className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded"
                >
                  {tagRelation.tag?.name || "Unknown"}
                </span>
              ))}
            </div>
          </div>
        )}

        <Link
          href={`/service_places/service_items/${item.id}`}
          className="mt-4 inline-block text-purple-500 hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  )
}
