"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"

export default function FeaturedSpeakers() {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [speakers, setSpeakers] = useState<any[]>([])
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)

  const router = useRouter()

  // 🔥 Fetch Speakers
  useEffect(() => {
    async function fetchSpeakers() {
      try {
        const data = await apiFetch<any>("/api/speakers", { auth: false })

        console.log("🔥 SPEAKERS:", data)

        setSpeakers(data.speakers || [])
      } catch (err) {
        console.error("❌ Error fetching speakers:", err)
      }
    }
    fetchSpeakers()
  }, [])

  // 🔥 Scroll Button Logic
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const updateButtons = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container

      setShowLeft(scrollLeft > 5)
      setShowRight(scrollLeft + clientWidth < scrollWidth - 5)
    }

    const timeout = setTimeout(updateButtons, 100)

    container.addEventListener("scroll", updateButtons)
    window.addEventListener("resize", updateButtons)

    return () => {
      clearTimeout(timeout)
      container.removeEventListener("scroll", updateButtons)
      window.removeEventListener("resize", updateButtons)
    }
  }, [speakers])

  const scrollByAmount = (amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Featured Speakers
        </h2>
        <p className="text-sm text-gray-500">
          Learn from industry experts and keynote speakers.
        </p>
      </div>

      {/* Container */}
      <div
        className="relative bg-white rounded-sm px-6 py-6 group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >

        {/* LEFT BUTTON */}
        <button
          onClick={() => scrollByAmount(-280)}
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 
          bg-white rounded-full shadow-md p-2 transition
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
          bg-white rounded-full shadow-md p-2 transition
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
          {speakers.map((spk: any) => {
            const name =
              `${spk.firstName || ""} ${spk.lastName || ""}`.trim() ||
              spk.name ||
              "Speaker"

            return (
              <div
                key={spk.id}
                onClick={() => router.push(`/speaker/${spk.id}`)}
                className="flex flex-col items-center min-w-[100px] cursor-pointer"
              >
                {/* Circle Image */}
                <div className="w-[90px] h-[90px] bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden">
                  <img
                    src={spk.avatar || spk.image || "/placeholder.svg"}
                    alt={name}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg"
                    }}
                  />
                </div>

                {/* Name */}
                <p className="text-sm text-gray-700 mt-3 text-center line-clamp-2">
                  {name}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}