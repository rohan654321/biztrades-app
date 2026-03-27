"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Users } from "lucide-react"
import { apiFetch } from "@/lib/api"

export interface Venue {
  id: string
  venueName: string
  venueCity: string
  venueCountry: string
  venueState?: string
  venueAddress?: string
}

export interface Event {
  id: string
  title: string
  leads: string
  bannerImage?: string
  logo?: string
  edition?: string
  categories?: string[]
  followers?: number
  startDate: string
  endDate?: string
  venueId?: string
  venue?: Venue
  location?: {
    city: string
    venue?: string
    country?: string
    address?: string
  }
  slug?: string
}

export default function EventReviews() {
  const [currentMonthEvents, setCurrentMonthEvents] = useState<Event[]>([])
  const [visitorCounts, setVisitorCounts] = useState<Record<string, number>>({})
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const isEventInCurrentMonth = (event: Event): boolean => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    const eventStartDate = new Date(event.startDate)
    const eventEndDate = event.endDate ? new Date(event.endDate) : eventStartDate
    
    // Check if event occurs during the current month
    return (
      (eventStartDate.getMonth() === currentMonth && eventStartDate.getFullYear() === currentYear) ||
      (eventEndDate.getMonth() === currentMonth && eventEndDate.getFullYear() === currentYear) ||
      (eventStartDate <= now && eventEndDate >= now)
    )
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await apiFetch<{ events?: Event[] }>("/api/events", { auth: false })
        if (data.events && Array.isArray(data.events)) {
          const eventsWithLocation = data.events.map((event: Event) => ({
            ...event,
            location: event.venue
              ? {
                  venue: event.venue.venueName,
                  city: event.venue.venueCity,
                  country: event.venue.venueCountry,
                  address: event.venue.venueAddress,
                }
              : undefined,
          }))
          
          // Filter events to only show current month events
          const currentMonthOnly = eventsWithLocation.filter(isEventInCurrentMonth)
          
          // Always show exactly 4 cards, duplicate if needed
          let limitedEvents = currentMonthOnly.slice(0, 4)
          
          // If we have less than 4 events in current month, pad with random events
          if (limitedEvents.length < 4 && eventsWithLocation.length > 0) {
            const needed = 4 - limitedEvents.length
            const randomEvents = eventsWithLocation
              .filter((e: Event) => !limitedEvents.some((le: Event) => le.id === e.id))
              .sort(() => 0.5 - Math.random())
              .slice(0, needed)
            limitedEvents = [...limitedEvents, ...randomEvents]
          }
          
          setCurrentMonthEvents(limitedEvents)
        }
      } catch (error) {
        console.error("Error fetching events:", error)
      }
    }
    fetchEvents()
  }, [])

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("visitorCounts") : null
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, number>
        setVisitorCounts(parsed)
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  // Auto-scroll functionality
  useEffect(() => {
    const startAutoScroll = () => {
      if (currentMonthEvents.length <= 1 || !isAutoScrolling) return
      
      autoScrollRef.current = setInterval(() => {
        setCurrentSlide((prevSlide) => {
          const nextSlide = (prevSlide + 1) % currentMonthEvents.length
          return nextSlide
        })
      }, 3000) // Change slide every 3 seconds
    }

    if (isAutoScrolling && currentMonthEvents.length > 1) {
      startAutoScroll()
    }

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current)
      }
    }
  }, [currentMonthEvents.length, isAutoScrolling])

  const handlePrevClick = () => {
    setIsAutoScrolling(false)
    setCurrentSlide((prevSlide) => {
      return prevSlide === 0 ? currentMonthEvents.length - 1 : prevSlide - 1
    })
    
    // Resume auto-scroll after 10 seconds
    setTimeout(() => setIsAutoScrolling(true), 10000)
  }

  const handleNextClick = () => {
    setIsAutoScrolling(false)
    setCurrentSlide((prevSlide) => {
      return (prevSlide + 1) % currentMonthEvents.length
    })
    
    // Resume auto-scroll after 10 seconds
    setTimeout(() => setIsAutoScrolling(true), 10000)
  }

  const handleVisitClick = (e: React.MouseEvent<HTMLButtonElement>, event: Event, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    const id = event.id || String(index)
    setVisitorCounts((prev) => {
      const next = { ...prev, [id]: (prev[id] || 0) + 1 }
      try {
        localStorage.setItem("visitorCounts", JSON.stringify(next))
      } catch {
        // ignore storage errors
      }
      return next
    })
    alert("Thank you for showing interest in this event!")
  }

  const handleCardClick = (event: Event) => {
    router.push(`/event/${event.id}`)
  }

  const formatFollowers = (num: number) => {
    return num.toLocaleString("en-US")
  }

  // Get events for the current slide
  const getEventsForCurrentSlide = (): Event[] => {
    if (currentMonthEvents.length === 0) return []
    
    // For now, just return the first 4 events
    // In a real implementation, you might want to show different sets
    return currentMonthEvents.slice(0, 4)
  }

return (
  <section className="max-w-7xl mx-auto px-4 py-6">

    {/* Container */}
    <div className="bg-white rounded-[6px] p-6">

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Trending Events
        </h2>
        <p className="text-sm text-gray-500">
          Explore the trending events happening in the country this week
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

        {currentMonthEvents.length > 0
          ? currentMonthEvents.slice(0, 3).map((event, index) => (
              <div
                key={event.id || index}
                onClick={() => handleCardClick(event)}
                className="bg-gray-100 rounded-[6px] p-2 cursor-pointer"
              >
                {/* Image */}
                <img
                  src={
                    event.bannerImage ||
                    event.logo ||
                    "/herosection-images/food.jpg"
                  }
                  alt={event.title}
                  className="w-full h-[140px] object-cover rounded-[4px]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/herosection-images/food.jpg"
                  }}
                />

                {/* Title */}
                <p className="text-sm font-medium text-gray-800 mt-2 line-clamp-2">
                  {event.title || "Event Title"}
                </p>
              </div>
            ))
          : // Skeleton (like your screenshot)
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[6px] p-2">
                <div className="w-full h-[140px] bg-gray-200 rounded-[4px]" />
              </div>
            ))}
      </div>

    </div>
  </section>
)
}