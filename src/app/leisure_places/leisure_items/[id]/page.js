import Link from "next/link"
import Image from "next/image"
import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"

const prisma = new PrismaClient()

export default async function LeisureItemDetailPage({ params }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const leisureItem = await prisma.leisureItem.findUnique({
    where: { id },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })

  if (!leisureItem) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/leisure-items" className="text-blue-500 hover:text-blue-700 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Leisure Places
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="h-64 bg-green-100 relative">
            {leisureItem.image ? (
              <Image
                src={`/api/leisure_items/image?id=${leisureItem.id}`}
                alt={leisureItem.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-green-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-24"
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
              </div>
            )}
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{leisureItem.name}</h1>

            {leisureItem.tags && leisureItem.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {leisureItem.tags.map((tagRelation) => (
                  <span key={tagRelation.tagId} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {tagRelation.tag.name}
                  </span>
                ))}
              </div>
            )}

            <div className="prose max-w-none mb-6">
              <p className="text-gray-700">{leisureItem.description}</p>
            </div>

            {leisureItem.openHours && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Opening Hours</h2>
                <p className="text-gray-700">{leisureItem.openHours}</p>
              </div>
            )}

            {leisureItem.directionLink && (
              <div className="mt-8">
                <a
                  href={leisureItem.directionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Get Directions
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
