"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const pathname = usePathname()

  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const langMenuRef = useRef<HTMLButtonElement>(null)

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const isExhibitionsTabActive = pathname === "/event" || pathname.startsWith("/event/")
  const isOrganizersTabActive = pathname === "/organizer-signup" || pathname.startsWith("/organizer-dashboard")
  const isVenuesTabActive = pathname === "/venues" || pathname.startsWith("/venues/")

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation - First Row */}
        <div className="hidden items-center justify-between lg:flex">
          {/* Logo */}
          <Link href="/" className="block flex-shrink-0">
            <Image
              src="/logo/bizlogo.png"
              alt="Global Sources"
              width={110}
              height={20}
              className="h-auto w-auto"
            />
          </Link>

          {/* Navigation Tabs - CENTERED */}
          <div className="flex items-center gap-6">
            <Link
              href="/event"
              className={`text-sm font-semibold transition-colors ${
                isExhibitionsTabActive
                  ? "text-red-600"
                  : "text-gray-800 hover:text-red-600"
              }`}
            >
              Exhibitions
            </Link>

            <Link
              href="/organizer-signup"
              className={`text-sm font-semibold transition-colors ${
                isOrganizersTabActive
                  ? "text-red-600"
                  : "text-gray-800 hover:text-red-600"
              }`}
            >
              Buyer Services
            </Link>

            <Link
              href="/venues"
              className={`text-sm font-semibold transition-colors ${
                isVenuesTabActive
                  ? "text-red-600"
                  : "text-gray-800 hover:text-red-600"
              }`}
            >
              Supplier Services
            </Link>

            <Link
              href="/about"
              className="text-sm font-semibold text-gray-800 hover:text-red-600 transition-colors"
            >
              About Us
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            <button className="relative flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors">
              <span>EN</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            <Link
              href="/login"
              className="text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Second Row - Centered Tabs (NO BORDER) */}
        <div className="hidden lg:flex justify-center items-center gap-6 ">
          <Link
            href="/"
            className={`relative text-sm font-semibold ${
              !pathname.startsWith("/event")
                ? "text-red-600"
                : "text-gray-600 hover:text-red-600"
            }`}
          >
            Online Sourcing
            {!pathname.startsWith("/event") && (
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-red-600"></span>
            )}
          </Link>

          <Link
            href="/event"
            className={`relative text-sm font-semibold ${
              pathname.startsWith("/event")
                ? "text-red-600"
                : "text-gray-600 hover:text-red-600"
            }`}
          >
            Exhibitions
            {pathname.startsWith("/event") && (
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-red-600"></span>
            )}
          </Link>
        </div>

        {/* Third Row - Search Bar (REDUCED WIDTH) */}
        <div className="hidden lg:flex justify-center py-1 mt-2">
          <div className="w-full max-w-7xl">
            <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
              <div className="flex w-full bg-white h-9 items-center">
                {/* Dropdown */}
                <div className="relative flex shrink-0 items-center bg-white px-2.5">
                  <select
                    className="h-full cursor-pointer appearance-none bg-transparent pr-5 text-xs font-medium text-gray-700 focus:outline-none"
                    aria-label="Search scope"
                  >
                    <option value="all">Products</option>
                    <option value="events">Suppliers</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-500" />
                </div>

                {/* Divider */}
                <div className="h-5 w-px bg-gray-300"></div>

                {/* Input */}
                <input
                  type="text"
                  placeholder="hdmi"
                  className="flex-1 h-full border-0 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />

                {/* Search Button */}
                <button
                  type="button"
                  className="bg-red-600 h-full px-5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile header */}
        <div className="flex h-11 items-center justify-between lg:hidden">
          <Link href="/" className="block flex-shrink-0">
            <Image
              src="/logo/bizlogo.png"
              alt="Global Sources"
              width={100}
              height={32}
              className="h-auto w-auto"
            />
          </Link>

          <div className="flex items-center gap-3">
            <button className="text-sm font-semibold text-gray-700">EN</button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div ref={mobileMenuRef} className="lg:hidden border-t border-gray-200 py-2 space-y-1">
            <Link
              href="/event"
              className="block px-4 py-1.5 text-sm font-semibold text-gray-800 hover:text-red-600"
            >
              Exhibitions
            </Link>
            <Link
              href="/organizer-signup"
              className="block px-4 py-1.5 text-sm font-semibold text-gray-800 hover:text-red-600"
            >
              Buyer Services
            </Link>
            <Link
              href="/venues"
              className="block px-4 py-1.5 text-sm font-semibold text-gray-800 hover:text-red-600"
            >
              Supplier Services
            </Link>
            <Link
              href="/about"
              className="block px-4 py-1.5 text-sm font-semibold text-gray-800 hover:text-red-600"
            >
              About Us
            </Link>
            <Link
              href="/login"
              className="block px-4 py-1.5 text-sm font-semibold text-gray-800 hover:text-red-600"
            >
              Sign in
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}