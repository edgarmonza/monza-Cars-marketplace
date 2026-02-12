"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Gavel,
  Gauge,
  Cog,
  Paintbrush,
  MapPin,
  Calendar,
  Car,
  Sparkles,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  DollarSign,
  BarChart3,
  Target,
  Zap,
  FileText,
  MessageCircle,
  Database,
  Fingerprint,
  History,
  Palette,
  BadgeCheck,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AuctionBid {
  id: string
  amount: number
  bidder: string
  timestamp: string
}

interface AuctionAnalysis {
  id: string
  summary: string
  marketPosition: string
  conditionAssessment: string
  pricePrediction: {
    low: number
    mid: number
    high: number
    confidence: number
  }
  pros: string[]
  cons: string[]
  comparableSales: {
    title: string
    price: number
    date: string
    platform: string
  }[]
  riskFactors: string[]
  recommendation: string
  score: number
  createdAt: string
}

interface AuctionDetail {
  id: string
  title: string
  year: number
  make: string
  model: string
  trim: string | null
  platform: string
  platformUrl: string
  imageUrl: string | null
  images: string[]
  currentBid: number | null
  bidCount: number
  endDate: string
  status: "active" | "ended" | "upcoming"
  reserveStatus: "met" | "not_met" | "no_reserve" | "unknown"
  mileage: number | null
  transmission: string | null
  engine: string | null
  drivetrain: string | null
  exteriorColor: string | null
  interiorColor: string | null
  vin: string | null
  location: string | null
  description: string | null
  sellerNotes: string | null
  bids: AuctionBid[]
  analysis: AuctionAnalysis | null
  createdAt: string
  updatedAt: string
}

// ---------------------------------------------------------------------------
// Mock Data for Deep Analytics
// ---------------------------------------------------------------------------

const mockStrategy: Record<string, { strategy: string; complexity: string; demand: string }> = {
  Lamborghini: {
    strategy: "Aggressive bidding justified given exceptional provenance and low mileage. The SV designation commands 30-40% premium over standard P400. Market liquidity remains strong for certified examples. Consider bidding early to establish position—sniping rarely works at this price point.",
    complexity: "High",
    demand: "Very High",
  },
  Porsche: {
    strategy: "Patient, calculated approach recommended. Air-cooled 911 market shows depth with consistent buyer demand. Focus on condition and documentation—matching numbers and service history drive 20%+ premiums. Avoid emotional bidding; comparable sales support valuation.",
    complexity: "Moderate",
    demand: "High",
  },
  Ferrari: {
    strategy: "Due diligence critical before bidding. Classiche certification status significantly impacts value. Consider engaging marque specialist for pre-purchase inspection. Market favors complete, documented examples over restored cars.",
    complexity: "Very High",
    demand: "High",
  },
  Nissan: {
    strategy: "JDM market remains volatile with strong upward momentum. Verify import documentation and compliance. V-Spec and Nür variants command significant premiums. Stock, unmolested examples increasingly rare—condition trumps specification.",
    complexity: "Moderate",
    demand: "Extreme",
  },
  default: {
    strategy: "Thorough pre-purchase inspection recommended. Research comparable sales within the last 12 months. Consider total cost of ownership including maintenance, storage, and insurance. Patient bidding typically yields better outcomes.",
    complexity: "Moderate",
    demand: "Moderate",
  },
}

const mockFinancials: Record<string, { holding: number; appreciation: string; maintenance: number; insurance: number }> = {
  Lamborghini: { holding: 45000, appreciation: "+9%", maintenance: 25000, insurance: 18000 },
  Porsche: { holding: 12000, appreciation: "+8%", maintenance: 6000, insurance: 5500 },
  Ferrari: { holding: 35000, appreciation: "+10%", maintenance: 18000, insurance: 15000 },
  Nissan: { holding: 8000, appreciation: "+15%", maintenance: 4000, insurance: 3500 },
  default: { holding: 6000, appreciation: "+5%", maintenance: 3500, insurance: 2500 },
}

const mockRedFlags: Record<string, string[]> = {
  Lamborghini: [
    "Carburetors require specialized tuning; verify recent service",
    "Clutch replacement labor-intensive (~$8,000+ at specialist)",
    "Cooling system prone to issues in traffic; check fan operation",
    "Frame susceptible to stress cracks at rear mounting points",
  ],
  Porsche: [
    "Chain tensioner failure risk on early models (pre-1984)",
    "Heat exchanger condition critical; rust inspection required",
    "Galvanized vs non-galvanized body impacts long-term value",
    "Verify matching numbers engine and transmission",
  ],
  Ferrari: [
    "Cam belt service history critical ($5,000+ if overdue)",
    "Sticky interior switches common; verify all electronics",
    "Exhaust manifold cracks require specialist repair",
    "Classiche rejection significantly impacts resale",
  ],
  Nissan: [
    "ATTESA E-TS pump failure common; verify operation",
    "RB26 head gasket issues if previously tuned",
    "Rust in rear quarters and trunk common on JDM imports",
    "Verify legal import status and EPA/DOT compliance",
  ],
  default: [
    "Request comprehensive service history documentation",
    "Verify VIN matches title and body panels",
    "Check for evidence of previous accident damage",
    "Confirm mileage with service records",
  ],
}

