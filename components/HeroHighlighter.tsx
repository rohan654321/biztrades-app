"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { apiFetch } from "@/lib/api"

const FALLBACK_IMAGE = "/herosection-images/food.jpg"
const FEATURED_EVENTS_LIMIT = 4

/** Per–VIP-event visuals (cycles by index): tabs, hero overlay, Register CTA — inspired by multi-show references. */
type VipEventVisualTheme = {
  tabActiveClass: string
  overlayCss: string
  registerClass: string
}

const VIP_EVENT_THEMES: VipEventVisualTheme[] = [
  {
    tabActiveClass:
      "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md z-10 ring-1 ring-black/5",
    overlayCss:
      "linear-gradient(to right, rgba(61, 31, 92, 0.96) 0%, rgba(91, 33, 125, 0.85) 38%, rgba(124, 58, 237, 0.45) 62%, rgba(124, 58, 237, 0.12) 78%, transparent 100%)",
    registerClass: "bg-gradient-to-r from-rose-500 to-orange-500 hover:opacity-95",
  },
  {
    tabActiveClass:
      "bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 text-white shadow-md z-10 ring-1 ring-black/5",
    overlayCss:
      "linear-gradient(125deg, rgba(180, 60, 20, 0.95) 0%, rgba(234, 88, 12, 0.82) 32%, rgba(251, 191, 36, 0.5) 58%, rgba(253, 224, 71, 0.15) 80%, transparent 100%)",
    registerClass: "bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 hover:opacity-95",
  },
  {
    tabActiveClass:
      "bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-md z-10 ring-1 ring-black/5",
    overlayCss:
      "linear-gradient(155deg, rgba(0, 80, 80, 0.94) 0%, rgba(0, 55, 55, 0.9) 40%, rgba(0, 30, 30, 0.55) 68%, transparent 100%)",
    registerClass: "bg-gradient-to-r from-yellow-400 to-amber-600 text-gray-900 hover:opacity-95",
  },
  {
    tabActiveClass:
      "bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 text-white shadow-md z-10 ring-1 ring-black/5",
    overlayCss:
      "linear-gradient(to right, rgba(30, 64, 175, 0.94) 0%, rgba(67, 56, 202, 0.82) 38%, rgba(109, 40, 217, 0.45) 65%, transparent 100%)",
    registerClass: "bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:opacity-95",
  },
  {
    tabActiveClass:
      "bg-gradient-to-r from-emerald-700 to-teal-600 text-white shadow-md z-10 ring-1 ring-black/5",
    overlayCss:
      "linear-gradient(to right, rgba(4, 80, 60, 0.93) 0%, rgba(13, 116, 110, 0.8) 42%, rgba(20, 184, 166, 0.35) 70%, transparent 100%)",
    registerClass: "bg-gradient-to-r from-cyan-500 to-teal-600 hover:opacity-95",
  },
]

function getVipTheme(index: number): VipEventVisualTheme {
  return VIP_EVENT_THEMES[((index % VIP_EVENT_THEMES.length) + VIP_EVENT_THEMES.length) % VIP_EVENT_THEMES.length]
}

/** Normalized item from GET /api/events/featured (proxies Express). */
type FeaturedListEvent = {
  id: string
  title: string
  startDate: string
  endDate: string
  bannerImage: string | null
  venue: {
    venueName?: string | null
    venueCity?: string | null
    venueCountry?: string | null
  } | null
}

function parseFeaturedEventsPayload(data: unknown): FeaturedListEvent[] {
  if (data == null) return []
  const raw = Array.isArray(data)
    ? data
    : typeof data === "object" && data !== null && "events" in data && Array.isArray((data as { events: unknown }).events)
      ? (data as { events: unknown[] }).events
      : []
  const out: FeaturedListEvent[] = []
  for (const item of raw) {
    if (!item || typeof item !== "object" || !("id" in item)) continue
    const o = item as Record<string, unknown>
    const id = o.id != null ? String(o.id) : ""
    if (!id) continue
    const images = o.images
    let firstImg: string | null = null
    if (Array.isArray(images) && images.length > 0) {
      const el = images[0]
      if (typeof el === "string") firstImg = el
      else if (el && typeof el === "object" && "url" in el && typeof (el as { url: unknown }).url === "string") {
        firstImg = (el as { url: string }).url
      }
    }
    out.push({
      id,
      title: typeof o.title === "string" ? o.title : "Event",
      startDate: typeof o.startDate === "string" ? o.startDate : "",
      endDate: typeof o.endDate === "string" ? o.endDate : typeof o.startDate === "string" ? o.startDate : "",
      bannerImage: typeof o.bannerImage === "string" ? o.bannerImage : firstImg,
      venue: o.venue && typeof o.venue === "object" ? (o.venue as FeaturedListEvent["venue"]) : null,
    })
  }
  return out
}

