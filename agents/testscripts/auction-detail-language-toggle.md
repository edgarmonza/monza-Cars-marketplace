# Testscript: Auction Detail Language Toggle

Objective
- Verify language switch updates both navbar and auction detail content.

Prerequisites
- Node/npm installed
- App can run locally

Setup
1) Run message/key checks:
   - `node agents/testscripts/i18n-verify.mjs`
   - `node agents/testscripts/i18n-auction-detail-hardcoded.mjs`
2) Start dev server:
   - `npm run dev`

Steps
1) Open an auction detail page in English:
   - `/auctions/1` (or any valid id)
2) Confirm English labels appear in the right rail:
   - `Current Bid` / `Final Price`
   - `Recommended Cap`
   - `Strategy Insights`
3) Use the language toggle in the header and switch to Spanish (`es`).
4) Confirm BOTH navbar and main auction detail labels change (examples):
   - `Oferta actual` / `Precio final`
   - `Tope recomendado`
   - `Insights de estrategia`
5) Switch to German (`de`) and confirm labels change again.
6) Switch to Japanese (`ja`) and confirm labels change again.

Expected
- Main auction detail UI labels and module headings change with locale.
- No hydration errors in console.

Cleanup
- Stop dev server.