const mockSellerQuestions: Record<string, string[]> = {
  Lamborghini: [
    "Has the battery tray been inspected for corrosion?",
    "When were the carburetors last synchronized?",
    "Is the air conditioning original and functional?",
    "Any history of frame repairs or reinforcement?",
  ],
  Porsche: [
    "When was the last valve adjustment performed?",
    "Has the vehicle been used in any form of motorsport?",
    "Are the date codes correct on all glass?",
    "Has the transmission been rebuilt? By whom?",
  ],
  Ferrari: [
    "Is Classiche certification in progress or obtainable?",
    "When was the last cam belt service performed?",
    "Are all tools and books present and original?",
    "Has the car ever been repainted?",
  ],
  Nissan: [
    "Has the vehicle been modified from stock specification?",
    "What is the boost level and tune history?",
    "Is the odometer reading in kilometers or miles?",
    "Are all import documents available for review?",
  ],
  default: [
    "Is a pre-purchase inspection permitted?",
    "What is the service history since ownership?",
    "Are there any known mechanical issues?",
    "What is included in the sale (records, spare parts)?",
  ],
}

const mockComparables: Record<string, { title: string; price: number; date: string; platform: string }[]> = {
  Lamborghini: [
    { title: "1971 Miura P400 SV", price: 2_650_000, date: "Nov 2025", platform: "RM Sotheby's" },
    { title: "1972 Miura P400 SV", price: 2_350_000, date: "Aug 2025", platform: "Gooding" },
    { title: "1969 Miura P400 S", price: 1_980_000, date: "May 2025", platform: "Bonhams" },
    { title: "1970 Miura P400 S", price: 1_850_000, date: "Mar 2025", platform: "RM Sotheby's" },
    { title: "1971 Miura P400 SV", price: 2_480_000, date: "Jan 2025", platform: "Gooding" },
  ],
  Porsche: [
    { title: "1973 911 Carrera RS 2.7", price: 1_450_000, date: "Oct 2025", platform: "RM Sotheby's" },
    { title: "1973 911 Carrera RS", price: 1_320_000, date: "Jul 2025", platform: "Gooding" },
    { title: "1972 911 2.7 RS", price: 1_180_000, date: "Apr 2025", platform: "BaT" },
    { title: "1973 911 RS Lightweight", price: 1_650_000, date: "Feb 2025", platform: "Bonhams" },
    { title: "1973 911 Carrera RS", price: 1_280_000, date: "Dec 2024", platform: "RM Sotheby's" },
  ],
  default: [
    { title: "Similar Model (Recent)", price: 125_000, date: "Nov 2025", platform: "BaT" },
    { title: "Similar Model (Mid-Year)", price: 118_000, date: "Jul 2025", platform: "C&B" },
    { title: "Similar Model (Earlier)", price: 112_000, date: "Mar 2025", platform: "BaT" },
  ],
}

// ---------------------------------------------------------------------------
// Mock Registry Intelligence Data
// ---------------------------------------------------------------------------

interface RegistrySpotting {
  year: number
  event: string
  location: string
  source?: string
}

interface RegistryConfig {
  exteriorColor: string
  exteriorCode: string
  interiorColor: string
  interiorMaterial: string
  keyOptions: string[]
}

interface RegistryData {
  chassisPrefix: string
  productionSequence: string
  totalProduced: number
  config: RegistryConfig
  spottings: RegistrySpotting[]
  verified: boolean
}

