import type React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  FaInstagramSquare,
  FaTwitterSquare,
  FaYoutubeSquare,
  FaFacebookSquare,
  FaLinkedin,
} from "react-icons/fa"
import { MessageCircle } from "lucide-react"

const linkClass =
  "text-sm text-gray-600 transition-colors duration-200 hover:text-red-600"

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 bg-white px-4 py-12 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Five link columns */}
        <div className="mb-10 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5 lg:gap-10">
          <div>
            <h4 className="mb-4 text-sm font-bold text-gray-900">Services</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/event" className={linkClass}>
                  Find Events
                </Link>
              </li>
              <li>
                <Link href="/venues" className={linkClass}>
                  Book Venues
                </Link>
              </li>
              <li>
                <Link href="/organizers" className={linkClass}>
                  Event Organizers
                </Link>
              </li>
              <li>
                <Link href="/speakers" className={linkClass}>
                  Find Speakers
                </Link>
              </li>
              <li>
                <Link href="/exhibitors" className={linkClass}>
                  Exhibitor Services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold text-gray-900">Company</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about-us" className={linkClass}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className={linkClass}>
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className={linkClass}>
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/organizer-program" className={linkClass}>
                  Become Organizer
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold text-gray-900">Event Categories</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/event?category=Education" className={linkClass}>
                  Education Training
                </Link>
              </li>
              <li>
                <Link href="/event?category=Medical" className={linkClass}>
                  Medical & Pharma
                </Link>
              </li>
              <li>
                <Link href="/event?category=Technology" className={linkClass}>
                  IT & Technology
                </Link>
              </li>
              <li>
                <Link href="/event?category=Finance" className={linkClass}>
                  Banking & Finance
                </Link>
              </li>
              <li>
                <Link href="/event?category=Business" className={linkClass}>
                  Business Services
                </Link>
              </li>
              <li>
                <Link href="/event?category=Industrial%20Engineering" className={linkClass}>
                  Industrial Engineering
                </Link>
              </li>
              <li>
                <Link href="/event?category=Building%20%26%20Construction" className={linkClass}>
                  Building & Construction
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold text-gray-900">Help & Support</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/faq" className={linkClass}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className={linkClass}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/support" className={linkClass}>
                  Support Center
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className={linkClass}>
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold text-gray-900">More Info</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/terms-conditions" className={linkClass}>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className={linkClass}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className={linkClass}>
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200" />

        {/* Follow us + chat */}
        <div className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold text-gray-900">Follow us on</p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://www.facebook.com/biztradefair/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-white transition-colors hover:bg-gray-800"
              >
                <FaFacebookSquare className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/biztradefairs/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-white transition-colors hover:bg-gray-800"
              >
                <FaInstagramSquare className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/biztradefair"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-white transition-colors hover:bg-gray-800"
              >
                <FaTwitterSquare className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/biztradefairs/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-white transition-colors hover:bg-gray-800"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex w-full max-w-xs items-center gap-3 rounded-lg bg-gray-800 px-4 py-3 text-left text-white shadow-md transition-colors hover:bg-gray-900 sm:w-auto"
          >
            <MessageCircle className="h-5 w-5 shrink-0" />
            <div>
              <div className="text-sm font-semibold">Chat with Us</div>
              <div className="text-xs text-white/80">Got questions? Just ask.</div>
            </div>
          </button>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="mb-6">
             <Link href="/" className="inline-block shrink-0 self-start sm:self-end">
              <Image
                src="/logo/logo.png"
                alt="BZ Trade Fairs Logo"
                width={150}
                height={60}
                className="object-contain"
              />
            </Link>
          
          </div>

          <div className="mb-8">
            <p className="text-xs leading-relaxed text-gray-500">
              ** All event names, logos, and brands are property of their respective owners. All company, event and
              service names used in this website are for identification purposes only. Use of these names, logos, and
              brands does not imply endorsement.
            </p>
          </div>

          <div className="flex flex-col gap-6 border-t border-gray-200 pt-8 ">
              <h5 className="mb-2 text-sm font-bold text-gray-900">Registered Office:</h5>
            <p className="text-sm leading-relaxed text-gray-600">
              Maxx Business Media Pvt Ltd | # T9, 3rd Floor, Swastik Manandi Arcade, SC Road, Seshadripuram,
              Bengaluru – 560020, India, Support-+91-9148319993 | CIN: U74999KA2019PTC123194
            </p>
            <p className="text-sm text-gray-600">Copyright © 2025 Maxx Business Media Pvt Ltd All rights reserved</p>
           
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
