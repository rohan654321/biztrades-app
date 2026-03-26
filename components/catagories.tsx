"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { apiFetch } from "@/lib/api"

interface Category {
  id: string
  name: string
  icon: string | null
  color: string
  eventCount: number
  imageUrl?: string
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
        setCategories(data.categories.slice(0, 3))
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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Browse Categories</h2>
          <div className="w-20 h-8 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <p>Error loading categories: {error}</p>
        </div>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500">
          <p>No categories available.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with View All */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Browse Categories</h2>
        <Link
          href="/event"
          className="text-red-600 text-sm font-semibold hover:text-red-700 transition-colors"
        >
          View All
        </Link>
      </div>

      {/* 3 Categories in One Row - Each with its own border */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/event?category=${encodeURIComponent(category.name)}`}
            className="group block"
          >
            <div className="bg-white rounded-sm border border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between p-5">
                {/* Text on LEFT */}
                <div>
                  <h3 className="text-base font-semibold text-gray-800">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {category.eventCount} {category.eventCount === 1 ? 'Event' : 'Events'}
                  </p>
                </div>
                
                {/* Image on RIGHT */}
                <div className="relative w-14 h-14 flex-shrink-0">
                  {category.icon ? (
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xl text-gray-400">📦</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}