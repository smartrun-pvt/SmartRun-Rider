# BUG_LOG.md — Anti-Regression Checklist
*Historical Registry of Bugs, Root Causes, and Permanent Guardrails*

---

### [x] BUG-001: Dev server failed to bind on launch
- **Root Cause:** Vite process attempted default local-only interface binding without `--host=0.0.0.0` and `--port=3000` specified in `package.json` scripts.
- **Permanent Guardrail:** Always keep `"dev": "vite --port=3000 --host=0.0.0.0"` in `package.json`, and ensure all Express server configurations read `process.env.PORT || 3000` (or 8080 in production) with host `0.0.0.0`.

---

### [x] BUG-002: Two distinct toggle capsules displayed instead of single pill with sliding circle
- **Root Cause:** Previous implementation created a segmented control showing two equal rectangular capsules ("Online" | "Offline") rather than the user's requested single pill track with an internal sliding circular glass button.
- **Permanent Guardrail:** The Online/Offline toggle must be a single cohesive pill track (`rounded-full`), with a single glossy circular slider knob that shifts left and right:
  - When knob is on the **right side**, the left of the pill displays **Online**.
  - When knob is on the **left side**, the right of the pill displays **Offline**.

---

### [x] BUG-003: Floating Dock Layout Shift on Mobile Viewports
- **Root Cause:** Absolute positioning without `viewport-fit=cover` and dynamic safe-area insets caused floating bottom nav overlap on iOS devices.
- **Permanent Guardrail:** Always use `fixed bottom-6 inset-x-0 mx-auto w-fit z-50` with `viewport-fit=cover` in `index.html` `<meta name="viewport">`.

---

### [x] BUG-004: Extraneous dot designs on Online/Offline labels and knob center
- **Root Cause:** Default status indicator dots and an inner knob circle were added, causing visual clutter against the pristine solid toggle design requested.
- **Permanent Guardrail:** Do NOT render status dots next to "Online" or "Offline" text, and do NOT place inner dots in the center of the circular knob. Keep the knob as a pure white circular slider.

---

### [x] BUG-005: Touch swipe gestures hijacking vertical page scrolling
- **Root Cause:** Horizontal touch delta triggers firing during natural vertical list scrolling.
- **Permanent Guardrail:** Enforce a diagonal scroll barrier: only trigger horizontal stage switches when `Math.abs(deltaX) > 40` AND `Math.abs(deltaX) > Math.abs(deltaY) * 1.2`.

---

### [x] BUG-006: Sub-navbar persisting on non-order tabs
- **Root Cause:** Navbar sub-tiers rendered unconditionally leak into other views.
- **Permanent Guardrail:** Wrap the second navbar row in a strict conditional guard `{activeTab === 'order' && (...) }`.

---

### [x] BUG-007: Tab underline misalignment and rectangular artifacts
- **Root Cause:** Rendering borders or background fills on tab buttons contradicts clean text-type tab styling and causes bounding-box clipping during animated transitions.
- **Permanent Guardrail:** Render text-type buttons with no background fills (`bg-transparent`) or rectangular borders. The active indicator must be positioned at `absolute bottom-0 inset-x-0` with `h-[2.5px] bg-emerald-500 rounded-full`, animated smoothly using `motion.div` with `layoutId="activeOrderUnderline"`.

---

### [x] BUG-008: Weekly earnings amount and duty time divergence between day rows and week summary
- **Root Cause:** Individual day rows in `WEEKLY_EARNINGS` had hardcoded amounts and duty minutes that did not sum to the week card totals, itemized breakdowns, or time spent.
- **Permanent Guardrail:** Always derive summary amounts and duty hours dynamically in `WeekEarningsInsideView` via `reduce` across `daysList`. In data stores, ensure all days satisfy mathematical equality: $\sum \text{day.amount} == \text{week.amount}$, $\sum \text{day.dutyMinutes} == \text{week.dutyMinutes}$, and $\text{basePay} + \text{tips} + \text{adjustments} == \text{amount}$.

---

### [x] BUG-009: Duty duration parser dropping day components in cumulative calculations
- **Root Cause:** `parseDutyMinutes` only matched `h` and `m` tokens with regex, causing strings formatted with days (e.g. `10 days 7 hrs` or `5 days 18 hrs`) to drop the day multiplier ($24 \times 60$) and corrupt time aggregations.
- **Permanent Guardrail:** `parseDutyMinutes` must regex-match `(\d+)\s*d(?:ays?)?` and multiply by $1440$ minutes in addition to parsing hours and minutes. Use `formatDutyDaysAndHours` for all month duration displays.

---

### [x] BUG-010: Shift time slots listed out of chronological order with extraneous payout/bonus clutter
- **Root Cause:** Slot definitions were declared out of start-time order (e.g. `07:00 AM - 11:00 AM` after `09:00 AM`, `07:00 PM - 11:00 PM` after `09:00 PM`) and featured expected earnings and surge bonus messages, causing confusion and clutter.
- **Permanent Guardrail:** All shift slot arrays across morning, afternoon, and evening sections must be sorted in strict ascending chronological start-time order. Time slot buttons must remain clean (time range, duration, and tag only), with zero money or bonus type messages.
