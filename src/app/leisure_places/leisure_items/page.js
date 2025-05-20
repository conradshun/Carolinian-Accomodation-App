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

export default function LeisurePlaces() {
  const [leisureData, setLeisureData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchTagTerm, setSearchTagTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [tagResults, setTagResults] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { favorites, toggleFavorite, isFavorite } = useFavorites("leisure")
  // Add a new state to track whether we're showing favorites
  const [showingFavorites, setShowingFavorites] = useState(() => {
    // Check localStorage for the saved state
    const saved = localStorage.getItem("leisureShowingFavorites")
    return saved ? JSON.parse(saved) : false
  })

  const fetchLeisureData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/leisure_items?includeTags=true`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setLeisureData(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching leisure data:", error)
      setLeisureData([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/leisure_items?includeTags=true`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()

        let processedData = Array.isArray(data) ? data : []

        // Filter by favorites if needed
        if (showingFavorites && favorites.length > 0) {
          processedData = processedData.filter((item) => favorites.includes(item.id))
        }

        setLeisureData(processedData)
      } catch (error) {
        console.error("Error fetching leisure data:", error)
        setLeisureData([])
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
    <div className="min-h-screen bg-gradient-to-b from-green-800 via-lime-700 to-lime-600 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-lime-400 opacity-20 animate-float"></div>
      <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-gradient-to-tr from-green-600 to-lime-500 opacity-15 animate-float-delay"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-lime-300 to-yellow-400 opacity-20 animate-float-slow"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/"
            className="bg-gradient-to-r from-green-700 to-green-600 text-yellow-300 px-6 py-3 rounded-full hover:from-green-600 hover:to-green-500 transition duration-300 flex items-center shadow-lg transform hover:-translate-y-1 hover:shadow-xl"
          >
            <span className="mr-2">←</span> Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-lime-300 to-yellow-300 relative">
          Leisure Places
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-green-600 via-lime-500 to-yellow-400 rounded-full"></div>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Name Search */}
          <div className="bg-gradient-to-br from-green-700 to-lime-600 p-6 rounded-xl shadow-lg border border-lime-500 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <h2 className="text-xl font-semibold mb-4 text-yellow-300 flex items-center">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search by Name
            </h2>
            <div className="flex">
              <input
                type="text"
                placeholder="Search for leisure activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow px-4 py-3 rounded-l-full focus:outline-none focus:ring-2 focus:ring-lime-500 bg-green-50 border-2 border-lime-500"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-lime-500 to-lime-400 text-green-900 px-6 py-3 rounded-r-full hover:from-lime-400 hover:to-lime-300 transition duration-300 font-medium transform hover:scale-105"
              >
                Search
              </button>
            </div>

            {/* Display search results */}
            {searchResults.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2 text-green-100 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Search Results:
                </h3>
                <ul className="bg-green-600 bg-opacity-50 p-4 rounded-lg border border-lime-500">
                  {searchResults.map((item) => (
                    <li key={item.id} className="mb-2 transform transition-transform hover:translate-x-1">
                      <Link
                        href={`/leisure_places/leisure_items/${item.id}`}
                        className="text-yellow-300 hover:underline flex items-center"
                      >
                        <span className="mr-2">•</span> {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Tag Search */}
          <div className="bg-gradient-to-br from-green-700 to-lime-600 p-6 rounded-xl shadow-lg border border-lime-500 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <h2 className="text-xl font-semibold mb-4 text-yellow-300 flex items-center">
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
              Search by Tags
            </h2>
            <div className="flex">
              <input
                type="text"
                placeholder="Search by tags..."
                value={searchTagTerm}
                onChange={(e) => setSearchTagTerm(e.target.value)}
                className="flex-grow px-4 py-3 rounded-l-full focus:outline-none focus:ring-2 focus:ring-lime-500 bg-green-50 border-2 border-lime-500"
                onKeyPress={(e) => e.key === "Enter" && handleTagSearch()}
              />
              <button
                onClick={handleTagSearch}
                className="bg-gradient-to-r from-lime-500 to-lime-400 text-green-900 px-6 py-3 rounded-r-full hover:from-lime-400 hover:to-lime-300 transition duration-300 font-medium transform hover:scale-105"
              >
                Search
              </button>
            </div>

            {/* Display tag search results */}
            {tagResults.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2 text-green-100 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Tag Search Results:
                </h3>
                <ul className="bg-green-600 bg-opacity-50 p-4 rounded-lg border border-lime-500">
                  {tagResults.map((item) => (
                    <li key={item.id} className="mb-2 transform transition-transform hover:translate-x-1">
                      <Link
                        href={`/leisure_places/leisure_items/${item.id}`}
                        className="text-yellow-300 hover:underline flex items-center"
                      >
                        <span className="mr-2">•</span> {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Favorites Filter */}
        <div className="bg-gradient-to-r from-green-700 to-lime-600 p-6 rounded-xl shadow-lg mb-8 border border-lime-500 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-yellow-300 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-yellow-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Your Favorites
            </h2>
            <button
              onClick={() => {
                // Toggle the showing favorites state
                const newState = !showingFavorites
                // Store the state in localStorage
                localStorage.setItem("leisureShowingFavorites", JSON.stringify(newState))
                // Refresh the page
                window.location.reload()
              }}
              className={`px-6 py-3 rounded-full transition duration-300 flex items-center transform hover:scale-105 ${
                showingFavorites
                  ? "bg-gradient-to-r from-lime-500 to-lime-400 text-green-900 hover:from-lime-400 hover:to-lime-300 shadow-md hover:shadow-lg"
                  : "bg-gradient-to-r from-green-600 to-green-500 text-green-100 hover:from-green-500 hover:to-green-400 shadow-md hover:shadow-lg"
              }`}
              disabled={favorites.length === 0}
            >
              <span className={`mr-2 text-xl ${showingFavorites ? "animate-pulse" : ""}`}>
                {showingFavorites ? "♥" : "♡"}
              </span>
              {showingFavorites ? "Showing Favorites" : "Show Favorites"}
            </button>
          </div>
          {favorites.length === 0 && (
            <div className="text-green-100 mt-4 bg-green-600 bg-opacity-50 p-4 rounded-lg border border-lime-500 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-yellow-300"
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
              You haven't added any favorites yet. Click the heart icon on any leisure place to add it to your
              favorites!
            </div>
          )}
        </div>

        {/* Leisure Item List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-lime-300 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 mr-2 text-yellow-300"
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
            All Leisure Activities
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-lime-300 border-t-yellow-300 rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-lime-500 rounded-full animate-spin-slow"></div>
              </div>
            </div>
          ) : leisureData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leisureData.map((item) => (
                <LeisureItem key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center text-green-100 bg-gradient-to-r from-green-700 to-lime-600 p-8 rounded-xl shadow-lg border border-lime-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto mb-4 text-yellow-300"
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
              <p className="text-xl">No leisure activities found.</p>
              <p className="mt-2 text-green-200">Try a different search or check back later!</p>
            </div>
          )}
        </div>

        {/* Decorative footer element */}
        <div className="mt-12 flex justify-center">
          <div className="w-32 h-1 bg-gradient-to-r from-green-600 via-lime-500 to-yellow-400 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

function LeisureItem({ item }) {
  const [imageSrc, setImageSrc] = useState("")
  const { isFavorite, toggleFavorite } = useFavorites("leisure")

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
    <div className="bg-gradient-to-br from-green-700 to-lime-600 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 border border-lime-500 transform hover:-translate-y-2 hover:scale-102 group card-hover">
      <div className="relative">
        <Link href={`/leisure_places/leisure_items/${item.id}`}>
          <div className="h-48 bg-green-800 relative overflow-hidden group-hover:h-52 transition-all duration-500">
            {imageSrc ? (
              <img
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                src={imageSrc || "/placeholder.svg"}
                alt={item.name}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-green-800">
                <span className="text-green-400">No image available</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-green-800 to-transparent opacity-60"></div>
          </div>
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleFavorite(item.id)
          }}
          className="absolute top-3 right-3 p-3 bg-green-800 bg-opacity-80 rounded-full shadow-md hover:bg-opacity-100 transition-all transform hover:scale-110 hover:rotate-12 z-10"
          aria-label={isFavorite(item.id) ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite(item.id) ? (
            <span className="text-yellow-300 text-xl animate-pulse">♥</span>
          ) : (
            <span className="text-green-100 text-xl hover:text-yellow-300">♡</span>
          )}
        </button>
      </div>

      <div className="p-5 relative">
        {/* Decorative elements */}
        <div className="absolute -top-1 right-0 w-12 h-12 bg-yellow-300 opacity-5 rounded-full transform group-hover:scale-150 transition-transform duration-700"></div>

        <Link href={`/leisure_places/leisure_items/${item.id}`}>
          <h3 className="text-xl font-semibold mb-2 text-lime-300 group-hover:text-yellow-300 transition-colors duration-300">
            {item.name}
          </h3>
        </Link>

        {item.description && <p className="text-green-100 mb-3 line-clamp-2">{item.description}</p>}

        {item.openHours && (
          <p className="text-sm text-green-200 mb-3 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 text-lime-400"
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
            <span className="font-medium text-lime-400">Hours:</span> {item.openHours}
          </p>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tagRelation) => (
                <span
                  key={tagRelation.tag?.id || Math.random()}
                  className="bg-gradient-to-r from-green-600 to-green-500 text-yellow-300 text-xs px-3 py-1 rounded-full border border-green-500 transform transition-transform hover:scale-105"
                >
                  {tagRelation.tag?.name || "Unknown"}
                </span>
              ))}
            </div>
          </div>
        )}

        <Link
          href={`/leisure_places/leisure_items/${item.id}`}
          className="mt-4 inline-block text-yellow-300 hover:text-yellow-200 transition-colors duration-300 group-hover:translate-x-1 transform transition-transform flex items-center"
        >
          View Details
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1 group-hover:ml-2 transition-all duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
