"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

export default function ServiceItemDetails() {
  const { id } = useParams()
  const [serviceItem, setServiceItem] = useState(null)
  const [imageSrc, setImageSrc] = useState("")
  const [tags, setTags] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      const fetchServiceItem = async () => {
        try {
          setIsLoading(true)
          const response = await fetch(`/api/service_items/${id}?includeTags=true`)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data = await response.json()
          setServiceItem(data)

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
          console.error("Error fetching service item:", error)
          setError("Failed to load service details. Please try again later.")
        } finally {
          setIsLoading(false)
        }
      }
      fetchServiceItem()
    }
  }, [id])

  useEffect(() => {
    if (serviceItem && serviceItem.image) {
      try {
        const byteArray = new Uint8Array(serviceItem.image)
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
  }, [serviceItem])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
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
          <Link href="/service_places/service_items" className="text-purple-500 hover:underline">
            ← Back to Services
          </Link>
        </div>
      </div>
    )
  }

  if (!serviceItem) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Service not found.</p>
        <div className="mt-4 text-center">
          <Link href="/service_places/service_items" className="text-purple-500 hover:underline">
            ← Back to Services
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/service_places/service_items" className="text-purple-500 hover:underline">
          ← Back to Services
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            {imageSrc ? (
              <img
                className="w-full h-64 md:h-full object-cover"
                src={imageSrc || "/placeholder.svg"}
                alt={serviceItem.name}
              />
            ) : (
              <div className="w-full h-64 md:h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          <div className="p-6 md:w-1/2">
            <h1 className="text-3xl font-bold mb-4">{serviceItem.name}</h1>

            {serviceItem.description && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-700">{serviceItem.description}</p>
              </div>
            )}

            {serviceItem.openHours && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Open Hours</h2>
                <p className="text-gray-700">{serviceItem.openHours}</p>
              </div>
            )}

            {serviceItem.directionLink && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Location</h2>
                <a
                  href={serviceItem.directionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-500 hover:underline"
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
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
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
