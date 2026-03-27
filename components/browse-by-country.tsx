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

      // ✅ FILTER ONLY PUBLIC COUNTRIES
      const publicCountries =
        res?.data?.filter((c: any) => c.isPublic === true) || []

      setCountries(publicCountries)
    }

    load()
  }, [])

  const bgColors = [
    "bg-green-100",
    "bg-gray-200",
    "bg-red-100",
    "bg-blue-100",
    "bg-yellow-100",
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Outer Card Container (IMPORTANT FOR DESIGN) */}
      <div className="bg-gray-100 rounded-[4px] p-6">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Source by Region
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Facilitate world wholesale, retail and E-commerce businesses. Global sourcing is easy!
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries.map((country, index) => (
            <button
              key={country.id}
              onClick={() =>
                router.push(`/event?country=${country.name}`)
              }
              className={`
                flex items-center justify-center gap-4
                py-6 px-6
                rounded-lg
                ${bgColors[index % bgColors.length]}
                hover:scale-[1.02] transition-all duration-200
              `}
            >
              {/* Flag */}
              <img
                src={country.flag || "/placeholder.svg"}
                alt={country.name}
                className="w-8 h-5 object-cover rounded-sm"
              />

              {/* Name */}
              <span className="text-base font-medium text-gray-900">
                {country.name}
              </span>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}