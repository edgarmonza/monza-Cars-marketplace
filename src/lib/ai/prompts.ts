// ---------------------------------------------------------------------------
// AI Prompts for Vehicle Analysis
// ---------------------------------------------------------------------------
// Structured prompts that instruct Claude to return JSON responses for
// vehicle analysis, market summaries, and investment outlooks.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// System prompt (shared context for all analysis calls)
// ---------------------------------------------------------------------------

export const ANALYSIS_SYSTEM_PROMPT = `You are Monza Lab AI, an expert automotive analyst specializing in collector cars, enthusiast vehicles, and online car auctions. You have deep knowledge of:

- Auction platforms (Bring a Trailer, Cars & Bids, Collecting Cars)
- Vehicle valuations, market trends, and price history
- Mechanical reliability, common issues, and maintenance costs for specific makes/models
- Investment potential of collector and enthusiast vehicles
- What to look for (and avoid) when buying at auction

You always respond with valid JSON when asked to do so. You are honest about uncertainty and clearly state when you are making estimates vs citing known data. You flag potential red flags without being alarmist.`;

// ---------------------------------------------------------------------------
// Vehicle Analysis Prompt
// ---------------------------------------------------------------------------

/**
 * Build the main vehicle analysis prompt.
 * The AI is asked to return a structured JSON object with bid targets,
 * red flags, strengths, ownership costs, and investment outlook.
 */
export function buildVehicleAnalysisPrompt(
  vehicleData: {
    title: string;
    make: string;
    model: string;
    year: number;
    mileage?: number | null;
    transmission?: string | null;
    engine?: string | null;
    exteriorColor?: string | null;
    interiorColor?: string | null;
    location?: string | null;
    currentBid?: number | null;
    endTime?: string | Date | null;
    description?: string | null;
    sellerNotes?: string | null;
    platform: string;
    url: string;
    vin?: string | null;
  },
  marketData?: {
    comparableSales?: Array<{
      title: string;
      soldPrice: number;
      soldDate?: string | null;
      mileage?: number | null;
      platform?: string;
      condition?: string | null;
    }>;
    totalComparables?: number;
  },
): string {
  const comparablesSection = marketData?.comparableSales?.length
    ? `
COMPARABLE SALES DATA:
${marketData.comparableSales
  .map(
    (c, i) =>
      `${i + 1}. ${c.title} - Sold for $${c.soldPrice?.toLocaleString() ?? 'N/A'}${c.soldDate ? ` on ${c.soldDate}` : ''}${c.mileage ? ` (${c.mileage.toLocaleString()} mi)` : ''}${c.platform ? ` [${c.platform}]` : ''}${c.condition ? ` - Condition: ${c.condition}` : ''}`,
  )
  .join('\n')}
Total comparable sales in database: ${marketData.totalComparables ?? marketData.comparableSales.length}
`
    : `
COMPARABLE SALES DATA:
No comparable sales data available. Please estimate based on your knowledge of the market.
`;

  return `Analyze this vehicle auction listing and provide a comprehensive buyer advisory.

VEHICLE DATA:
- Title: ${vehicleData.title}
- Year: ${vehicleData.year}
- Make: ${vehicleData.make}
- Model: ${vehicleData.model}
- Mileage: ${vehicleData.mileage != null ? `${vehicleData.mileage.toLocaleString()}` : 'Not specified'}
- Transmission: ${vehicleData.transmission || 'Not specified'}
- Engine: ${vehicleData.engine || 'Not specified'}
- Exterior Color: ${vehicleData.exteriorColor || 'Not specified'}
- Interior Color: ${vehicleData.interiorColor || 'Not specified'}
- Location: ${vehicleData.location || 'Not specified'}
- VIN: ${vehicleData.vin || 'Not provided'}
- Platform: ${vehicleData.platform}
- Current Bid: ${vehicleData.currentBid != null ? `$${vehicleData.currentBid.toLocaleString()}` : 'No bids yet'}
- Auction End: ${vehicleData.endTime || 'Not specified'}
- URL: ${vehicleData.url}

LISTING DESCRIPTION:
${vehicleData.description || 'No description available.'}

SELLER NOTES:
${vehicleData.sellerNotes || 'No seller notes available.'}

${comparablesSection}

INSTRUCTIONS:
Analyze this listing thoroughly and respond with ONLY a valid JSON object (no markdown fences, no explanation outside the JSON). Use this exact structure:

{
  "bidTarget": {
    "low": <number - conservative fair value in USD>,
    "high": <number - aggressive fair value in USD>,
    "confidence": "<HIGH|MEDIUM|LOW>",
    "reasoning": "<string - 2-3 sentences explaining the valuation range>"
  },
  "criticalQuestions": [
    "<string - important question a buyer should ask the seller before bidding>"
  ],
  "redFlags": [
    "<string - potential concern or risk identified in the listing>"
  ],
  "keyStrengths": [
    "<string - positive aspect of this vehicle or listing>"
  ],
  "ownershipCosts": {
    "yearlyMaintenance": <number - estimated annual maintenance cost in USD>,
    "insuranceEstimate": <number - estimated annual insurance cost in USD>,
    "majorService": {
      "description": "<string - what the next major service would be>",
      "estimatedCost": <number - estimated cost in USD>,
      "intervalMiles": <number - miles between major services>
    }
  },
  "investmentOutlook": {
    "grade": "<EXCELLENT|GOOD|FAIR|SPECULATIVE>",
    "trend": "<APPRECIATING|STABLE|DECLINING>",
    "reasoning": "<string - 2-3 sentences explaining the investment outlook>"
  },
  "comparableAnalysis": "<string - 2-3 paragraph analysis of how this vehicle compares to recent sales, what drives its value, and whether the current bid represents good value>"
}

Be specific to THIS exact vehicle. Reference known issues for the ${vehicleData.year} ${vehicleData.make} ${vehicleData.model}. If the mileage, condition, or options are unusual, factor that into your analysis. If information is missing, note that as a risk factor.`;
}

