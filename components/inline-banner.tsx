"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Banner {
  id: string
  page: string
  title: string
  dateRange?: string
  location?: string
  description?: string
  imageUrl: string
  link?: string
  buttonText?: string
  order: number
  isActive: boolean
}

interface InlineBannerProps {
  page: string
  maxBanners?: number
  dismissible?: boolean
  className?: string
  demoBanner?: Banner
}

export function InlineBanner({ 
  page, 
  maxBanners = 3, 
  dismissible = true, 
  className = "",
  demoBanner 
}: InlineBannerProps) {
  const [banners, setBanners] = useState<Banner[]>([])
  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // If demo banner is provided, use it directly
    if (demoBanner) {
      setBanners([demoBanner])
      setIsLoading(false)
      return
    }

    fetchBanners()
    // Load dismissed banners from localStorage
    const dismissed = localStorage.getItem(`dismissed-banners-${page}`)
    if (dismissed) {
      setDismissedBanners(new Set(JSON.parse(dismissed)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, demoBanner]) // Fixed dependency array - always the same size

  const fetchBanners = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/banners/${page}`)
      if (response.ok) {
        const data = await response.json()
        if (data && data.length > 0) {
          setBanners(data.slice(0, maxBanners))
        } else {
          // Use fallback demo data
          setBanners(getFallbackBanner())
        }
      } else {
        // Use fallback demo data
        setBanners(getFallbackBanner())
      }
    } catch (error) {
      console.error("Error fetching banners:", error)
      // Use fallback demo data
      setBanners(getFallbackBanner())
    } finally {
      setIsLoading(false)
    }
  }

  const getFallbackBanner = (): Banner[] => {
    return [{
      id: "1",
      page: "speakers",
      title: "Featured Speakers",
      description: "Meet industry experts and thought leaders",
      imageUrl: "https://s.globalsources.com/IMAGES/website/image/home/rfq_home@2x.jpg",
      link: "/speakers",
      buttonText: "Learn More",
      order: 1,
      isActive: true,
    }]
  }

  const handleBannerClick = async (banner: Banner) => {
    // Track click
    try {
      await fetch(`/api/banners/track/${banner.id}`, {
        method: "POST",
      })
    } catch (error) {
      console.error("Error tracking banner click:", error)
    }

    if (banner.link) {
      window.open(banner.link, "_blank")
    }
  }

  const dismissBanner = (bannerId: string) => {
    const newDismissed = new Set(dismissedBanners)
    newDismissed.add(bannerId)
    setDismissedBanners(newDismissed)
    localStorage.setItem(`dismissed-banners-${page}`, JSON.stringify(Array.from(newDismissed)))
  }

  const visibleBanners = banners.filter((banner) => !dismissedBanners.has(banner.id))

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="h-30 bg-gray-200 animate-pulse rounded-sm" />
      </div>
    )
  }

  if (visibleBanners.length === 0) {
    return null
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {visibleBanners.map((banner) => (
        <div
          key={banner.id}
          className="relative group overflow-hidden rounded-sm shadow-lg"
        >
          {/* Background Image */}
          <div className="relative h-30 w-full">
            <Image
              src={banner.imageUrl || "/placeholder.svg"}
              alt={banner.title}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/1200x200?text=Banner";
              }}
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center px-6 md:px-12">
              <div className="max-w-2xl">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {banner.title}
                </h2>
                {banner.description && (
                  <p className="text-white/80 text-sm mb-3">
                    {banner.description}
                  </p>
                )}
                {banner.link && (
                  <Link
                    href={banner.link}
                    className="inline-block bg-red-600 text-white px-5 py-2 rounded-md font-semibold text-sm hover:bg-red-700 transition-colors"
                  >
                    {banner.buttonText || "Learn More"}
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Dismiss Button */}
          {dismissible && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white z-10 rounded-full w-7 h-7"
              onClick={(e) => {
                e.stopPropagation()
                dismissBanner(banner.id)
              }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}