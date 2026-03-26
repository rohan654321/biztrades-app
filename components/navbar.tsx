"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(false)
  const [selected, setSelected] = useState("Products")
  const pathname = usePathname()

  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const langMenuRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false)
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(false)
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
        <div className="hidden lg:flex justify-center items-center gap-6">
       <Link
  href="/"
  className={`relative text-[28px] leading-none font-semibold px-4 py-0 ${
    !pathname.startsWith("/event")
      ? "text-red-600"
      : "text-gray-600 hover:text-red-600"
  }`}
>
  Online Sourcing
  {!pathname.startsWith("/event") && (
    <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-red-600"></span>
  )}
</Link>

<Link
  href="/event"
  className={`relative text-[28px] leading-none font-semibold px-4 py-0 ${
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

        {/* Third Row - Search Bar */}
        <div className="hidden lg:flex justify-center py-3 mt-1">
          <div className="w-full max-w-7xl">
            <div className="border-2 border-red-500 rounded p-1 bg-white">
              <div className="flex w-full bg-white h-11 items-center">
                {/* Dropdown */}
                <div className="relative h-full" ref={dropdownRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenDropdown(!openDropdown)
                    }}
                    className="flex items-center justify-between bg-gray-100 px-5 h-full text-sm font-medium text-gray-800 min-w-[140px] gap-2 hover:bg-gray-200 transition-colors"
                  >
                    {selected}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdown && (
                    <div className="absolute left-0 top-full mt-0 w-full min-w-[140px] bg-white shadow-lg rounded-md border border-gray-200 z-[9999] overflow-hidden">
                      {["Products", "Suppliers"].map((item) => (
                        <button
                          key={item}
                          onClick={() => {
                            setSelected(item)
                            setOpenDropdown(false)
                          }}
                          className="w-full px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Input */}
                <input
                  type="text"
                  placeholder="Search for products, suppliers..."
                  className="flex-1 h-full border-0 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
                />

                {/* Search Button */}
                <button
                  type="button"
                  className="bg-red-600 h-full px-14 text-sm font-semibold text-white hover:bg-red-700 transition-colors whitespace-nowrap"
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
              onClick={() => setMobileMenuOpen(false)}
            >
              Exhibitions
            </Link>
            <Link
              href="/organizer-signup"
              className="block px-4 py-1.5 text-sm font-semibold text-gray-800 hover:text-red-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Buyer Services
            </Link>
            <Link
              href="/venues"
              className="block px-4 py-1.5 text-sm font-semibold text-gray-800 hover:text-red-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Supplier Services
            </Link>
            <Link
              href="/about"
              className="block px-4 py-1.5 text-sm font-semibold text-gray-800 hover:text-red-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/login"
              className="block px-4 py-1.5 text-sm font-semibold text-gray-800 hover:text-red-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign in
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}