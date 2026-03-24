"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Search, User, MapPin, Mic, Calendar, Menu, X } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated, getCurrentUserId, getCurrentUserRole, getCurrentUserDisplayName, getCurrentUserEmail, clearTokens } from "@/lib/api"

interface SearchEvent {
  id: string
  title: string
  slug: string
  category: string
  startDate: string
  venue?: {
    venueCity: string
    venueCountry: string
  }
  isFeatured: boolean
  isVIP: boolean
  type: string
}

interface SearchVenue {
  id: string
  venueName: string
  venueAddress: string
  venueCity: string
  venueState: string
  venueCountry: string
  maxCapacity: number
  amenities: string[]
  averageRating: number
  type: string
  displayName: string
  location: string
}

interface SearchSpeaker {
  id: string
  firstName: string
  lastName: string
  company: string
  jobTitle: string
  specialties: string[]
  averageRating: number
  totalEvents: number
  type: string
  displayName: string
  expertise: string[]
}

interface SearchResults {
  events: SearchEvent[]
  venues: SearchVenue[]
  speakers: SearchSpeaker[]
  allResults: any[]
}

export default function Navbar() {
  const [exploreOpen, setExploreOpen] = useState(false)
  const [country, setCountry] = useState("IND")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResults>({
    events: [],
    venues: [],
    speakers: [],
    allResults: []
  })
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'events' | 'venues' | 'speakers'>('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const searchRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const toggleExplore = () => setExploreOpen((prev) => !prev)

  const authenticated = isAuthenticated()
  const userId = getCurrentUserId()
  const role = getCurrentUserRole()
  const displayName = getCurrentUserDisplayName()
  const userEmail = getCurrentUserEmail()
  const [showMenu, setShowMenu] = useState(false)

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Search function
  const handleSearchInput = (value: string) => {
    setSearchQuery(value)

    const query = value.trim()

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Cancel previous request
    if (abortRef.current) {
      abortRef.current.abort()
    }

    if (query.length < 2) {
      setSearchResults({
        events: [],
        venues: [],
        speakers: [],
        allResults: []
      })
      setShowSearchResults(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      abortRef.current = new AbortController()
      setIsSearching(true)

      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&limit=5`,
          { signal: abortRef.current.signal }
        )

        if (!res.ok) return

        const data = await res.json()
        setSearchResults(data)
        setShowSearchResults(true)
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Search error:", err)
        }
      } finally {
        setIsSearching(false)
      }
    }, 500) // 🔥 debounce delay
  }

  // Navigation handlers
  const handleEventClick = (eventId: string) => {
    router.push(`/event/${eventId}`)
    setShowSearchResults(false)
    setSearchQuery("")
    setMobileMenuOpen(false)
    setShowMobileSearch(false)
  }

  const handleVenueClick = (venueId: string) => {
    router.push(`/venue/${venueId}`)
    setShowSearchResults(false)
    setSearchQuery("")
    setMobileMenuOpen(false)
    setShowMobileSearch(false)
  }

  const handleSpeakerClick = (speakerId: string) => {
    router.push(`/speakers/${speakerId}`)
    setShowSearchResults(false)
    setSearchQuery("")
    setMobileMenuOpen(false)
    setShowMobileSearch(false)
  }

  // UPDATED: Navigate to existing pages with search query
  const handleViewAllResults = (type: string = 'all') => {
    switch (type) {
      case 'events':
        router.push(`/event?search=${encodeURIComponent(searchQuery)}`)
        break
      case 'venues':
        router.push(`/venues?search=${encodeURIComponent(searchQuery)}`)
        break
      case 'speakers':
        router.push(`/speakers?search=${encodeURIComponent(searchQuery)}`)
        break
      default:
        router.push(`/event?search=${encodeURIComponent(searchQuery)}`)
        break
    }
    setShowSearchResults(false)
    setSearchQuery("")
    setMobileMenuOpen(false)
    setShowMobileSearch(false)
  }

  const handleAddevent = async () => {
    if (!authenticated) {
      router.push("/organizer-signup")
      setMobileMenuOpen(false)
      return
    }

    const roleForAdd = role

    if ((role || "").toUpperCase() === "ORGANIZER") {
      router.push(`/organizer-dashboard/${userId}`)
      setMobileMenuOpen(false)
      return
    }

    if (role === "superadmin") {
      router.push("/admin-dashboard")
      setMobileMenuOpen(false)
      return
    }

    const confirmed = window.confirm(
      `You are logged in as '${roleForAdd}'.\n\nPlease login as an organizer to access this page.\n\nClick OK to logout and login as an organizer, or Cancel to stay logged in.`,
    )

    if (confirmed) {
      clearTokens()
      router.push("/organizer-signup")
      setMobileMenuOpen(false)
    }
  }

  const handleDashboard = () => {
    const roleUpper = (role || "").toUpperCase()
    if (roleUpper === "ORGANIZER") {
      router.push(`/organizer-dashboard/${userId}`)
    } else if (roleUpper === "SUPER_ADMIN" || roleUpper === "SUB_ADMIN") {
      router.push("/admin-dashboard")
    } else if (roleUpper === "ATTENDEE") {
      router.push(`/dashboard/${userId}`)
    } else {
      router.push("/login")
    }
    setMobileMenuOpen(false)
  }

  const handleClick = () => {
    setShowMenu(!showMenu)
  }

  const handleLogin = () => {
    signIn(undefined, { callbackUrl: "/" })
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    clearTokens()
    router.push("/login")
    setMobileMenuOpen(false)
  }

  // Helper function to render search results
  const renderSearchResults = () => {
    const resultsToShow = activeTab === 'all'
      ? searchResults.allResults
      : activeTab === 'events'
        ? searchResults.events
        : activeTab === 'venues'
          ? searchResults.venues
          : searchResults.speakers

    if (isSearching) {
      return <div className="p-4 text-center text-gray-500">Searching...</div>
    }

    if (resultsToShow.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          No {activeTab === 'all' ? 'results' : activeTab} found. Try different keywords.
        </div>
      )
    }

    return (
      <div className="max-h-96 overflow-y-auto">
        {resultsToShow.map((result: any) => (
          <div
            key={`${result.type}-${result.id}`}
            className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            onClick={() => {
              if (result.type === 'event' || result.resultType === 'event') {
                handleEventClick(result.id)
              } else if (result.type === 'venue' || result.resultType === 'venue') {
                handleVenueClick(result.id)
              } else if (result.type === 'speaker' || result.resultType === 'speaker') {
                handleSpeakerClick(result.id)
              }
            }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {result.type === 'event' || result.resultType === 'event' ? (
                  <Calendar className="w-4 h-4 text-blue-600" />
                ) : result.type === 'venue' || result.resultType === 'venue' ? (
                  <MapPin className="w-4 h-4 text-green-600" />
                ) : (
                  <Mic className="w-4 h-4 text-purple-600" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {result.title || result.displayName || result.venueName || `${result.firstName} ${result.lastName}`}
                </h4>

                {(result.type === 'event' || result.resultType === 'event') && (
                  <>
                    <p className="text-sm text-gray-600 mt-1">
                      {result.venue?.venueCity && result.venue?.venueCountry
                        ? `${result.venue.venueCity}, ${result.venue.venueCountry}`
                        : 'Online Event'
                      }
                    </p>
                    <div className="flex items-center mt-1 space-x-2">
                      {result.isVIP && (
                        <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                          VIP
                        </span>
                      )}
                      {result.isFeatured && (
                        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          Featured
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(result.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </>
                )}

                {(result.type === 'venue' || result.resultType === 'venue') && (
                  <>
                    <p className="text-sm text-gray-600 mt-1">{result.location}</p>
                    <div className="flex items-center mt-1 space-x-2">
                      {result.maxCapacity && (
                        <span className="text-xs text-gray-500">
                          Capacity: {result.maxCapacity.toLocaleString()}
                        </span>
                      )}
                      {result.averageRating > 0 && (
                        <span className="text-xs text-gray-500">
                          ⭐ {result.averageRating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </>
                )}

                {(result.type === 'speaker' || result.resultType === 'speaker') && (
                  <p className="text-sm text-gray-600 mt-1">
                    Speaker
                  </p>
                )}

              </div>

              <div className="flex-shrink-0">
                <span className={`inline-block px-2 py-1 text-xs rounded capitalize ${result.type === 'event' || result.resultType === 'event'
                  ? 'bg-blue-100 text-blue-800'
                  : result.type === 'venue' || result.resultType === 'venue'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-purple-100 text-purple-800'
                  }`}>
                  {result.type || result.resultType}
                </span>
              </div>
            </div>
          </div>
        ))}

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => handleViewAllResults(activeTab)}
            className="w-full text-center text-sm font-medium text-red-600 hover:text-red-700"
          >
            View all {activeTab === 'all' ? 'events' : activeTab} →
          </button>
        </div>
      </div>
    )
  }

  const runSearchSubmit = () => {
    const q = searchQuery.trim()
    if (q.length < 2) return
    handleViewAllResults(activeTab === "all" ? "events" : activeTab)
  }

  const isExhibitionsTabActive = pathname === "/event" || pathname.startsWith("/event/")
  const isOrganizersTabActive = pathname === "/organizer-signup" || pathname.startsWith("/organizer-dashboard")
  const isVenuesTabActive = pathname === "/venues" || pathname.startsWith("/venues/")

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop utility row */}
        <div className="hidden items-center justify-end gap-3 border-b border-gray-100 py-1 text-xs text-gray-600 lg:flex">
          <p onClick={handleAddevent} className="cursor-pointer transition-colors hover:text-gray-900">
            Add Event
          </p>
          <span className="h-3 w-px bg-gray-300" aria-hidden />
          <span className="text-gray-500">EN</span>
          <span className="h-3 w-px bg-gray-300" aria-hidden />
          {authenticated ? (
            <div className="relative inline-block text-left">
              <button
                type="button"
                onClick={handleClick}
                className="flex items-center gap-1 text-gray-700 transition-colors hover:text-gray-900"
              >
                <User className="h-4 w-4" />
                <span className="max-w-[140px] truncate">{displayName || "Account"}</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </button>
              {showMenu && (
                <div className="absolute right-0 z-50 mt-2 w-52 rounded-lg border border-gray-200 bg-white shadow-lg">
                  <div className="border-b px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{displayName}</p>
                    <p className="text-xs text-gray-500">{userEmail}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDashboard}
                    className="block w-full border-b px-4 py-3 text-left text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-3 text-left text-red-600 transition-colors hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button type="button" onClick={handleLogin} className="text-gray-700 transition-colors hover:text-red-600">
              Login / Sign Up
            </button>
          )}
        </div>

        {/* Desktop: logo + primary tabs */}
        <div className="hidden items-end justify-between gap-6 pb-2.5 pt-3 lg:flex">
          <div className="flex min-w-0 flex-1 items-end gap-10">
            <Link href="/" className="inline-block shrink-0">
              <Image
                src="/logo/bizlogo.png"
                alt="BizTradeFairs.com"
                width={360}
                height={168}
                priority
                className="h-auto max-h-[5rem] w-auto sm:max-h-24 lg:max-h-28"
              />
            </Link>
            <div className="flex items-end gap-8">
              <Link
                href="/event"
                className={`pb-1 text-lg font-bold tracking-tight transition-colors ${
                  isExhibitionsTabActive
                    ? "border-b-2 border-red-600 text-red-600"
                    : "border-b-2 border-transparent text-gray-800 hover:text-red-600"
                }`}
              >
                Exhibitions
              </Link>
              <Link
                href="/organizer-signup"
                className={`pb-1 text-lg font-bold tracking-tight transition-colors ${
                  isOrganizersTabActive
                    ? "border-b-2 border-red-600 text-red-600"
                    : "border-b-2 border-transparent text-gray-800 hover:text-red-600"
                }`}
              >
                Organizers
              </Link>
              <Link
                href="/venues"
                className={`pb-1 text-lg font-bold tracking-tight transition-colors ${
                  isVenuesTabActive
                    ? "border-b-2 border-red-600 text-red-600"
                    : "border-b-2 border-transparent text-gray-800 hover:text-red-600"
                }`}
              >
                Venues
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop: full-width search */}
        <div className="relative hidden pb-2 lg:block" ref={searchRef}>
          <div className="rounded-md border-2 border-red-600 bg-white p-1 shadow-sm">
            <div className="flex w-full overflow-hidden rounded-sm bg-white">
            <div className="relative flex shrink-0 items-center border-r border-gray-200 bg-gray-100">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as typeof activeTab)}
                className="h-9 cursor-pointer appearance-none bg-transparent py-1.5 pl-3 pr-9 text-sm font-medium text-gray-700 focus:outline-none"
                aria-label="Search scope"
              >
                <option value="all">All</option>
                <option value="events">Events</option>
                <option value="venues">Venues</option>
                <option value="speakers">Speakers</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search events, venues, speakers..."
              className="min-w-0 flex-1 border-0 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
              onKeyDown={(e) => e.key === "Enter" && runSearchSubmit()}
            />
            <button
              type="button"
              onClick={runSearchSubmit}
              className="shrink-0 rounded-none bg-red-600 px-10 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              Search
            </button>
            </div>
          </div>
          {showSearchResults && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-md border border-gray-200 bg-white shadow-lg">
              <div className="flex border-b border-gray-200">
                {(["all", "events", "venues", "speakers"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-2 text-sm font-medium capitalize ${
                      activeTab === tab
                        ? "border-b-2 border-red-600 text-red-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}{" "}
                    {tab !== "all" && `(${searchResults[tab as keyof SearchResults]?.length || 0})`}
                  </button>
                ))}
              </div>
              {renderSearchResults()}
            </div>
          )}
        </div>

        {/* Mobile header */}
        <div className="flex h-12 items-center justify-between py-0.5 sm:h-14 lg:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link href="/" className="inline-block">
              <Image
                src="/logo/bizlogo.png"
                alt="BizTradeFairs.com"
                width={300}
                height={140}
                priority
                className="h-auto max-h-8 w-auto sm:max-h-10"
              />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="rounded-full p-2 text-gray-700 hover:bg-gray-100"
            >
              <Search className="h-5 w-5" />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={handleClick}
                className="rounded-full bg-red-600 p-2 text-white hover:bg-red-700"
              >
                <User className="h-5 w-5" />
              </button>
              {showMenu && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                  {authenticated ? (
                    <>
                      <div className="border-b px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{displayName}</p>
                        <p className="text-xs text-gray-500">{userEmail}</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleDashboard}
                        className="block w-full border-b px-4 py-3 text-left text-gray-700 hover:bg-gray-50"
                      >
                        Dashboard
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full px-4 py-3 text-left text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleLogin}
                      className="block w-full px-4 py-3 text-left text-red-600 hover:bg-red-50"
                    >
                      Login / Sign Up
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        {showMobileSearch && (
          <div className="relative pb-2 lg:hidden">
            <div className="flex w-full overflow-hidden rounded-md border-2 border-red-600 bg-white shadow-sm">
              <div className="relative flex shrink-0 items-center border-r border-gray-200 bg-gray-100">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value as typeof activeTab)}
                  className="h-9 max-w-[5.5rem] cursor-pointer appearance-none bg-transparent py-1.5 pl-2 pr-7 text-xs font-medium text-gray-700 focus:outline-none sm:max-w-none sm:pl-3 sm:pr-9 sm:text-sm"
                  aria-label="Search scope"
                >
                  <option value="all">All</option>
                  <option value="events">Events</option>
                  <option value="venues">Venues</option>
                  <option value="speakers">Speakers</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500 sm:right-2 sm:h-4 sm:w-4" />
              </div>
              <input
                type="text"
                placeholder="Search events, venues, speakers..."
                className="min-w-0 flex-1 border-0 bg-white px-2 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:px-3"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                onKeyDown={(e) => e.key === "Enter" && runSearchSubmit()}
              />
              <button
                type="button"
                onClick={runSearchSubmit}
                className="shrink-0 bg-red-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-red-700 sm:px-6 sm:text-sm"
              >
                Search
              </button>
            </div>

            {showSearchResults && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
                <div className="flex border-b border-gray-200">
                  {(["all", "events", "venues", "speakers"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-2 py-2 text-xs font-medium capitalize sm:px-4 sm:py-3 sm:text-sm ${
                        activeTab === tab
                          ? "border-b-2 border-red-600 text-red-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab}{" "}
                      {tab !== "all" && `(${searchResults[tab as keyof SearchResults]?.length || 0})`}
                    </button>
                  ))}
                </div>
                {renderSearchResults()}
              </div>
            )}
          </div>
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-200" ref={mobileMenuRef}>
            <div className="flex flex-col space-y-1 pt-4">
              <Link href="/event">
                <p
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Exhibitions
                </p>
              </Link>
              <Link href="/organizer-signup">
                <p
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Organizers
                </p>
              </Link>
              <Link href="/venues">
                <p
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Venues
                </p>
              </Link>
              <p
                onClick={handleAddevent}
                className="px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Add Event
              </p>

              {/* Auth section in mobile menu */}
              <div className="px-4 py-3 border-t border-gray-200">
                {authenticated ? (
                  <>
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-900">{displayName}</p>
                      <p className="text-xs text-gray-500">{userEmail}</p>
                    </div>
                    <button
                      onClick={handleDashboard}
                      className="w-full text-left px-4 py-3 mb-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="w-full rounded-lg bg-red-50 px-4 py-3 text-left text-red-600 transition-colors hover:bg-red-100"
                  >
                    Login / Sign Up
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}