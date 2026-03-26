"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"

export default function BrowseByCountry() {
  const router = useRouter()
  const [countries, setCountries] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const res = await apiFetch("/api/location/countries", { auth: false })
      setCountries(res?.data || [])
    }
    load()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Source by Region
        </h2>
        <p className="text-sm text-gray-500">
          Facilitate world wholesale, retail and E-commerce businesses. Global sourcing is easy!
        </p>
      </div>

      {/* Grid Container - 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map((country, index) => {
          const bgColors = [
            "bg-green-50",
            "bg-gray-100",
            "bg-red-50",
            "bg-blue-50",
            "bg-yellow-50",
          ]

          return (
            <button
              key={country.id}
              onClick={() => router.push(`/event?country=${country.name}`)}
              className={`flex items-center justify-center gap-3 px-6 py-6 
              ${bgColors[index % bgColors.length]} 
              rounded-[6px] hover:shadow-sm transition w-full`}
            >
              <img
                src={country.flag || "/placeholder.svg"}
                alt={country.name}
                className="w-8 h-5 object-cover rounded-[2px]"
              />

              <span className="text-base font-medium text-gray-800">
                {country.name}
              </span>
            </button>
          )
        })}
      </div>

    </div>
  )
}