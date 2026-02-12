"use client";

import { useEffect, useState } from "react";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

type Auction = {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  trim: string | null;
  currentBid: number;
  bidCount: number;
  viewCount: number;
  watchCount: number;
  status: string;
  endTime: string;
  platform: string;
  engine: string | null;
  transmission: string | null;
  exteriorColor: string | null;
  mileage: number | null;
  mileageUnit: string | null;
  location: string | null;
  description: string | null;
  images: string[];
  analysis: {
    bidTargetLow: number | null;
    bidTargetHigh: number | null;
    confidence: string | null;
    investmentGrade: string | null;
    appreciationPotential: string | null;
    keyStrengths: string[];
    redFlags: string[];
  } | null;
  priceHistory: { price: number; timestamp: string }[];
};

export default function Home() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuctions() {
      try {
        const response = await fetch("/api/mock-auctions?limit=50");
        const data = await response.json();
        // Transform API response to match Auction type
        const transformed = data.auctions.map((a: any) => ({
          ...a,
          viewCount: 0,
          watchCount: 0,
          exteriorColor: null,
          description: null,
          analysis: a.investmentGrade ? {
            bidTargetLow: null,
            bidTargetHigh: null,
            confidence: null,
            investmentGrade: a.investmentGrade,
            appreciationPotential: a.trend,
            keyStrengths: [],
            redFlags: [],
          } : null,
          priceHistory: [],
        }));
        setAuctions(transformed);
      } catch (error) {
        console.error("Failed to fetch auctions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAuctions();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#F8B4D9] border-t-transparent rounded-full animate-spin" />
          <span className="text-[#9CA3AF] text-sm tracking-wide">Loading assets...</span>
        </div>
      </div>
    );
  }

  if (auctions.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#050505]">
        <span className="text-[#9CA3AF] text-sm">No auctions found</span>
      </div>
    );
  }

  return <DashboardClient auctions={auctions} />;
}
