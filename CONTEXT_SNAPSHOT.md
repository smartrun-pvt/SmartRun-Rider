# CONTEXT_SNAPSHOT.md — Multi-AI Handoff Brain
*Last Updated: Text-Type Sub-Navbar & Green Horizontal Underline*

## 1. Tech Stack
- **Frontend:** React 19.0.1, TypeScript 7.0, Vite 8.3, Tailwind CSS 4.3, Motion 12.23 (Framer Motion), Lucide Icons
- **Backend:** Node.js, Express 4.21, tsx runtime
- **Deployment Target:** Google Cloud Run (Containerized, Port 8080/3000, Host 0.0.0.0, Stateless)

## 2. Directory Tree
```
/
├── index.html                  # HTML5 entry with mobile viewport-fit=cover
├── package.json                # Dependencies, Cloud Run scripts (start/build/dev)
├── server.ts                   # Express server with /health and SPA static serving
├── src/
│   ├── App.tsx                 # Top Nav, Text Sub-Nav (New Order/Delivered), Swipe, Glass Dock
│   ├── index.css               # Tailwind CSS v4 styling entrypoint
│   └── main.tsx                # React DOM root render
├── tsconfig.json               # TypeScript strict configuration
└── vite.config.ts              # Vite bundle configuration
```

## 3. UI Status: Phase 1 (Completed) vs Phase 2+ (Pending)
- **[COMPLETED] Phase 1 UI:**
  - Top Navbar: On Order page, shows Online/Offline toggle switch (left) and Customer Support button (right) plus New Order/Delivered tabs; on other pages, shows clean text heading. In Earning sub-pages, shows tailless back arrow (no text, no background) with left-aligned dynamic title directly adjacent to it with proper spacing.
  - Second Navbar Row: Text-type buttons (`New Order` & `Delivered`) centered in the middle of the screen with active green horizontal underline; visible ONLY on `Order` tab.
  - Mobile swipe gesture: Horizontal swipe left/right switches between New Order and Delivered with Framer Motion slide animation.
  - Order Tab Canvas: All legacy order cards, swipe hints, status action buttons, and mock item feeds removed from both `New Order` and `Delivered` sub-pages as requested, providing a clean blank canvas ready for new specifications.
  - Docked Mobile Bottom Navigation Bar: Fixed to bottom edge, height `h-16`, 4 evenly divided columns (`grid-cols-4`) with logo on top and label below. Inactive icons and labels are always solid black (`text-black`). Active states feature dedicated tab colors: Green for Order, Beige for Earning, Blue for My Shifts, and Aquamarine for Profile, with zero top horizontal lines.
  - Earnings Dashboard & Sub-Pages: All copy in CAPITAL LETTERS; 2 Top Box cards (INCENTIVES & GUARANTEES, RATE CARD) opening clean sub-pages; Daily Total Card with date cycle `< TODAY, 10 AUG 2026 >` with `<` and `>` arrows (only today shows 'TODAY' text, older days show date only), motivation banner with emoji, delivery rider avatar, and SEE DETAILS opening full daily breakdown page; Payout Status card opening full PAYOUT HISTORY page; edge-to-edge sticky sub-navbar (`DAILY`, `WEEK`, `MONTH`) with solid black text turning orange when active with orange underline; unboxed edge-to-edge item list rows with subtitle text in black normal non-bold font formatted with bullet dot signs (e.g. `• IN PROGRESS • 62 ORDERS` and `• 148HRS • 214 ORDERS`). Daily Inside Page (`DailyEarningsInsideView`) with screen-fitted 4-column filter buttons (`All`, `Order`, `Incentive`, `Adjustment` with zero scrolling), removed tag bar, transparent-background colored status tags, Order ID as main title (merchant names removed), time (no date), left side `Total bill: ₹... • (... items) • Status`, and right side order income, `Minus` tag for negative deductions, and `Adjusted with cash order` tag for cash orders. Week Page (`WeekEarningsInsideView`) matching screenshot `image_c52682fd.png` with top week breakdown card, payout card, and all dates of his work of that week listed in the same unified row design with interactive arrow buttons opening the day's inside page, total earnings, time spent, and two-tier back navigation. Global hidden scrollbars and tailless back arrows used site-wide.
  - Profile tab view displaying restaurant info, operating status, and revenue.
  - Mathematical Reconciliation & Multi-Tier Drilldown: `MonthEarningsInsideView` implements the same design style as the Week page, showing all weeks of that month with interactive chevron arrows, and nested 3-tier drilldown (Month -> Week -> Day -> and back). Top cards, itemized breakdown, and bottom summary rows are dynamically computed from aggregated week records. Cumulative monthly hours automatically convert into days and hours (e.g. `10 days 7 hrs on duty`, `5 days 18 hrs on duty`) so partners do not have to mentally calculate their total work days. Static monthly datasets (`m-1`, `m-2`, `m-3`) audited for exact mathematical identity.
  - My Shifts 5-Day Rolling Calendar & Side-by-Side Month Date Strip: Pinned horizontal date card selector at top of `My Shifts` page displaying exactly 5 upcoming dates (no past dates). Month name is rendered above the respective dates (`OCT`, `NOV`). When dates span across month boundaries (e.g. starting 28 Oct), the next month dates appear side-by-side with their month header above them.
  - My Shifts Time Slots, Ascending Order & Transparent Blurry Backgrounds: Morning (06:00 AM, 07:00 AM, 09:00 AM), Afternoon (12:00 PM, 03:00 PM), and Evening (06:00 PM, 07:00 PM, 09:00 PM) organized in strict ascending chronological order. All money and bonus types removed from buttons for an ultra-clean appearance (time range, duration, and tag only). Each section features a transparent blurry background image: Morning Sunrise (`MorningSunriseBg`), Midday Noon Sun (`NoonSunBg`), and Evening Night Sundown (`NightSundownBg`). Unboxed logo + uppercase heading with horizontal divider line. Button design includes right-aligned circular tick and interactive confirmation popup modal with proper black text, less bold weights, and "Confirm" action button.
- **[PENDING] Phase 2+ Backend & Logic:**
  - Real-time WebSocket or Server-Sent Events (SSE) for live incoming order streaming.
  - REST endpoints for order stage transitions (`PATCH /api/orders/:id/status`).
  - Backend sync for Online/Offline state (`PUT /api/partner/status`).
  - Shift reservation persistence API (`PUT /api/shifts/book`).

## 4. Immediate Next Step
Awaiting user specifications for new order page and delivered page design and components.
