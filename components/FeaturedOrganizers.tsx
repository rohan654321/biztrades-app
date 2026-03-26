"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"

export default function FeaturedOrganizers() {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [organizers, setOrganizers] = useState<any[]>([])
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)

  const router = useRouter()

  useEffect(() => {
    async function fetchOrganizer() {
      try {
        const data = await apiFetch<any>("/api/organizers", { auth: false })
        setOrganizers(data.organizers || [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchOrganizer()
  }, [])

  // ✅ FIXED scroll detection
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const updateButtons = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container

      setShowLeft(scrollLeft > 5)
      setShowRight(scrollLeft + clientWidth < scrollWidth - 5)
    }

    // run after render
    const timeout = setTimeout(updateButtons, 100)

    container.addEventListener("scroll", updateButtons)
    window.addEventListener("resize", updateButtons)

    return () => {
      clearTimeout(timeout)
      container.removeEventListener("scroll", updateButtons)
      window.removeEventListener("resize", updateButtons)
    }
  }, [organizers])

  const scrollByAmount = (amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Featured Categories
        </h2>
        <p className="text-sm text-gray-500">
          The most in-demand categories among buyers.
        </p>
      </div>

      {/* Container */}
      <div
        className="relative bg-gray-100 rounded-[10px] px-6 py-6 group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >

        {/* LEFT BUTTON */}
        <button
          onClick={() => scrollByAmount(-280)}
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 
          bg-white rounded-full shadow-md p-2 transition duration-200
          ${
            isHovering && showLeft
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* RIGHT BUTTON */}
        <button
          onClick={() => scrollByAmount(280)}
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 
          bg-white rounded-full shadow-md p-2 transition duration-200
          ${
            isHovering && showRight
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        {/* Scroll Row */}
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scroll-smooth no-scrollbar items-center"
        >
          {organizers.map((org: any) => (
            <div
              key={org.id}
              onClick={() => router.push(`/organizer/${org.id}`)}
              className="flex flex-col items-center min-w-[100px] cursor-pointer"
            >
              {/* Circle */}
              <div className="w-[90px] h-[90px] bg-white rounded-full flex items-center justify-center shadow-sm">
                <img
                  src={org.image || "/placeholder.svg"}
                  alt={org.name}
                  className="w-12 h-12 object-contain"
                />
              </div>

              {/* Label */}
              <p className="text-sm text-gray-700 mt-3 text-center">
                {org.name}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}