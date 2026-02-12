import type { Metadata } from "next";
import { SearchClient } from "./SearchClient";

export const metadata: Metadata = {
  title: "Search Auctions | Monza Lab",
  description:
    "Search across thousands of live and completed auctions. Filter by make, model, year, platform, and price range.",
};

export default function SearchPage() {
  return (
    <div className="flex flex-col h-screen pt-[100px] bg-[#050505]">
      <SearchClient />
    </div>
  );
}