// ---------------------------------------------------------------------------
// Market Summary Prompt
// ---------------------------------------------------------------------------

/**
 * Build a prompt to generate a market trend summary across platforms.
 */
export function buildMarketSummaryPrompt(
  auctions: Array<{
    title: string;
    platform: string;
    currentBid?: number | null;
    bidCount?: number;
    endTime?: string | null;
    make?: string;
    model?: string;
    year?: number;
  }>,
): string {
  const listingsSummary = auctions
    .slice(0, 50) // Cap at 50 to stay within token limits
    .map(
      (a, i) =>
        `${i + 1}. [${a.platform}] ${a.title}${a.currentBid != null ? ` - $${a.currentBid.toLocaleString()}` : ''}${a.bidCount ? ` (${a.bidCount} bids)` : ''}`,
    )
    .join('\n');

  return `You are analyzing current online car auction activity across Bring a Trailer, Cars & Bids, and Collecting Cars. Here are the currently active auctions:

${listingsSummary}

Based on these listings, provide a market summary as a JSON object with this structure:

{
  "totalActiveAuctions": <number>,
  "averageBidActivity": <number - average bids per auction>,
  "hotSegments": ["<string - vehicle segments seeing strong bidding activity>"],
  "coolSegments": ["<string - segments with less interest than usual>"],
  "trendingMakes": ["<string - makes attracting the most attention>"],
  "notableAuctions": ["<string - specific auctions worth watching and why>"],
  "summary": "<string - 2-3 paragraph market commentary covering current trends, notable finds, and overall market sentiment>"
}

Respond with ONLY the JSON object, no markdown fences or additional text.`;
}

// ---------------------------------------------------------------------------
// Quick Valuation Prompt (lighter, faster)
// ---------------------------------------------------------------------------

/**
 * Build a quick valuation prompt for a vehicle without full analysis.
 */
export function buildQuickValuationPrompt(
  make: string,
  model: string,
  year: number,
  mileage?: number | null,
): string {
  return `What is the current fair market value range for a ${year} ${make} ${model}${mileage ? ` with ${mileage.toLocaleString()} miles` : ''}?

Respond with ONLY a JSON object:

{
  "lowEstimate": <number in USD>,
  "highEstimate": <number in USD>,
  "medianEstimate": <number in USD>,
  "confidence": "<HIGH|MEDIUM|LOW>",
  "factors": ["<string - key factors affecting value>"],
  "notes": "<string - brief notes on this model's market position>"
}`;
}