const mockRegistryData: Record<string, RegistryData> = {
  Lamborghini: {
    chassisPrefix: "4846",
    productionSequence: "#45 of 150",
    totalProduced: 150,
    config: {
      exteriorColor: "Verde Pino",
      exteriorCode: "20.517.A",
      interiorColor: "Senape",
      interiorMaterial: "Full leather w/ perforated inserts",
      keyOptions: ["Weissach Package", "Matching Numbers", "Tool Roll Complete", "Books & Records"],
    },
    spottings: [
      { year: 2018, event: "Concorso d'Eleganza", location: "Villa d'Este, Italy", source: "Registry" },
      { year: 2020, event: "Private Sale", location: "Monaco", source: "RM Sotheby's" },
      { year: 2022, event: "Documented Service", location: "Modena, Italy", source: "Factory Records" },
      { year: 2024, event: "Current Listing", location: "California, USA", source: "BaT" },
    ],
    verified: true,
  },
  Porsche: {
    chassisPrefix: "9113600",
    productionSequence: "#112 of 1,580",
    totalProduced: 1580,
    config: {
      exteriorColor: "Grand Prix White",
      exteriorCode: "L90E",
      interiorColor: "Black",
      interiorMaterial: "Leatherette w/ Pepita inserts",
      keyOptions: ["Lightweight", "Sport Seats", "Ducktail Spoiler", "Certificate of Authenticity"],
    },
    spottings: [
      { year: 2015, event: "Restoration Completed", location: "Stuttgart, Germany", source: "Porsche Classic" },
      { year: 2019, event: "Auction Result", location: "Monterey, CA", source: "Gooding & Co" },
      { year: 2021, event: "Private Collection", location: "Zurich, Switzerland", source: "Registry" },
      { year: 2024, event: "Current Listing", location: "New York, USA", source: "BaT" },
    ],
    verified: true,
  },
  Ferrari: {
    chassisPrefix: "ZFFCW56A",
    productionSequence: "#287 of 399",
    totalProduced: 399,
    config: {
      exteriorColor: "Rosso Corsa",
      exteriorCode: "300",
      interiorColor: "Nero",
      interiorMaterial: "Full leather Daytona seats",
      keyOptions: ["Classiche Certified", "Carbon Fiber Package", "Scuderia Shields", "Full Service History"],
    },
    spottings: [
      { year: 2017, event: "Classiche Certification", location: "Maranello, Italy", source: "Ferrari SpA" },
      { year: 2020, event: "Major Service", location: "Beverly Hills, CA", source: "Authorized Dealer" },
      { year: 2023, event: "Concours Entry", location: "Pebble Beach, CA", source: "Registry" },
      { year: 2024, event: "Current Listing", location: "Miami, FL", source: "C&B" },
    ],
    verified: true,
  },
  Nissan: {
    chassisPrefix: "BNR34-",
    productionSequence: "#956 of 1,003",
    totalProduced: 1003,
    config: {
      exteriorColor: "Bayside Blue",
      exteriorCode: "TV2",
      interiorColor: "Black",
      interiorMaterial: "Alcantara w/ leather bolsters",
      keyOptions: ["V-Spec II", "NISMO Exhaust", "Mine's ECU", "Complete Import Documents"],
    },
    spottings: [
      { year: 2016, event: "Japan Export", location: "Tokyo, Japan", source: "JEVIC Certificate" },
      { year: 2018, event: "US Import/Compliance", location: "Los Angeles, CA", source: "Customs Docs" },
      { year: 2022, event: "Professional Detail", location: "Seattle, WA", source: "Seller Records" },
      { year: 2024, event: "Current Listing", location: "Portland, OR", source: "BaT" },
    ],
    verified: true,
  },
  default: {
    chassisPrefix: "VIN-",
    productionSequence: "Standard Production",
    totalProduced: 0,
    config: {
      exteriorColor: "Factory Color",
      exteriorCode: "—",
      interiorColor: "Factory Interior",
      interiorMaterial: "Original Specification",
      keyOptions: ["Service Records Available", "Clean Title"],
    },
    spottings: [
      { year: 2020, event: "Previous Owner", location: "United States", source: "Title History" },
      { year: 2024, event: "Current Listing", location: "United States", source: "Auction Platform" },
    ],
    verified: false,
  },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(amount: number | null): string {
  if (amount === null) return "—"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatShort(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toLocaleString()}`
}

function timeLeft(endTime: string): string {
  const diff = new Date(endTime).getTime() - Date.now()
  if (diff <= 0) return "Ended"
  const days = Math.floor(diff / 86400000)
  const hrs = Math.floor((diff % 86400000) / 3600000)
  if (days > 0) return `${days}d ${hrs}h`
  const mins = Math.floor((diff % 3600000) / 60000)
  return `${hrs}h ${mins}m`
}

// ---------------------------------------------------------------------------
// Image Gallery Component
// ---------------------------------------------------------------------------

function StickyGallery({ images, title }: { images: string[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="sticky top-[100px] h-[calc(100vh-120px)]">
        <div className="h-full rounded-2xl bg-[rgba(15,14,22,0.6)] border border-[rgba(248,180,217,0.1)] flex items-center justify-center">
          <Car className="size-20 text-[rgba(255,252,247,0.1)]" />
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-[100px] h-[calc(100vh-120px)] flex flex-col gap-3">
      {/* Main Image */}
      <div className="relative flex-1 rounded-2xl overflow-hidden bg-[rgba(15,14,22,0.6)] border border-[rgba(248,180,217,0.1)] group">
        <Image
          src={images[currentIndex]}
          alt={`${title} - ${currentIndex + 1}`}
          fill
          className="object-cover"
          sizes="50vw"
          priority
          referrerPolicy="no-referrer"
          unoptimized
        />

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((p) => (p === 0 ? images.length - 1 : p - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-[#0b0b10]/70 backdrop-blur-md flex items-center justify-center text-[#FFFCF7] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#0b0b10]"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => setCurrentIndex((p) => (p === images.length - 1 ? 0 : p + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-[#0b0b10]/70 backdrop-blur-md flex items-center justify-center text-[#FFFCF7] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#0b0b10]"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-4 right-4 rounded-full bg-[#0b0b10]/70 backdrop-blur-md px-3 py-1.5 text-[11px] font-medium text-[#FFFCF7]">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {images.slice(0, 6).map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-16 w-24 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentIndex
                  ? "border-[#F8B4D9] shadow-lg shadow-[#F8B4D9]/20"
                  : "border-[rgba(248,180,217,0.1)] opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`Thumb ${idx + 1}`} fill className="object-cover" sizes="96px" referrerPolicy="no-referrer" unoptimized />
            </button>
          ))}
          {images.length > 6 && (
            <div className="h-16 w-24 shrink-0 rounded-lg bg-[rgba(15,14,22,0.6)] border border-[rgba(248,180,217,0.1)] flex items-center justify-center">
              <span className="text-[12px] text-[rgba(255,252,247,0.5)]">+{images.length - 6}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// MODULE A: Executive Summary + Buy Box
// ---------------------------------------------------------------------------

function ExecutiveSummary({ auction }: { auction: AuctionDetail }) {
  const isLive = auction.status === "active"
  const bidTargetLow = auction.analysis?.pricePrediction.low || auction.currentBid! * 1.05
  const bidTargetHigh = auction.analysis?.pricePrediction.high || auction.currentBid! * 1.15

  return (
    <div className="border-b border-[rgba(255,255,255,0.05)] pb-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-[#FFFCF7] tracking-tight leading-tight">
        {auction.year} {auction.make} {auction.model}
      </h1>
      {auction.trim && (
        <p className="text-[15px] text-[rgba(255,252,247,0.5)] mt-1">{auction.trim}</p>
      )}

      {/* The Buy Box */}
      <div className="mt-6 rounded-xl bg-[rgba(248,180,217,0.04)] border border-[rgba(248,180,217,0.1)] p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Current Bid */}
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[rgba(255,252,247,0.4)]">
              {isLive ? "Current Bid" : "Final Price"}
            </p>
            <p className="text-4xl font-bold text-[#FFFCF7] font-mono mt-1">
              {formatCurrency(auction.currentBid)}
            </p>
            <div className="flex items-center gap-3 mt-2 text-[rgba(255,252,247,0.5)]">
              <span className="flex items-center gap-1 text-[12px]">
                <Gavel className="size-3" />
                {auction.bidCount} bids
              </span>
              {isLive && (
                <span className="flex items-center gap-1 text-[12px]">
                  <Clock className="size-3" />
                  {timeLeft(auction.endDate)}
                </span>
              )}
            </div>
          </div>

          {/* Bid Target */}
          <div className="text-right">
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#F8B4D9]">
              Recommended Cap
            </p>
            <p className="text-2xl font-bold text-[#F8B4D9] font-mono mt-1">
              {formatShort(bidTargetLow)} — {formatShort(bidTargetHigh)}
            </p>
            <p className="text-[11px] text-[rgba(255,252,247,0.4)] mt-1">
              Based on market analysis
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-5">
          {isLive && (
            <button className="flex-1 rounded-full bg-[#F8B4D9] py-3.5 text-[13px] font-semibold tracking-[0.05em] uppercase text-[#0b0b10] hover:bg-[#fce4ec] transition-colors">
              Place Bid
            </button>
          )}
          <a
            href={auction.platformUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-full border border-[rgba(248,180,217,0.2)] py-3.5 text-center text-[13px] font-medium tracking-[0.05em] uppercase text-[rgba(255,252,247,0.7)] hover:text-[#FFFCF7] hover:border-[rgba(248,180,217,0.4)] transition-all flex items-center justify-center gap-2"
          >
            <ExternalLink className="size-4" />
            View Original Listing
          </a>
        </div>

        {/* WhatsApp Concierge */}
        <a
          href={`https://wa.me/491726690998?text=${encodeURIComponent(
            `Hola Nicolás, estoy viendo el ${auction.year} ${auction.make} ${auction.model} en Monza Lab. Me interesa recibir el Investment Thesis y valoración actual.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2.5 rounded-full border border-[#F8B4D9]/40 bg-[rgba(15,14,22,0.8)] backdrop-blur-md py-3.5 text-[13px] font-medium tracking-[0.05em] uppercase text-[#FFFCF7] hover:border-[#F8B4D9]/70 hover:bg-[rgba(248,180,217,0.08)] transition-all group"
        >
          <MessageCircle className="size-4 text-[#F8B4D9] group-hover:scale-110 transition-transform" />
          <span>Chat with Analyst</span>
        </a>
      </div>

      {/* Quick Specs */}
      <div className="mt-5 grid grid-cols-4 gap-3">
        {[
          { label: "Mileage", value: auction.mileage ? `${auction.mileage.toLocaleString()} mi` : "—", icon: Gauge },
          { label: "Engine", value: auction.engine || "—", icon: Cog },
          { label: "Trans", value: auction.transmission || "—", icon: Cog },
          { label: "Location", value: auction.location || "—", icon: MapPin },
        ].map((spec) => (
          <div key={spec.label} className="space-y-1">
            <div className="flex items-center gap-1 text-[rgba(255,252,247,0.4)]">
              <spec.icon className="size-3" />
              <span className="text-[9px] font-medium tracking-[0.15em] uppercase">{spec.label}</span>
            </div>
            <p className="text-[13px] text-[#FFFCF7] truncate">{spec.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// MODULE B: Strategy & Alpha
// ---------------------------------------------------------------------------

function StrategyModule({ auction }: { auction: AuctionDetail }) {
  const data = mockStrategy[auction.make] || mockStrategy.default
  const score = auction.analysis?.score || 75

  return (
    <div className="border-b border-[rgba(255,255,255,0.05)] py-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="size-4 text-[#F8B4D9]" />
        <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#F8B4D9]">
          Strategy Insights
        </h2>
      </div>

      <p className="text-[14px] leading-relaxed text-[rgba(255,252,247,0.8)]">
        {data.strategy}
      </p>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mt-4">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] uppercase ${
          score >= 80 ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" :
          score >= 60 ? "bg-[rgba(248,180,217,0.1)] text-[#F8B4D9] border border-[rgba(248,180,217,0.2)]" :
          "bg-amber-500/15 text-amber-400 border border-amber-500/30"
        }`}>
          <Target className="size-3" />
          Grade: {score >= 80 ? "AAA" : score >= 60 ? "AA" : "A"}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-[10px] font-medium text-[rgba(255,252,247,0.6)] border border-[rgba(255,255,255,0.08)]">
          Complexity: {data.complexity}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-[10px] font-medium text-[rgba(255,252,247,0.6)] border border-[rgba(255,255,255,0.08)]">
          Demand: {data.demand}
        </span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// MODULE C: Financial Projection
// ---------------------------------------------------------------------------

function FinancialsModule({ auction }: { auction: AuctionDetail }) {
  const [period, setPeriod] = useState<1 | 3 | 5>(1)
  const data = mockFinancials[auction.make] || mockFinancials.default
  const currentValue = auction.currentBid || 100000

  const appreciationRate = parseFloat(data.appreciation) / 100
  const projectedValue = currentValue * Math.pow(1 + appreciationRate, period)
  const totalHoldingCost = data.holding * period
  const netGain = projectedValue - currentValue - totalHoldingCost

  return (
    <div className="border-b border-[rgba(255,255,255,0.05)] py-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-4 text-[#F8B4D9]" />
          <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#F8B4D9]">
            Financial Projection
          </h2>
        </div>

        {/* Period Tabs */}
        <div className="flex rounded-full bg-[rgba(255,255,255,0.04)] p-0.5">
          {[1, 3, 5].map((y) => (
            <button
              key={y}
              onClick={() => setPeriod(y as 1 | 3 | 5)}
              className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all ${
                period === y
                  ? "bg-[#F8B4D9] text-[#0b0b10]"
                  : "text-[rgba(255,252,247,0.5)] hover:text-[#FFFCF7]"
              }`}
            >
              {y}Y
            </button>
          ))}
        </div>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] p-3">
          <p className="text-[9px] font-medium tracking-[0.15em] uppercase text-[rgba(255,252,247,0.4)]">
            Holding Cost ({period}yr)
          </p>
          <p className="text-[18px] font-bold text-[#FFFCF7] font-mono mt-1">
            {formatShort(totalHoldingCost)}
          </p>
          <p className="text-[10px] text-[rgba(255,252,247,0.4)] mt-1">
            Maint: {formatShort(data.maintenance)}/yr · Ins: {formatShort(data.insurance)}/yr
          </p>
        </div>
        <div className="rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] p-3">
          <p className="text-[9px] font-medium tracking-[0.15em] uppercase text-[rgba(255,252,247,0.4)]">
            Appreciation
          </p>
          <p className="text-[18px] font-bold text-emerald-400 font-mono mt-1">
            {data.appreciation} / yr
          </p>
          <p className="text-[10px] text-[rgba(255,252,247,0.4)] mt-1">
            Projected: {formatShort(projectedValue)}
          </p>
        </div>
      </div>

      {/* Net Yield Bar */}
      <div className="mt-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-medium tracking-[0.15em] uppercase text-[rgba(255,252,247,0.4)]">
            Net Yield ({period} Year)
          </span>
          <span className={`text-[14px] font-bold font-mono ${netGain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {netGain >= 0 ? "+" : ""}{formatShort(netGain)}
          </span>
        </div>
        <div className="h-2 rounded-full bg-[rgba(255,255,255,0.05)] overflow-hidden">
          <div
            className={`h-full rounded-full ${netGain >= 0 ? "bg-emerald-500" : "bg-red-500"}`}
            style={{ width: `${Math.min(Math.abs(netGain / currentValue) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// MODULE D: Risk Assessment
// ---------------------------------------------------------------------------

function RiskModule({ auction }: { auction: AuctionDetail }) {
  const [showQuestions, setShowQuestions] = useState(false)
  const redFlags = mockRedFlags[auction.make] || mockRedFlags.default
  const questions = mockSellerQuestions[auction.make] || mockSellerQuestions.default

  return (
    <div className="border-b border-[rgba(255,255,255,0.05)] py-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="size-4 text-amber-400" />
        <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-amber-400">
          Due Diligence
        </h2>
      </div>

      {/* Red Flags */}
      <div className="space-y-2">
        {redFlags.map((flag, i) => (
          <div key={i} className="flex items-start gap-2 text-[13px] text-[rgba(255,252,247,0.7)]">
            <AlertCircle className="size-3.5 text-amber-400 mt-0.5 shrink-0" />
            <span>{flag}</span>
          </div>
        ))}
      </div>

      {/* Seller Questions Toggle */}
      <button
        onClick={() => setShowQuestions(!showQuestions)}
        className="mt-4 flex items-center gap-2 text-[12px] font-medium text-[#F8B4D9] hover:text-[#fce4ec] transition-colors"
      >
        <HelpCircle className="size-4" />
        {showQuestions ? "Hide" : "Show"} Seller Questions ({questions.length})
      </button>

      {showQuestions && (
        <div className="mt-3 space-y-2 pl-4 border-l-2 border-[rgba(248,180,217,0.2)]">
          {questions.map((q, i) => (
            <p key={i} className="text-[12px] text-[rgba(255,252,247,0.6)]">
              {q}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// MODULE E: Market Context (Comparables)
// ---------------------------------------------------------------------------

function ComparablesModule({ auction }: { auction: AuctionDetail }) {
  const sales = auction.analysis?.comparableSales || mockComparables[auction.make] || mockComparables.default

  return (
    <div className="py-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="size-4 text-[#F8B4D9]" />
        <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#F8B4D9]">
          Comparable Sales
        </h2>
      </div>

      <div className="space-y-2">
        {sales.slice(0, 5).map((sale, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2.5 border-b border-[rgba(255,255,255,0.04)] last:border-0"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#FFFCF7] truncate">{sale.title}</p>
              <p className="text-[10px] text-[rgba(255,252,247,0.4)] mt-0.5">
                {sale.date} · {sale.platform}
              </p>
            </div>
            <span className="text-[14px] font-bold font-mono text-[#FFFCF7] ml-4">
              {formatShort(sale.price)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// MODULE F: Registry Intelligence
// ---------------------------------------------------------------------------

function RegistryIntelligenceModule({ auction }: { auction: AuctionDetail }) {
  const registryData = mockRegistryData[auction.make] || mockRegistryData.default
  const chassisNumber = auction.vin || `${registryData.chassisPrefix}${Math.floor(Math.random() * 9000) + 1000}`

  return (
    <div className="border-b border-[rgba(255,255,255,0.05)] py-5">
      {/* Header with Verified Badge */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Database className="size-4 text-[#F8B4D9]" />
          <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#F8B4D9]">
            Registry Intelligence
          </h2>
        </div>
        {registryData.verified && (
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1">
            <BadgeCheck className="size-3 text-emerald-400" />
            <span className="text-[9px] font-semibold tracking-wider uppercase text-emerald-400">
              Verified
            </span>
          </div>
        )}
      </div>

      {/* Chassis Identity - Terminal Style */}
      <div className="rounded-lg bg-[#0a0a0f] border border-[rgba(255,255,255,0.06)] p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Fingerprint className="size-3.5 text-[rgba(255,252,247,0.4)]" />
          <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-[rgba(255,252,247,0.4)]">
            Chassis Identity
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[9px] text-[rgba(255,252,247,0.35)] uppercase tracking-wider mb-1">VIN / Chassis #</p>
            <p className="text-[15px] font-mono font-medium text-[#FFFCF7] tracking-wide">{chassisNumber}</p>
          </div>
          <div>
            <p className="text-[9px] text-[rgba(255,252,247,0.35)] uppercase tracking-wider mb-1">Production</p>
            <p className="text-[13px] font-mono text-[#F8B4D9]">{registryData.productionSequence}</p>
            {registryData.totalProduced > 0 && (
              <p className="text-[10px] text-[rgba(255,252,247,0.4)] mt-0.5">
                Total produced: {registryData.totalProduced.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Configuration - The Spec */}
      <div className="rounded-lg bg-[rgba(15,14,22,0.5)] border border-[rgba(255,255,255,0.04)] p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="size-3.5 text-[rgba(255,252,247,0.4)]" />
          <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-[rgba(255,252,247,0.4)]">
            Factory Configuration
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
          <div>
            <p className="text-[9px] text-[rgba(255,252,247,0.35)] uppercase tracking-wider mb-1">Exterior</p>
            <p className="text-[12px] text-[#FFFCF7]">{registryData.config.exteriorColor}</p>
            <p className="text-[10px] font-mono text-[rgba(255,252,247,0.4)]">{registryData.config.exteriorCode}</p>
          </div>
          <div>
            <p className="text-[9px] text-[rgba(255,252,247,0.35)] uppercase tracking-wider mb-1">Interior</p>
            <p className="text-[12px] text-[#FFFCF7]">{registryData.config.interiorColor}</p>
            <p className="text-[10px] text-[rgba(255,252,247,0.4)]">{registryData.config.interiorMaterial}</p>
          </div>
        </div>

        {/* Key Options */}
        <div>
          <p className="text-[9px] text-[rgba(255,252,247,0.35)] uppercase tracking-wider mb-2">Key Options</p>
          <div className="flex flex-wrap gap-1.5">
            {registryData.config.keyOptions.map((option, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded bg-[rgba(248,180,217,0.08)] border border-[rgba(248,180,217,0.12)] px-2 py-1 text-[10px] font-medium text-[rgba(255,252,247,0.7)]"
              >
                {option}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Asset Lifecycle - Spotting Timeline */}
      <div className="rounded-lg bg-[rgba(15,14,22,0.5)] border border-[rgba(255,255,255,0.04)] p-4">
        <div className="flex items-center gap-2 mb-4">
          <History className="size-3.5 text-[rgba(255,252,247,0.4)]" />
          <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-[rgba(255,252,247,0.4)]">
            Asset Lifecycle
          </span>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gradient-to-b from-[#F8B4D9]/40 via-[rgba(255,255,255,0.1)] to-transparent" />

          <div className="space-y-3">
            {registryData.spottings.map((spot, i) => (
              <div key={i} className="flex items-start gap-3 pl-0">
                {/* Timeline dot */}
                <div className={`relative z-10 size-2.5 rounded-full mt-1.5 shrink-0 ${
                  i === registryData.spottings.length - 1
                    ? "bg-[#F8B4D9] shadow-lg shadow-[#F8B4D9]/30"
                    : "bg-[rgba(255,255,255,0.2)] border border-[rgba(255,255,255,0.1)]"
                }`} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[11px] font-mono font-semibold text-[#FFFCF7]">{spot.year}</span>
                    <span className="text-[11px] text-[rgba(255,252,247,0.7)]">{spot.event}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <MapPin className="size-2.5 text-[rgba(255,252,247,0.3)]" />
                    <span className="text-[10px] text-[rgba(255,252,247,0.4)]">{spot.location}</span>
                    {spot.source && (
                      <>
                        <span className="text-[rgba(255,252,247,0.2)]">·</span>
                        <span className="text-[10px] text-[rgba(248,180,217,0.6)]">{spot.source}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Registry Data Source */}
      <p className="mt-3 text-[9px] text-[rgba(255,252,247,0.25)] text-center">
        Data sourced from Exclusive Car Registry • Last verified {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Loading Skeleton
// ---------------------------------------------------------------------------

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#0b0b10] pt-[100px]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-[4/3] rounded-2xl bg-[rgba(248,180,217,0.05)] animate-pulse" />
          <div className="space-y-6">
            <div className="h-10 w-3/4 bg-[rgba(248,180,217,0.05)] rounded animate-pulse" />
            <div className="h-32 bg-[rgba(248,180,217,0.05)] rounded-xl animate-pulse" />
            <div className="h-24 bg-[rgba(248,180,217,0.05)] rounded-xl animate-pulse" />
            <div className="h-24 bg-[rgba(248,180,217,0.05)] rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function AuctionDetailClient() {
  const params = useParams()
  const router = useRouter()
  const auctionId = params.id as string

  const [auction, setAuction] = useState<AuctionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!auctionId) return

    async function fetchAuction() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/auctions/${auctionId}`)
        if (!res.ok) {
          if (res.status === 404) throw new Error("Auction not found")
          throw new Error(`Failed to load auction (${res.status})`)
        }
        const json = await res.json()
        const rawAuction = json.data ?? json

        const data: AuctionDetail = {
          id: rawAuction.id,
          title: rawAuction.title,
          year: rawAuction.year,
          make: rawAuction.make,
          model: rawAuction.model,
          trim: rawAuction.trim ?? null,
          platform: rawAuction.platform?.toLowerCase().replace(/_/g, "-") ?? "",
          platformUrl: rawAuction.url ?? "",
          imageUrl: rawAuction.images?.[0] ?? null,
          images: rawAuction.images ?? [],
          currentBid: rawAuction.currentBid ?? rawAuction.finalPrice ?? null,
          bidCount: rawAuction.bidCount ?? 0,
          endDate: rawAuction.endTime ?? "",
          status: rawAuction.status === "ACTIVE" || rawAuction.status === "ENDING_SOON"
            ? "active"
            : rawAuction.status === "ENDED" || rawAuction.status === "SOLD" || rawAuction.status === "NO_SALE"
            ? "ended"
            : "upcoming",
          reserveStatus: rawAuction.reserveStatus === "NO_RESERVE"
            ? "no_reserve"
            : rawAuction.reserveStatus === "RESERVE_MET"
            ? "met"
            : rawAuction.reserveStatus === "RESERVE_NOT_MET"
            ? "not_met"
            : "unknown",
          mileage: rawAuction.mileage ?? null,
          transmission: rawAuction.transmission ?? null,
          engine: rawAuction.engine ?? null,
          drivetrain: null,
          exteriorColor: rawAuction.exteriorColor ?? null,
          interiorColor: rawAuction.interiorColor ?? null,
          vin: rawAuction.vin ?? null,
          location: rawAuction.location ?? null,
          description: rawAuction.description ?? null,
          sellerNotes: rawAuction.sellerNotes ?? null,
          bids: (rawAuction.priceHistory ?? []).map((ph: { id: string; bid: number; timestamp: string }, idx: number) => ({
            id: ph.id,
            amount: ph.bid,
            bidder: `Bidder ${idx + 1}`,
            timestamp: ph.timestamp,
          })),
          analysis: rawAuction.analysis ? {
            id: rawAuction.analysis.id,
            summary: rawAuction.analysis.rawAnalysis?.summary ?? "",
            marketPosition: rawAuction.analysis.rawAnalysis?.marketPosition ?? "",
            conditionAssessment: rawAuction.analysis.rawAnalysis?.conditionAssessment ?? "",
            pricePrediction: {
              low: rawAuction.analysis.bidTargetLow ?? 0,
              mid: ((rawAuction.analysis.bidTargetLow ?? 0) + (rawAuction.analysis.bidTargetHigh ?? 0)) / 2,
              high: rawAuction.analysis.bidTargetHigh ?? 0,
              confidence: rawAuction.analysis.confidence === "HIGH" ? 0.9 : rawAuction.analysis.confidence === "MEDIUM" ? 0.7 : 0.5,
            },
            pros: rawAuction.analysis.keyStrengths ?? [],
            cons: rawAuction.analysis.redFlags ?? [],
            comparableSales: (rawAuction.comparables ?? []).map((c: { title: string; soldPrice: number; soldDate: string; platform: string }) => ({
              title: c.title,
              price: c.soldPrice,
              date: c.soldDate,
              platform: c.platform,
            })),
            riskFactors: rawAuction.analysis.redFlags ?? [],
            recommendation: rawAuction.analysis.rawAnalysis?.recommendation ?? "",
            score: rawAuction.analysis.investmentGrade === "EXCELLENT" ? 95 : rawAuction.analysis.investmentGrade === "GOOD" ? 80 : rawAuction.analysis.investmentGrade === "FAIR" ? 65 : 50,
            createdAt: rawAuction.analysis.createdAt,
          } : null,
          createdAt: rawAuction.createdAt,
          updatedAt: rawAuction.updatedAt,
        }
        setAuction(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchAuction()
  }, [auctionId])

  if (loading) return <DetailSkeleton />

  if (error || !auction) {
    return (
      <div className="min-h-screen bg-[#0b0b10] pt-[100px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto rounded-full bg-red-500/10 p-4 w-fit">
            <AlertCircle className="size-8 text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-[#FFFCF7]">{error ?? "Auction not found"}</h2>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-[13px] text-[#F8B4D9] hover:text-[#fce4ec] transition-colors"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b0b10] pt-[100px]">
      {/* Back Navigation */}
      <div className="fixed top-[100px] left-0 right-0 z-30 bg-[#0b0b10]/80 backdrop-blur-md border-b border-[rgba(248,180,217,0.06)]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between h-12">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-[12px] text-[rgba(255,252,247,0.5)] hover:text-[#F8B4D9] transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back to Feed
            </button>
            {auction.status === "active" && (
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Auction
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Sticky Image Gallery */}
          <StickyGallery images={auction.images} title={auction.title} />

          {/* RIGHT: Data Terminal (Scrollable) */}
          <div className="h-[calc(100vh-180px)] overflow-y-auto no-scrollbar pr-2">
            {/* MODULE A: Executive Summary */}
            <ExecutiveSummary auction={auction} />

            {/* MODULE F: Registry Intelligence */}
            <RegistryIntelligenceModule auction={auction} />

            {/* MODULE B: Strategy & Alpha */}
            <StrategyModule auction={auction} />

            {/* MODULE C: Financial Projection */}
            <FinancialsModule auction={auction} />

            {/* MODULE D: Risk Assessment */}
            <RiskModule auction={auction} />

            {/* MODULE E: Comparables */}
            <ComparablesModule auction={auction} />

            {/* VIN */}
            {auction.vin && (
              <div className="py-5 border-t border-[rgba(255,255,255,0.05)]">
                <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-[rgba(255,252,247,0.4)]">
                  VIN
                </p>
                <p className="text-[12px] font-mono text-[rgba(255,252,247,0.6)] mt-1">{auction.vin}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
