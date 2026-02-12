import type { Metadata } from "next";
import { TrendingUp, BarChart3, Calendar } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { MarketTrendsClient } from "./MarketTrendsClient";

export const metadata: Metadata = {
  title: "Market Trends | Monza Lab",
  description:
    "Explore historical auction results and market trends for classic and collectible vehicles.",
};

export default async function HistoryPage() {
  let stats = { totalAuctions: 0, makesCovered: 0, platformsActive: 0, dataPoints: 0 };
  let trends: { make: string; model: string; avgPrice: number | null; totalSales: number; trend: string | null; }[] = [];

  try {
    const [totalAuctions, makes, platforms, dataPoints, marketData] = await Promise.all([
      prisma.auction.count({ where: { status: { in: ["ENDED", "SOLD"] } } }),
      prisma.auction.groupBy({ by: ["make"] }),
      prisma.auction.groupBy({ by: ["platform"] }),
      prisma.priceHistory.count(),
      prisma.marketData.findMany({ orderBy: { totalSales: "desc" }, take: 6 }),
    ]);
    stats = { totalAuctions, makesCovered: makes.length, platformsActive: platforms.length, dataPoints };
    trends = marketData.map((m: { make: string; model: string; avgPrice: number | null; totalSales: number; trend: string | null }) => ({ make: m.make, model: m.model, avgPrice: m.avgPrice, totalSales: m.totalSales, trend: m.trend }));
  } catch {}

  return (
    <div className="min-h-screen">
      <section className="relative border-b border-[rgba(248,180,217,0.06)] bg-[#0b0b10] pt-28">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 40% at 50% 0%, rgba(248, 180, 217, 0.08) 0%, transparent 60%)" }} />
        <div className="relative mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-[#F8B4D9]">
            <TrendingUp className="size-4" />
            <span className="text-[11px] font-medium tracking-[0.2em] uppercase">Market Intelligence</span>
          </div>
          <h1 className="mt-4 text-3xl font-light tracking-tight text-[#FFFCF7] sm:text-4xl">
            Market <span className="font-semibold text-gradient">Trends</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[rgba(255,252,247,0.45)] font-light">
            Analyze historical auction results, track price movements, and identify trends across makes, models, and platforms.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Auctions Tracked", value: stats.totalAuctions.toLocaleString(), icon: BarChart3 },
              { label: "Makes Covered", value: stats.makesCovered.toString(), icon: Calendar },
              { label: "Platforms", value: stats.platformsActive.toString(), icon: TrendingUp },
              { label: "Data Points", value: stats.dataPoints.toLocaleString(), icon: BarChart3 },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-2xl border border-[rgba(248,180,217,0.08)] bg-[rgba(15,14,22,0.6)] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Icon className="size-3 text-[#F8B4D9]" />
                    <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[rgba(255,252,247,0.35)]">{stat.label}</span>
                  </div>
                  <p className="mt-1.5 text-xl font-light text-[#FFFCF7]">{stat.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <MarketTrendsClient initialTrends={trends} />
    </div>
  );
}
