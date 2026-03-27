"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { apiFetch } from "@/lib/api"

interface Category {
  id: string
  name: string
  icon: string | null
  color: string
  eventCount: number
}

const FALLBACK_IMAGE = "/herosection-images/food.jpg"

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setIsLoading(true)

      const data = await apiFetch<{ success?: boolean; categories?: Category[] }>(
        "/api/events/categories/browse",
        { auth: false }
      )

      if (data.success !== false && Array.isArray(data.categories)) {
        // ✅ GET 6 CATEGORIES
        setCategories(data.categories.slice(0, 6))
      } else {
        setCategories([])
      }
    } catch (e) {
      console.error("Error fetching categories:", e)
      setError(e instanceof Error ? e.message : "Failed to load categories")
      setCategories([])
    } finally {
      setIsLoading(false)
    }
  }

  // 🔄 LOADING UI
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white animate-pulse rounded-xl h-24" />
          ))}
        </div>
      </div>
    )
  }

  // ❌ ERROR UI
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-red-500">
        {error}
      </div>
    )
  }

  // ❌ EMPTY UI
  if (categories.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500">
        No categories available.
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Browse Categories
        </h2>

        <Link
          href="/event"
          className="text-red-600 text-sm font-semibold hover:text-red-700"
        >
          View All
        </Link>
      </div>

      {/* OUTER CONTAINER */}
      <div className="bg-white rounded-sm p-6">

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/event?category=${encodeURIComponent(category.name)}`}
              className="group block"
            >
              {/* CARD */}
              <div className="bg-[#f1f7fb] rounded-sm px-5 py-4 flex items-center justify-between hover:bg-gray-300 transition-all duration-200 hover:scale-[1.02]">

                {/* TEXT */}
                <h3 className="text-base font-semibold text-gray-800">
                  {category.name}
                </h3>

                {/* IMAGE */}
                <div className="w-20 h-16 flex-shrink-0">
                  {category.icon ? (
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={FALLBACK_IMAGE}
                      alt="fallback"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

              </div>
            </Link>
          ))}

        </div>
      </div>
    </div>
  )
}