function formatFeaturedEventDates(startIso: string, endIso: string): string {
  const start = new Date(startIso)
  const end = new Date(endIso || startIso)
  if (Number.isNaN(start.getTime())) return ""
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  return start.toDateString() === end.toDateString() ? fmt(start) : `${fmt(start)} – ${fmt(end)}`
}

function FeaturedEventCard({ event }: { event: FeaturedListEvent }) {
  const href = `/event/${encodeURIComponent(event.id)}`
  const img = event.bannerImage || FALLBACK_IMAGE
  const dates = formatFeaturedEventDates(event.startDate, event.endDate)
  const v = event.venue
  const loc = v ? [v.venueCity, v.venueCountry].filter(Boolean).join(", ") : ""

  return (
    <Link
      href={href}
      className="group flex h-[208px] flex-col overflow-hidden rounded-xl border border-white/25 bg-white/95 shadow-md transition hover:bg-white hover:shadow-lg sm:h-[224px] lg:h-[212px]"
    >
      <div className="relative h-[112px] w-full shrink-0 bg-gray-200 sm:h-[120px] lg:h-[112px]">
        <img
          src={img}
          alt=""
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-0.5 p-2">
        <h4 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900">{event.title}</h4>
        {dates ? <p className="text-xs text-gray-600">{dates}</p> : null}
        {loc ? <p className="line-clamp-1 text-xs text-gray-500">{loc}</p> : null}
      </div>
    </Link>
  )
}

/** Text-only rows tuned for ~8 visible categories before hover-scroll. */
const CATEGORY_LIST_MAX_H = "max-h-[20rem] sm:max-h-[20rem] lg:max-h-[20rem]"

  const categoryScrollAreaClass =
  "min-h-0 min-w-0 divide-y divide-gray-100 overflow-y-hidden hover:overflow-y-auto overscroll-y-contain rounded-xl border border-gray-200/90 bg-gray-50/40 " +
  CATEGORY_LIST_MAX_H +
  " px-0 py-0 [scrollbar-gutter:stable] [scrollbar-width:none] hover:[scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:rgb(203,213,225)_transparent] " +
  "[&::-webkit-scrollbar]:w-0 hover:[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent " +
  "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300/55 [&::-webkit-scrollbar-thumb]:hover:bg-gray-300/70"

type BrowseCategory = {
  id: string
  name: string
  icon: string | null
  color: string
  eventCount: number
}

/** Shape returned by GET /api/events/vip and list endpoints (transformed event). */
type VipEvent = {
  id: string
  title: string
  slug?: string | null
  startDate: string
  endDate: string
  shortDescription?: string | null
  bannerImage?: string | null
  images?: string[] | null
  category?: string[]
  tags?: string[]
  venue?: {
    venueName?: string | null
    venueCity?: string | null
    venueCountry?: string | null
  } | null
  city?: string
  country?: string
}

function parseVipEventsPayload(data: unknown): VipEvent[] {
  if (!data) return []
  if (Array.isArray(data)) return data as VipEvent[]
  if (typeof data === "object" && data !== null && "events" in data) {
    const ev = (data as { events?: unknown }).events
    return Array.isArray(ev) ? (ev as VipEvent[]) : []
  }
  return []
}

function formatTabLabel(e: VipEvent): string {
  const start = new Date(e.startDate)
  const end = new Date(e.endDate)
  const monthShortWithDot = (d: Date) =>
    `${d.toLocaleDateString("en-GB", { month: "short" }).replace(".", "")}.`
  const year = start.getFullYear()
  const sameDay = start.toDateString() === end.toDateString()
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()

  let range = ""
  if (sameDay) {
    range = `${start.getDate()} ${monthShortWithDot(start)} ${year}`
  } else if (sameMonth) {
    range = `${start.getDate()}-${end.getDate()} ${monthShortWithDot(start)} ${year}`
  } else {
    range = `${start.getDate()} ${monthShortWithDot(start)} - ${end.getDate()} ${monthShortWithDot(end)} ${end.getFullYear()}`
  }

  const t = e.title.trim()
  const head = t.length > 36 ? `${t.slice(0, 36)}…` : t
  return `${head} (${range})`
}

