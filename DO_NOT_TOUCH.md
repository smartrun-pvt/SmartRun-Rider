# DO_NOT_TOUCH.md — Locked UI & Core Logic Registry
*Phase 1 Locked Assets — Strictly Protected Against Modification or Regression*

The following files, components, and layout blocks have been verified, styled according to precise user specifications, and are strictly locked. Do NOT modify, restyle, rename, or delete them in future turns without explicit user instruction.

---

## 1. Locked Component Registries

### A. Top Navigation Bar Shell (`src/App.tsx`)
- **Selector:** `header.sticky.top-0`
- **Locked Properties:**
  - `z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80`
  - Height: `h-14 sm:h-16`, bounded by `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
  - Page-Dependent Rendering:
    - **Order Page (`activeTab === 'order'`):** Shows the compact Online/Offline Switch (left) and Customer Support button (right), plus Row 2 with centered New Order / Delivered text tabs.
    - **Other Pages (`earning`, `my_shifts`, `profile`):** Shows ONLY centered text heading (`h1` with "Earning", "My Shifts", or "Profile"). No switch, no help button, no sub-navbar.

### B. Scaled-Down Solid Green/Red Online/Offline Switch (`src/App.tsx`)
- **Selector:** `header button[role="switch"]`
- **Locked Properties:**
  - Compact single pill track: `h-8 w-[94px] rounded-full p-1`
  - Solid Color States:
    - Online: `bg-emerald-500 hover:bg-emerald-600 shadow-[0_3px_10px_rgba(16,185,129,0.32)] focus-visible:ring-emerald-500`
    - Offline: `bg-red-500 hover:bg-red-600 shadow-[0_3px_10px_rgba(239,68,68,0.32)] focus-visible:ring-red-500`
  - Left Label: Solid white `Online` text (`text-[11px] font-bold text-white tracking-tight font-sans`) visible when knob is at the right.
  - Right Label: Solid white `Offline` text (`text-[11px] font-bold text-white tracking-tight font-sans`) visible when knob is at the left.
  - Knob: Solid white circle (`w-6 h-6 rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,0.22)]`), slides between `x: 0` (offline) and `x: 62` (online) via spring physics (`stiffness: 500, damping: 32, mass: 0.8`).
  - No dot designs on labels or knob.

### C. Second Navbar Row (Text-Type Order Tabs) (`src/App.tsx`)
- **Selector:** `header > div.border-t` (Conditional on `activeTab === 'order'`)
- **Locked Properties:**
  - Visible ONLY on the `order` tab; hidden when user navigates to `profile`, `earning`, or `my_shifts`.
  - Layout: `max-w-7xl mx-auto flex items-center justify-center gap-8 sm:gap-12 w-full px-4 sm:px-6` (centered in middle of screen).
  - Design: Pure text-type buttons (NO rectangular boxes or borders around the buttons).
  - Buttons:
    1. `New Order`: Text-type button showing active green horizontal line when active.
    2. `Delivered`: Text-type button showing active green horizontal line when active.
  - Active Indicator: Emerald green horizontal line (`h-[2.5px] bg-emerald-500 rounded-full w-full absolute bottom-0 inset-x-0`) rendered ONLY beneath the active tab. When inactive, no line is shown.
  - Smooth spring transition via `layoutId="activeOrderUnderline"`.
  - **Clean Blank Canvas on Order Pages:** All legacy order list cards, swipe hints, stage action buttons, and mock item feeds have been completely removed from both New Order and Delivered pages, presenting a clean empty canvas.

### D. Customer Care Button & Modal (`src/App.tsx`)
- **Selector:** `header button[title="Customer Support"]`
- **Locked Properties:**
  - Circular icon button with `Headphones` from `lucide-react`
  - Styling: `p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition active:scale-95`
  - Opens dedicated 24/7 partner support modal with helpline and chat.

### E. Phone Swipe Navigation (`src/App.tsx`)
- **Selector:** `main` touch event handlers
- **Locked Properties:**
  - Horizontal swipe left advances between order tabs: `new_order` -> `delivered`.
  - Horizontal swipe right returns: `delivered` -> `new_order`.
  - Touch threshold: `Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2` to protect vertical scrolling.

### F. Docked Bottom Navigation Bar (`src/App.tsx`)
- **Selector:** `nav[aria-label="Bottom Navigation"]`
- **Locked Properties:**
  - Position: `fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]`
  - Dimensions: `max-w-md mx-auto grid grid-cols-4 h-16 px-1 items-center` (height: 64px, perfectly fitted for mobile screens without overflow).
  - Vertical Stacking Design (Logo on top, name below):
    - Each button: `relative flex flex-col items-center justify-center h-full w-full py-1 text-center select-none group`
    - Top Icon (`w-5 h-5`):
      - Inactive: Always solid black (`text-black group-hover:text-black stroke-[1.8]`)
      - Active (Dedicated Tab Colors):
        - Order: Green (`text-emerald-600 scale-105 stroke-[2.2]`)
        - Earning: Beige (`text-[#B08968] scale-105 stroke-[2.2]`)
        - My Shifts: Blue (`text-blue-600 scale-105 stroke-[2.2]`)
        - Profile: Aquamarine (`text-[#0D9488] scale-105 stroke-[2.2]`)
    - Bottom Label (`text-[11px] mt-1 tracking-tight leading-none`):
      - Inactive: Solid black (`font-medium text-black`)
      - Active: Matches tab color in bold (`text-emerald-600`, `text-[#B08968]`, `text-blue-600`, `text-[#0D9488]`)
    - Active Indicator: Purely indicated via colored icon and bold text. No horizontal lines above buttons or icons.
  - Four buttons strictly ordered:
    1. **Order:** Icon `ShoppingBag` (Green when active, Black when inactive), text `Order`
    2. **Earning:** Icon `Wallet` (Beige when active, Black when inactive), text `Earning`
    3. **My Shifts:** Icon `CalendarClock` (Blue when active, Black when inactive), text `My Shifts`
    4. **Profile:** Icon `User` (Aquamarine when active, Black when inactive), text `Profile`

### G. Earnings Dashboard & Full-Page Navigation Architecture (`src/App.tsx`)
- **Locked Properties:**
  - **Capital Letters Requirement:** Entire Earning page copy (headings, badges, card labels, metrics, buttons, motivations) strictly formatted in CAPITAL LETTERS.
  - **Header & Tailless Back Navigation:**
    - Header shows dynamic title matching current sub-page: `INCENTIVES & GUARANTEES`, `RATE CARD`, `WEEK DETAILS`, `PAYOUT HISTORY`, `EARNINGS DETAILS` (or date title), or main `EARNINGS`.
    - In sub-pages (`DAILY`, `WEEK`, `MONTH`, `PAYOUT`, etc.), heading is left-aligned directly next to the tailless back button with a clean spacing gap (`flex items-center gap-3 text-left truncate`) rather than centered in the middle.
    - Back navigation across entire site uses a tailless arrow icon (`ChevronLeft stroke-[2.2]`) WITHOUT text label ("Back") and WITHOUT background pill/container styling.
  - **Top 2 Box Cards:** `INCENTIVES & GUARANTEES` (3D coin stack icon) and `RATE CARD` (3D calendar icon), opening full sub-pages with tailless header back navigation.
  - **Today/Daily Total Earning Card:** Daily date cycle `< TODAY, 10 AUG 2026 >` with interactive arrows (`<` and `>`) to browse past dates (only Today shows 'TODAY' with date, while yesterday and past days show solely the date like `09 AUG 2026`), Total earnings `₹1,010`, duty hours, delivery rider 3D avatar, motivational banner with emoji, and `SEE DETAILS ›` button opening full daily details sub-page.
  - **Payout Notice Card:** `NO PAYOUT TRANSFERRED DUE TO NO EARNINGS` with `PAYOUT HISTORY ›` button opening full `PAYOUT HISTORY` sub-page.
  - **Edge-to-Edge Sticky Sub-Navbar (`grid grid-cols-3`):**
    - Removed card box wrapper; elements touch both edges of the phone screen (`-mx-4 sm:-mx-6 lg:-mx-8`).
    - Direct parent of `DAILY`, `WEEK`, and `MONTH` buttons (`sticky top-14 sm:top-16 z-30 bg-white border-y border-slate-200/90 shadow-xs`).
    - Stays pinned beneath the main header when scrolling down.
    - Buttons always display in solid black text (`text-black`), switching to vibrant orange text (`text-orange-500 font-black`) with orange horizontal underline (`bg-orange-500`) when active.
  - **Unboxed Edge-to-Edge List:** Item rows touch both sides of screen, scroll naturally, and display period date, subtitle in solid black normal non-bold text (`text-black font-normal`) formatted with bullet dot signs (e.g. `• IN PROGRESS • 62 ORDERS`, `• 148HRS • 214 ORDERS`, `• 32HRS • 48 ORDERS`), calculated amount, and orange chevron arrow.
  - **Sub-Page Navigation & Daily Inside Page (`DailyEarningsInsideView`):**
    - Clicking 'SEE DETAILS' or clicking any daily row opens the Daily Inside Page.
    - **Header:** Sticky header with tailless back button (`ChevronLeft`) and left-aligned title.
    - **Top Card:** Centered date (`Wed, 06 Aug`), bold amount (`₹1,008`), duty hours (`27m on duty` with clock icon), dashed horizontal divider with centered downward chevron circle icon, and itemized rows: Order Earnings (`₹50`), Customer Tips (`₹1,020`), Adjustments (`- ₹62`).
    - **Filter Buttons (Screen-Fitted):** `All`, `Order`, `Incentive`, `Adjustment` buttons styled in a 4-column responsive grid (`grid-cols-4`) perfectly fitting mobile phone width with zero scrolling (active: solid black background with white text; inactive: white background with light border).
    - **Tag Strip Removed:** The tag strip (Surge, Rain, Tip, XL Order) is permanently removed from the daily view.
    - **Transaction Activity List:**
      - Separated by dashed dividers.
      - **Zero Background Badges:** All badges (`Rejected`, `Surge`, `Tip`, `Rain`, `XL Order`, `Cash`, `Credited`) have background colors removed and use clean, prominent colored text.
      - **Order Item Detail Transparency:** Orders remove merchant names (Pizza Hut, Burger King); main heading displays Order ID (e.g. `Order #OD-7821`) and time (not date). Below it on the left side: `Total bill: ₹890 • (3 items) • Delivered/Rejected`. On the right side: partner's order income with chevron, `Minus` tag for negative amounts, `Adjusted with cash order` tag for cash orders, and colored text badges for Surge/Tip/Rain.
      - Deductions & adjustments clearly itemized (e.g. TDS Deductions `- ₹2` with `Minus` tag, Rejection Penalty `- ₹30` with `Minus` tag).
    - For Weekly and Monthly detail views, displays full itemized calculation breakdown.
  - **Week Page (`WeekEarningsInsideView`):**
    - Faithfully mirrors screenshot (`image_c52682fd.png`).
    - **Header:** Sticky header with tailless back button (`ChevronLeft`) and left-aligned title.
    - **Top Card:** Centered week date range (e.g. `04 Aug-10 Aug`), dynamically computed total amount (`₹9,776`), duty hours (`8h 24m on duty` with clock icon), dashed divider with centered downward chevron circle icon, Order Earnings (`₹7,020`), Customer Tips (`₹3,010`), Adjustments (`- ₹254`).
    - **Mathematical Accuracy Guarantee:** The sum of all individual day row amounts in a week MUST exactly equal the top card and bottom summary total earnings; the sum of all individual day duty minutes MUST exactly equal the top card and bottom summary duty hours; and Order Earnings + Customer Tips + Adjustments MUST exactly equal the total earnings. Handled dynamically via `reduce` across `daysList`.
    - **This Week Payout Card:** Shows `This week payout: 04 Aug-10 Aug` with payout amount.
    - **Daily Breakdown & Week Total Section:**
      - Lists all dates of work for that week in the exact same design: date on left with duty hours, amount on right, and circular orange arrow button (`ChevronRight`).
      - **Interactive Day Navigation:** Clicking any date row opens that day's complete page (`DailyEarningsInsideView`). The tailless back button returns cleanly to the week page, and a subsequent back click returns to the main Earnings view.
  - **Month Page (`MonthEarningsInsideView`):**
    - Similar design style as the Week page (`WeekEarningsInsideView`).
    - **Header:** Sticky header with tailless back button (`ChevronLeft`) and left-aligned title.
    - **Top Card:** Centered month title (e.g. `AUGUST 2026`), dynamically computed total amount (`₹14,616`), duty hours converted to days and hours (e.g. `1 day 2 hrs 44m on duty`, `5 days 18 hrs on duty` with clock icon), dashed divider with centered downward chevron circle icon, Order Earnings (`₹10,620`), Customer Tips (`₹4,320`), Adjustments (`- ₹324`).
    - **Duty Time Days & Hours Conversion Rule:** In monthly views and dashboard list subtitles, cumulative hours are automatically converted into days and hours format (e.g. `10 days 7 hrs on duty`, `5 days 18 hrs on duty`) so delivery partners do not have to mentally calculate how many days of work they have performed.
    - **This Month Payout Card:** Shows `This month payout: AUGUST 2026` with payout amount.
    - **Weekly Breakdown & Month Total Section:**
      - Lists all weeks of that month in the same design style: week date range on left with duty hours (formatted via `formatDutyDaysAndHours`) and order count (e.g. `04 Aug-10 Aug` • `8h 24m on duty • 28 orders`), amount on right (`₹9,776`), and circular orange arrow button (`ChevronRight`).
      - **Interactive 3-Tier Drill-Down Navigation:** Clicking any week opens that week's complete inside page (`WeekEarningsInsideView`), where clicking any day row opens that day's complete inside page (`DailyEarningsInsideView`).
      - Back navigation cleanly walks back up the tiers: Day -> Week -> Month -> Main Earnings.
      - Dashed divider, `Total earnings`, dotted divider, `Time spent` (formatted in days and hours).
  - **Global Hidden Scrollbar:** Scrollbars are completely hidden across all views and browsers in the entire app while retaining full smooth scrolling.

### I. My Shifts 5-Day Rolling Calendar & Side-by-Side Month Date Strip (`src/App.tsx`)
- **Selector:** `div#root main > div > div.overflow-x-auto button` and its header container
- **Locked Properties:**
  - **No Past Dates & 5-Date Rolling Window:** Past dates are completely omitted. Exactly 5 upcoming dates (current date + next 4 future dates) are rendered.
  - **Month Name Above Groups:** Month name displayed in uppercase (`OCT`, `NOV`, etc.) directly above the corresponding month's date cards.
  - **Side-by-Side Cross-Month Rendering:** When the 5-day window spans into the next month (e.g. from 28 Oct onwards), the next month's date cards (e.g. `01 Nov`) render seamlessly side-by-side with their month header (`NOV`) placed above them.
  - **User-Side Controls Removed:** Month navigation chevrons (`<` and `>`) and the `Current Month` tag badge have been removed from the user side.
  - **Vertical Stack Structure Inside Each Card:**
    - **Top:** Date number (e.g. `23` or `28` rendered with `text-lg sm:text-xl font-bold tracking-tight leading-none`).
    - **Bottom:** Accurate day of the week in all-caps text (e.g. `FRI`, `WED` rendered with `text-[11px] font-bold tracking-wider uppercase mt-1 leading-none`).
  - **State & Styling:**
    - Selected card: `bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/20 scale-[1.02]` with day label in `text-emerald-100`.
    - Current day (Today) when not selected: subtle emerald highlight `bg-emerald-50/60 border-emerald-200` with emerald dot indicator.
    - Inactive cards: `bg-white border-slate-200/90 text-slate-800 hover:border-slate-300 hover:bg-slate-50/80` with day label in `text-slate-400`.
  - **Strict Scope Discipline:** Clean top-aligned layout with zero unwanted placeholders, test buttons, or filler content below it.

### J. My Shifts Time Slots, Ascending Order, Transparent Blurry Backgrounds & Confirmation Modal (`src/App.tsx`)
- **Selector:** `div#root main > div > div:nth-of-type(2)` and modal `div.fixed.inset-0.z-50`
- **Locked Properties:**
  - **Per-Date Shift Persistence:** Each date in the 5-day rolling window (`activeShiftId`) maintains its own booked shift slots dictionary in `bookedSlotsByDate`.
  - **Strict Ascending Order Period Divisions:**
    - **Morning (3 slots):** `06:00 AM - 09:00 AM`, `07:00 AM - 11:00 AM`, `09:00 AM - 12:00 PM`.
    - **Afternoon (2 slots):** `12:00 PM - 03:00 PM`, `03:00 PM - 06:00 PM`.
    - **Evening (3 slots):** `06:00 PM - 09:00 PM`, `07:00 PM - 11:00 PM`, `09:00 PM - 12:00 AM`.
  - **Transparent Blurry Background Images:**
    - Each section wrapper features a transparent, blurry background graphic:
      - Morning: Dawn sunrise horizon with warm golden rays (`MorningSunriseBg`).
      - Afternoon: Midday high noon sun with corona flares and cumulus accents (`NoonSunBg`).
      - Evening: Twilight sundown with descending sun, sunset horizon, and stars (`NightSundownBg`).
    - Styled with `opacity-40` to `opacity-45`, `blur-[2.5px]`, and soft scrim white overlay to ensure perfect legibility.
  - **Unboxed Heading Structure (NO CARD IN HEADING):**
    - Headings must NOT use card enclosures or backgrounds.
    - Pure image/logo (`Sunrise` for morning, `Sun` for afternoon, `Sunset` for evening) + uppercase text (`Morning`, `Afternoon`, `Evening`).
    - Pinned horizontal line (`border-b border-slate-200/80`) directly below each heading.
  - **Clean Time Slot Buttons (ZERO MONEY, ZERO BONUS):**
    - Removed all expected earnings/rupee values (`₹...`), "Est. payout", and bonus/incentive messages (`+₹40...`, surge, Peak Demand).
    - Left side displays bold time range + duration and tag separated by bullet dot (e.g. `06:00 AM - 09:00 AM` • `3 hrs • Breakfast Shift`).
    - **Circle Tick Design:** Empty circular border (`w-6 h-6 rounded-full border-2 border-slate-300 bg-white`) when unpicked; filled green circle (`w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center`) with checkmark (`Check`) when picked.
    - Active card styling: `bg-emerald-50/95 border-emerald-500` when booked.
  - **Confirmation Popup Modal:**
    - Interactive dialog confirming time slot booking with shift summary, duration & tag, date, and booking status (clean of money and bonus fields).
    - Typography & Palette: Uses less bold text (`font-semibold` header, `font-medium` values, `font-normal` details and helper text) rendered in proper black (`text-black`, `text-black/70`, `text-black/60`).
    - Action buttons: "Confirm" (emerald `bg-emerald-600 hover:bg-emerald-700 text-white font-medium`) or "Cancel" (red `bg-red-500 hover:bg-red-600 text-white font-medium`) if already booked, plus "Dismiss" (`text-black font-normal`).
    - Animated feedback toast confirming slot updates.

---

## 2. Infrastructure & Configuration Locks
- `vite.config.ts`: Must retain Tailwind CSS integration and port bindings.
- `src/index.css`: Tailwind v4 `@import "tailwindcss";` must not be replaced with legacy CSS.
- `server.ts`: Production Express server configured to serve Vite `dist` and health check.
