"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Search, Menu, X } from "lucide-react"
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
        {/* Desktop Navigation */}
        <div className="hidden items-center justify-between lg:flex py-4">
          {/* LEFT: Logo + Nav */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="block flex-shrink-0">
              <Image
                src="/logo/bizlogo.png"
                alt="Global Sources Logo"
                width={120}
                height={40}
              />
            </Link>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-8">
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
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6">
            <button className="relative flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors">
              <span>EN</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            <Link
              href="/login"
              className="text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors"
            >
              Sign in / Register
            </Link>
          </div>
        </div>

        {/* Centered Tabs Section */}
        <div className="hidden lg:flex justify-center items-center gap-10 py-2 border-b border-gray-100">
          {/* Online Sourcing */}
          <Link
            href="/"
            className={`relative text-sm font-semibold pb-2 ${
              !pathname.startsWith("/event")
                ? "text-red-600"
                : "text-gray-800 hover:text-red-600"
            }`}
          >
            Online Sourcing
            {!pathname.startsWith("/event") && (
              <span className="absolute left-0 bottom-0 w-full h-[3px] bg-red-600"></span>
            )}
          </Link>

          {/* Exhibitions */}
          <Link
            href="/event"
            className={`relative text-sm font-semibold pb-2 ${
              pathname.startsWith("/event")
                ? "text-red-600"
                : "text-gray-800 hover:text-red-600"
            }`}
          >
            Exhibitions
            {pathname.startsWith("/event") && (
              <span className="absolute left-0 bottom-0 w-full h-[3px] bg-red-600"></span>
            )}
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden lg:flex py-3 justify-center">
          <div className="w-full max-w-7xl">
            <div className="rounded-lg border-2 border-red-600 overflow-hidden shadow-sm">
              <div className="flex w-full bg-white h-14 items-center px-2">
                {/* Dropdown */}
                <div className="relative flex shrink-0 items-center border-r border-gray-200 bg-gray-50">
                  <select
                    className="h-full cursor-pointer appearance-none bg-transparent pl-4 pr-9 text-sm font-medium text-gray-700 focus:outline-none"
                    aria-label="Search scope"
                  >
                    <option value="all">Products</option>
                    <option value="events">Suppliers</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>

                {/* Input */}
                <input
                  type="text"
                  placeholder="earbuds"
                  className="flex-1 h-full border-0 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-600 focus:outline-none"
                />

                {/* Search Button */}
<button
  type="button"
  className="bg-red-600 mx-2 my-2 px-14 h-[calc(100%-8px)] text-sm font-semibold text-white flex items-center justify-center rounded-md hover:bg-red-700"
>
  Search
</button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile header */}
        <div className="flex h-14 items-center justify-between lg:hidden">
          <Link href="/" className="block flex-shrink-0">
            <div className="text-xl font-bold">
              <span className="text-gray-800">global</span>
              <span className="text-red-600">sources</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <button
              ref={langMenuRef}
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 text-sm font-semibold text-gray-700"
            >
              <span>EN</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div ref={mobileMenuRef} className="lg:hidden border-t border-gray-200 py-4 space-y-4">
            <Link
              href="/event"
              className="block px-4 py-2 text-sm font-semibold text-gray-800 hover:text-red-600"
            >
              Exhibitions
            </Link>
            <Link
              href="/organizer-signup"
              className="block px-4 py-2 text-sm font-semibold text-gray-800 hover:text-red-600"
            >
              Buyer Services
            </Link>
            <Link
              href="/venues"
              className="block px-4 py-2 text-sm font-semibold text-gray-800 hover:text-red-600"
            >
              Supplier Services
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-sm font-semibold text-gray-800 hover:text-red-600"
            >
              About Us
            </Link>
            <Link
              href="/login"
              className="block px-4 py-2 text-sm font-semibold text-gray-800 hover:text-red-600"
            >
              Sign in / Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