function formatSubline(e: VipEvent): string {
  const start = new Date(e.startDate)
  const end = new Date(e.endDate)
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  const dates =
    start.toDateString() === end.toDateString() ? fmt(start) : `${fmt(start)} – ${fmt(end)}`
  const v = e.venue
  const loc = v
    ? [v.venueName, [v.venueCity, v.venueCountry].filter(Boolean).join(", ")].filter(Boolean).join(" · ")
    : [e.city, e.country].filter(Boolean).join(", ")
  return loc ? `${dates}, ${loc}` : dates
}

function pillsFromEvent(e: VipEvent): string[] {
  const fromCat = (e.category || []).filter(Boolean).slice(0, 3)
  if (fromCat.length > 0) return fromCat
  const fromTags = (e.tags || []).filter(Boolean).slice(0, 3)
  if (fromTags.length > 0) return fromTags
  return ["VIP event"]
}

function heroImage(e: VipEvent): string {
  return e.bannerImage || e.images?.[0] || FALLBACK_IMAGE
}

/** Always use backend event id so links match `/event/{uuid}` (e.g. register, visit, exhibit). */
function eventBasePath(e: VipEvent): string {
  return `/event/${encodeURIComponent(e.id)}`
}

function ShowOpeningCountdown({ startDateIso }: { startDateIso: string }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [startDateIso])

  const target = new Date(startDateIso)
  const ms = target.getTime() - now
  if (Number.isNaN(target.getTime()) || ms <= 0) return null

  const totalSec = Math.floor(ms / 1000)
  const days = Math.floor(totalSec / 86400)
  const hours = Math.floor((totalSec % 86400) / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  const pad = (n: number) => n.toString().padStart(2, "0")

  const units: { value: string; label: string }[] = [
    { value: String(days), label: "Days" },
    { value: pad(hours), label: "Hours" },
    { value: pad(minutes), label: "Min" },
    // { value: pad(seconds), label: "Sec" },
  ]

  return (
    <div
      className="absolute top-4 right-6 sm:right-8 z-[2] rounded-xl bg-gray-900 test-white px-4 py-3 shadow-lg border border-gray-200"
      role="timer"
      aria-live="polite"
      aria-label="Countdown to show opening"
    >
      <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-700 sm:text-[11px]">
        Show Opening
      </p>
      <div className="flex items-stretch gap-2 sm:gap-2">
        {units.map(({ value, label }) => (
          <div
            key={label}
            className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-lg bg-white px-2 py-2.5 border border-gray-200"
          >
            <span className="text-lg font-bold text-gray-900">{value}</span>
            <span className="mt-1 text-[8px] font-medium uppercase tracking-wide text-gray-500 sm:text-[9px]">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CategoryLinkDb({ cat }: { cat: BrowseCategory }) {
  const href = `/event?category=${encodeURIComponent(cat.name)}`
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-3 px-3 py-2.5 text-left text-sm text-gray-800 transition-colors hover:bg-white hover:text-red-600"
    >
      <span className="block min-w-0 truncate font-medium leading-snug">{cat.name}</span>
      <span
        aria-hidden
        className="shrink-0 text-base leading-none text-gray-400 transition-colors group-hover:text-red-600"
      >
        &rsaquo;
      </span>
      {/* <span className="mt-0.5 block text-xs text-gray-500">
        {cat.eventCount} event{cat.eventCount === 1 ? "" : "s"}
      </span> */}
    </Link>
  )
}

export default function HeroHighlighter() {
  const [activeTab, setActiveTab] = useState(0)

  const [vipEvents, setVipEvents] = useState<VipEvent[]>([])
  const [vipLoading, setVipLoading] = useState(true)
  const [vipError, setVipError] = useState<string | null>(null)

  const [categories, setCategories] = useState<BrowseCategory[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)

  const [featuredEvents, setFeaturedEvents] = useState<FeaturedListEvent[]>([])
  const [featuredLoading, setFeaturedLoading] = useState(true)
  const [featuredError, setFeaturedError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const vipRes = await apiFetch<unknown>("/api/events/vip", { auth: false })
        if (cancelled) return
        let list = parseVipEventsPayload(vipRes)
        if (list.length === 0) {
          const fb = await apiFetch<{ success?: boolean; events?: VipEvent[] }>(
            "/api/events?limit=24&vip=true",
            { auth: false },
          )
          if (cancelled) return
          list = Array.isArray(fb.events) ? fb.events : []
        }
        setVipEvents(list)
      } catch (e) {
        if (!cancelled) {
          setVipError(e instanceof Error ? e.message : "Failed to load VIP events")
          setVipEvents([])
        }
      } finally {
        if (!cancelled) setVipLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await apiFetch<{ success?: boolean; categories?: BrowseCategory[] }>(
          "/api/events/categories/browse",
          { auth: false },
        )
        if (cancelled) return
        if (data.success !== false && Array.isArray(data.categories)) {
          setCategories(data.categories)
        } else {
          setCategories([])
        }
      } catch (e) {
        if (!cancelled) {
          setCategoriesError(e instanceof Error ? e.message : "Failed to load categories")
          setCategories([])
        }
      } finally {
        if (!cancelled) setCategoriesLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await apiFetch<unknown>("/api/events/featured", { auth: false })
        if (cancelled) return
        setFeaturedEvents(parseFeaturedEventsPayload(data).slice(0, FEATURED_EVENTS_LIMIT))
        setFeaturedError(null)
      } catch (e) {
        if (!cancelled) {
          setFeaturedError(e instanceof Error ? e.message : "Failed to load featured events")
          setFeaturedEvents([])
        }
      } finally {
        if (!cancelled) setFeaturedLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setActiveTab((i) => {
      if (vipEvents.length === 0) return 0
      return Math.min(i, vipEvents.length - 1)
    })
  }, [vipEvents.length])

  const panel = vipEvents[activeTab]
  const activeVipTheme = getVipTheme(activeTab)
  function formatTabDate(e: VipEvent): string {
  const start = new Date(e.startDate)
  const end = new Date(e.endDate)

  const month = start.toLocaleString("en-GB", { month: "short" })
  const year = start.getFullYear()

  if (start.toDateString() === end.toDateString()) {
    return `${start.getDate()} ${month} ${year}`
  }

  return `${start.getDate()}-${end.getDate()} ${month} ${year}`
}

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-8 sm:py-10 px-4 sm:px-6"
      style={{
        backgroundImage:
          " url('/images/homebg.png')",
      }}
      aria-label="Featured shows and verified exhibitors"
    >
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* 🔥 TOP PROMO BANNER */}
<div className="flex items-center justify-center gap-10 px-6 py-4">

  {/* LEFT TEXT */}
<div className="text-center">

  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
    April 2026 Global Sources Hong Kong Shows
  </h2>

  <p className="text-4xl sm:text-2xl text-white mt-2">
    The Top Destination for Global Sourcing in AI-Integrated Consumer & Mobile Electronics ...
  </p>

</div>

  {/* RIGHT BUTTON */}
  <Link
    href="/event"
    className="bg-white text-blue-700 px-6 py-2 rounded-full font-semibold"
  >
    Register Now
  </Link>

</div>
        <div className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col lg:flex-row lg:items-stretch min-h-0 lg:min-h-[410px]">
          <aside className="grid min-h-0 w-full grid-rows-[auto_minmax(0,1fr)] overflow-hidden border-b border-gray-100 bg-white p-5 sm:p-6 lg:h-full lg:w-[26%] lg:min-h-0 lg:shrink-0 lg:border-b-0 lg:border-r xl:w-[24%]">
            <h3 className="mb-3 shrink-0 text-base font-bold text-gray-900">Show Categories</h3>
            <div
              role="navigation"
              aria-label="Show categories"
              className={categoryScrollAreaClass}
              style={{ WebkitOverflowScrolling: "touch", msOverflowStyle: "scrollbar" }}
            >
              {categoriesLoading ? (
                <p className="py-2 text-sm text-gray-500">Loading categories…</p>
              ) : categoriesError ? (
                <p className="py-2 text-sm text-amber-700">{categoriesError}</p>
              ) : categories.length === 0 ? (
                <p className="py-2 text-sm text-gray-500">No active categories yet.</p>
              ) : (
                categories.map((c) => <CategoryLinkDb key={c.id} cat={c} />)
              )}
            </div>
          </aside>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col self-stretch lg:min-h-[410px]">
            {vipLoading ? (
              <div className="flex flex-1 items-center justify-center min-h-[320px] text-gray-500 text-sm">
                Loading VIP events…
              </div>
            ) : vipError && vipEvents.length === 0 ? (
              <div className="flex flex-1 items-center justify-center min-h-[320px] text-amber-800 text-sm px-4 text-center">
                {vipError}
              </div>
            ) : vipEvents.length === 0 ? (
              <div className="flex flex-1 items-center justify-center min-h-[320px] text-gray-500 text-sm">
                No VIP events at the moment.
              </div>
            ) : (
              <>
                <div
                  className="flex flex-wrap gap-0 border-b border-gray-100 bg-gray-50/80 px-3 pt-3 sm:px-4 sm:pt-3"
                  role="tablist"
                  aria-label="VIP events"
                >
                  {vipEvents.map((e, i) => {
                    const isActive = activeTab === i
                    return (
                      <button
                        key={e.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveTab(i)}
className={`h-[56px] px-3 py-2.5 sm:px-4 text-left text-xs sm:text-sm font-medium rounded-sm 
transition-all duration-300 ease-out max-w-[200px] sm:flex-1 transform
${
  isActive
    ? "bg-gradient-to-r from-red-600 to-orange-600 text-white scale-[1.15] shadow-md"
    : "text-gray-600 hover:text-red-600 hover:scale-[1.04]"
}`}>
      <div className="flex flex-col gap-1">

  {/* EVENT NAME */}
  <span className="text-sm font-semibold truncate text-center">
    {e.title.trim().length >30 ? `${e.title.trim().slice(0, 30)}...` : e.title.trim()}
  </span>

  {/* DATE CENTERED */}
  <span className={`text-xs text-center ${
    isActive ? "text-white/90" : "text-gray-500"
  }`}>
    {formatTabDate(e)}
  </span>

</div>
                      </button>
                    )
                  })}
                </div>

                {panel && (
                  <div className="relative flex-1 min-h-[245px] overflow-hidden p-3 sm:min-h-[290px] sm:p-4">
                    <img
                      src={heroImage(panel)}
                      alt=""
                      className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] rounded-xl object-cover sm:inset-4 sm:h-[calc(100%-2rem)] sm:w-[calc(100%-2rem)]"
                    />
                    <div
                      className="absolute inset-3 rounded-xl sm:inset-4"
                      style={{ background: activeVipTheme.overlayCss }}
                      aria-hidden
                    />

                    <div className="relative z-[1] h-full flex flex-col justify-end p-4 sm:justify-center sm:p-6 lg:p-8 max-w-2xl">

                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight mb-3">
                        {panel.title.toUpperCase()}
                      </h2>
                      <p className="text-sm sm:text-base text-white/85 mb-6 max-w-lg">{formatSubline(panel)}</p>
                     <div className="flex flex-col gap-3 w-full max-w-md">

  {/* 🔴 REGISTER BUTTON (FULL WIDTH) */}
  <Link
    href={`${eventBasePath(panel)}/register`}
    className={`w-full text-center px-6 py-3 rounded-sm text-sm font-semibold text-white ${activeVipTheme.registerClass}`}
  >
    Register Now
  </Link>

  {/* ⚪ TWO BUTTONS BELOW */}
  <div className="grid grid-cols-2 gap-3">
    
    <Link
      href={eventBasePath(panel)}
      className="text-center px-4 py-3 rounded-sm bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100"
    >
      Show Info
    </Link>

    <Link
      href={`${eventBasePath(panel)}/exhibit`}
      className="text-center px-4 py-3 rounded-sm bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100"
    >
      Exhibitor List
    </Link>

  </div>

</div>
                    </div>

                    <ShowOpeningCountdown startDateIso={panel.startDate} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-xl">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/featured.jpg')" }}
            aria-hidden
          />
          <div className="absolute inset-0 " aria-hidden />
          <div className="relative z-[1] flex flex-col gap-4 px-5 py-5 sm:px-7 sm:py-6 lg:flex-row lg:items-start lg:gap-7">
            <div className="shrink-0 space-y-2 lg:max-w-[210px]">
              <h3 className="text-xl font-bold leading-tight text-white sm:text-2xl">Featured Events</h3>
              <p className="text-xs leading-relaxed text-white/80 sm:text-sm">
                Handpicked events from our catalogue—open a show for details, registration, and exhibitor info.
              </p>
              <Link
                href="/event"
                className="inline-flex w-fit items-center justify-center rounded-lg bg-white px-5 py-2 text-xs font-bold text-[#3d2066] transition-colors hover:bg-gray-100 sm:text-sm"
              >
                View all events
              </Link>
            </div>
            <div className="min-w-0 flex-1">
              {featuredLoading ? (
                <p className="py-8 text-center text-sm text-white/70">Loading featured events…</p>
              ) : featuredError ? (
                <p className="py-4 text-sm text-amber-200">{featuredError}</p>
              ) : featuredEvents.length === 0 ? (
                <p className="py-6 text-sm text-white/70">No featured events right now. Check back soon.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
                  {featuredEvents.map((ev) => (
                    <FeaturedEventCard key={ev.id} event={ev} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
