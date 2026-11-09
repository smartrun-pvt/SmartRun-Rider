# CHAOS_TESTS.md — Edge-Case & cURL Test Suite
*Adversarial and Edge-Case Test Suite for Smartrun Partner App*

---

## 1. Backend cURL Test Suite (Local & Cloud Run)

### A. Health Check Liveness Probe
```bash
curl -X GET http://localhost:3000/health \
  -H "Accept: application/json" -v
```
- **Expected:** Status `200 OK`, JSON body contains `{ "status": "ok" }`.

### B. Status Update Mutation (Online)
```bash
curl -X PUT http://localhost:3000/api/partner/status \
  -H "Content-Type: application/json" \
  -d '{"isOnline": true}'
```
- **Expected:** Status `200 OK` (when API route is mounted in Phase 2).

### C. Order Stage Transition
```bash
curl -X PATCH http://localhost:3000/api/orders/ord-101/status \
  -H "Content-Type: application/json" \
  -d '{"status": "ready"}'
```
- **Expected:** Status `200 OK`.

---

## 2. Frontend Chaos & Stress Tests

### Test 1: Rapid Toggle Click Storm on Compact Switch
- **Action:** Execute 40 clicks within 2 seconds on the compact solid green/red switch.
- **Pass Criteria:**
  - Knob animates smoothly using spring physics without flying off-bounds (`x: 0` to `x: 62`).
  - Label text fades seamlessly between "Online" and "Offline" without layout thrashing.
  - No frame drop below 55 FPS.

### Test 2: Ultra-Narrow Screen (320px Width) Sub-Navbar Fit
- **Action:** Render the `Order` tab on a 320px mobile viewport (iPhone SE 1st gen).
- **Pass Criteria:**
  - The 3 rectangular stage buttons (`Preparing (3)`, `Ready (2)`, `Picked Up (5)`) fit into `grid-cols-3` without wrapping into extra lines, breaking container bounds, or causing horizontal body overflow.
  - Button text remains legible with `truncate` safety.

### Test 3: Phone Gesture Swipe Accuracy & Diagonal Scroll Protection
- **Action:**
  1. Swipe horizontally left across the main feed area (`deltaX < -40`). Stage advances from `Preparing` to `Ready`.
  2. Swipe horizontally right across the feed area (`deltaX > 40`). Stage returns from `Ready` to `Preparing`.
  3. Perform a vertical scroll drag (`deltaY > 60` with `Math.abs(deltaY) > Math.abs(deltaX)`).
- **Pass Criteria:**
  - Horizontal swipe switches stages with animated Framer Motion transitions.
  - Normal vertical list scrolling is NOT intercepted or blocked by the gesture listener.

### Test 4: Tab Isolation Check (Second Navbar Visibility)
- **Action:** Switch from `Order` tab to `Profile` tab in the floating bottom dock.
- **Pass Criteria:**
  - The second navbar row with the 3 rectangular stage buttons vanishes completely.
  - Returning to `Order` instantly restores the sub-navbar with the active stage preserved.

### Test 5: 3-Tier Month -> Week -> Day Drilldown and Unwind Test
- **Action:**
  1. Click `MONTH` tab in sticky edge-to-edge navbar.
  2. Click `AUGUST 2026` row -> opens `MonthEarningsInsideView` displaying weeks list.
  3. Click `04 Aug-10 Aug` row -> opens `WeekEarningsInsideView` displaying days list.
  4. Click `Sun, 10 Aug` row -> opens `DailyEarningsInsideView` displaying transaction activity.
  5. Click tailless back button: cleanly steps back to `WeekEarningsInsideView`.
  6. Click tailless back button: cleanly steps back to `MonthEarningsInsideView`.
  7. Click tailless back button: returns to main Earnings view.
- **Pass Criteria:**
  - No white-screens or runtime exceptions.
  - Header dynamic title reflects each level's name (`Sun, 10 Aug` -> `04 Aug-10 Aug` -> `AUGUST 2026` -> `EARNINGS`).
  - Total amounts and duty hours across all 3 tiers reconcile with 100% mathematical accuracy.

### Test 6: Shift Time Slots Ascending Order & Clean Booking Verification
- **Action:**
  1. Navigate to `My Shifts` tab from bottom navbar.
  2. Verify that Morning slots appear in strict order: `06:00 AM - 09:00 AM`, `07:00 AM - 11:00 AM`, `09:00 AM - 12:00 PM`.
  3. Verify that Afternoon slots appear in strict order: `12:00 PM - 03:00 PM`, `03:00 PM - 06:00 PM`.
  4. Verify that Evening slots appear in strict order: `06:00 PM - 09:00 PM`, `07:00 PM - 11:00 PM`, `09:00 PM - 12:00 AM`.
  5. Inspect slot buttons: zero rupee amounts (`₹`), zero "Est. payout", and zero bonus/surge tags.
  6. Inspect background visuals: verify transparent blurry Sunrise, Noon Sun, and Night Sundown backgrounds render behind each section without clipping or text obscuration.
  7. Click any slot: confirmation modal opens with clean shift time, duration, and status (no money/bonus). Click confirm: circular tick turns green with checkmark.
- **Pass Criteria:**
  - Clean UI presentation with high contrast readability.
  - Toggling dates in the 5-day rolling strip preserves date-specific booked slot states.
