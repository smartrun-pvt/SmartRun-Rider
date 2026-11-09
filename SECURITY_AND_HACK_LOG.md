# SECURITY_AND_HACK_LOG.md — Adversarial Red-Team Checklist
*Adversarial Analysis of Phase 1 UI & Cloud Run Architecture*

---

## 1. Vulnerabilities Identified & Remediations

### VULN-001: Rapid Double-Click & Toggle Race Condition
- **Attack Vector:** An automated script or jittery user clicks the Online/Offline button 50 times in 1 second.
- **Risk:** Without debouncing or optimistic locking, out-of-order network responses could leave the backend in the opposite state of the UI knob, causing unexpected customer orders while the partner believes they are offline.
- **Defense Implemented:** 
  1. UI optimistic state updates with debounced API dispatch (350ms lead time).
  2. In-flight request cancellation using `AbortController`.
  3. Server-side idempotency using an incrementing revision timestamp.

### VULN-002: Container Filesystem State Mutability (Cloud Run Anti-Pattern)
- **Attack Vector:** An attacker exhausts disk space or crashes containers by having the backend write local session files, logs, or profile picture uploads to the container's ephemeral root filesystem.
- **Risk:** Memory exhaustion, container instance eviction, and lost session state across auto-scaled Cloud Run instances.
- **Defense Implemented:**
  1. Strictly stateless server design in `server.ts`.
  2. No writable local directories permitted in production.
  3. All asset uploads and sessions will be offloaded to Cloud Storage and external managed databases.

### VULN-003: Client-Side Status Spoofing
- **Attack Vector:** An unauthenticated or unauthorized user alters `localStorage` or manipulates client state to force `isOnline: true`.
- **Risk:** Partner appears online to customers even if their account is suspended or billing payment is past due.
- **Defense Implemented:**
  1. Server authoritative status enforcement: backend rejects store orders if the database record is offline.
  2. Session validation on every status mutation endpoint.

### VULN-004: Inconsistent Multi-Tier Navigation History & Deep State Trapping
- **Attack Vector:** Rapid switching across tabs (`daily`, `week`, `month`) while deep in a nested drilldown (`Month -> Week -> Day`), leaving dangling child state pointers.
- **Risk:** Unhandled null references, incorrect header titles, or trapped UI state where back navigation cannot return to root.
- **Defense Implemented:** 
  1. Cascading state sanitization in all period tab switchers and main list click handlers (`setSelectedDayFromWeek(null)`, `setSelectedWeekFromMonth(null)`).
  2. Strict single-step stepback logic in the header tailless back button (`Day -> Week -> Month -> Main`).

### VULN-005: Visual Contrast Degradation & Fragile Image CDN Exposure
- **Attack Vector:** External image URLs failing due to ad-blockers, offline network states, or rate limits; or low-opacity photographic backdrops washing out high-priority shift booking text.
- **Risk:** Broken image icons, UI rendering stalls, or unreadable shift times failing WCAG AA legibility standards.
- **Defense Implemented:**
  1. Zero external network dependencies: All sunrise, noon sun, and night sundown backgrounds are self-contained vector SVGs with embedded gradients and CSS blur filters.
  2. Multi-layer contrast protection: Container uses an atmospheric white veil (`bg-white/40`), and slot buttons use `bg-white/90 backdrop-blur-xs` with dark slate typography (`text-slate-900`), delivering a 10:1+ contrast ratio.
  3. Booking state integrity: Date-isolated persistence in `bookedSlotsByDate[dateId]` prevents cross-date slot state contamination.
