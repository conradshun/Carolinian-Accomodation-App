"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function LeisurePlaces() {
  const [leisureData, setLeisureData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchTagTerm, setSearchTagTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [tagResults, setTagResults] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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

    fetchLeisureData()
  }, [])

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
      <h1 className="text-3xl font-bold mb-8 text-center">Leisure Places</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Name Search */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Search by Name</h2>
          <div className="flex">
            <input
              type="text"
              placeholder="Search for leisure activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-600 transition duration-200"
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
                    <Link href={`/leisure_places/leisure_items/${item.id}`} className="text-green-600 hover:underline">
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
              className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyPress={(e) => e.key === "Enter" && handleTagSearch()}
            />
            <button
              onClick={handleTagSearch}
              className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-600 transition duration-200"
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
                    <Link href={`/leisure_places/leisure_items/${item.id}`} className="text-green-600 hover:underline">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Leisure Item List */}
      <h2 className="text-2xl font-semibold mb-4">All Leisure Activities</h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : leisureData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leisureData.map((item) => (
            <LeisureItem key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No leisure activities found.</p>
      )}
    </div>
  )
}

function LeisureItem({ item }) {
  const [imageSrc, setImageSrc] = useState("")

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
      <Link href={`/leisure_places/leisure_items/${item.id}`}>
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

      <div className="p-4">
        <Link href={`/leisure_places/leisure_items/${item.id}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-green-500">{item.name}</h3>
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
                  className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                >
                  {tagRelation.tag?.name || "Unknown"}
                </span>
              ))}
            </div>
          </div>
        )}

        <Link
          href={`/leisure_places/leisure_items/${item.id}`}
          className="mt-4 inline-block text-green-500 hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  )
}
