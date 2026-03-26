"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"

export default function RFQComponent() {
  const [productName, setProductName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("Boxes")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ productName, quantity, unit })
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-cover bg-center bg-no-repeat rounded-xl overflow-hidden"
        style={{
          backgroundImage: "url('https://s.globalsources.com/IMAGES/website/image/home/rfq_home@2x.jpg')",
        }}
      >
        {/* Dark Overlay */}
        <div className="bg-black/70 px-8 py-10">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Left Column - RFQ Info */}
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-white">Request for Quotations (RFQ)</h2>
              
              <div className="border-l-3 border-red-500 pl-3">
                <p className="text-sm text-white/70">From Russian Federation is looking for</p>
                <h3 className="text-lg font-bold text-white mt-1">Second Hand Tyres / Perfect U...</h3>
                <p className="text-sm text-white/60 mt-1">and has received <span className="text-white font-semibold">0 quotations(s)</span></p>
                <button className="text-white/80 text-sm hover:text-white flex items-center gap-1 mt-2 transition">
                  View More
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-white/70">• Submit an RFQ in just one minute.</p>
                <p className="text-sm text-white/70">• Get multiple quotations from Verified Suppliers.</p>
                <p className="text-sm text-white/70">• Compare and choose the best quotation!</p>
              </div>
            </div>

            {/* Right Column - Form */}
            <div>
              <h3 className="text-xl font-bold text-white mb-5">Get Quotations Now</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Please enter a specific product name
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g., Second Hand Tyres, HDMI Cable, Smart Watch..."
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-red-500 text-white text-sm placeholder:text-white/40"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">
                      Quantity
                    </label>
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="US$ 150"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-red-500 text-white text-sm placeholder:text-white/40"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">
                      Unit
                    </label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-red-500 text-white text-sm"
                    >
                      <option className="bg-gray-800">Boxes</option>
                      <option className="bg-gray-800">Bags</option>
                      <option className="bg-gray-800">Pieces</option>
                      <option className="bg-gray-800">Kilograms</option>
                      <option className="bg-gray-800">Liters</option>
                      <option className="bg-gray-800">Meters</option>
                      <option className="bg-gray-800">Sets</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-2.5 rounded font-semibold hover:bg-red-700 transition-colors text-sm mt-2"
                >
                  Request for Quotations
                </button>
              </form>

              <p className="text-xs text-white/40 text-center mt-3">
                By submitting, you agree to our <a href="#" className="text-white/60 hover:text-white underline">Terms & Conditions</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}