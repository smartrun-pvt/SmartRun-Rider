# ARCHITECTURE_FLOW.md — Visual System State

```mermaid
graph TD
    subgraph Client ["Client Layer (React 19 + Tailwind v4 + Motion)"]
        A["Top Header Shell"]
        A --> B["Scaled-Down Solid Toggle (Online / Offline)"]
        A --> C["Customer Care Button (Headphones Icon)"]
        A --> SUB_NAV["Sub-Navbar: Order Stages (Preparing | Ready | Picked Up)"]
        
        D["Main Viewport Canvas"]
        D --> SWIPE["Touch Gesture Handler (Swipe Left / Right)"]
        SWIPE --> STAGE_VIEW["Animated Stage Order Cards"]
        
        E["Liquid Glass Floating Dock (Bottom)"]
        E --> F["Order Tab View (Sub-Navbar Visible)"]
        E --> G["Profile Tab View (Sub-Navbar Hidden)"]
    end

    subgraph StateAndEvents ["UI Event & State Machine"]
        B -- "Click (Optimistic UI)" --> S1{"Local isOnline State"}
        S1 -- "Spring Animation" --> S2["Knob Position: Right (Online) / Left (Offline)"]
        
        F -- "Click Sub-Nav or Swipe Screen" --> STAGE_CHANGE{"Active Stage"}
        STAGE_CHANGE --> P1["Preparing (Count)"]
        STAGE_CHANGE --> P2["Ready (Count)"]
        STAGE_CHANGE --> P3["Picked Up (Count)"]
        
        P1 -- "Mark Ready" --> P2
        P2 -- "Mark Picked Up" --> P3
    end

    subgraph Backend ["Google Cloud Run Container (Express + tsx)"]
        PORT_GATE["Port 8080 / Host 0.0.0.0"]
        HEALTH["GET /health (Liveness & Readiness Probe)"]
        STATIC["Express Static Assets (/dist)"]
        FALLBACK["SPA Fallback (index.html)"]
        API_ROUTER["API Router (/api/*)"]
        
        PORT_GATE --> HEALTH
        PORT_GATE --> STATIC
        PORT_GATE --> FALLBACK
        PORT_GATE --> API_ROUTER
    end
```

```mermaid
sequenceDiagram
    autonumber
    actor Partner as Restaurant Partner
    participant UI as React Header & Sub-Nav
    participant Gesture as Touch Gesture Engine
    participant Motion as Framer Motion Engine
    participant State as Order State Store

    Partner->>UI: Selects 'Order' in Floating Dock
    UI->>UI: Mounts Row 2 Sub-Navbar (Preparing, Ready, Picked Up)
    Partner->>Gesture: Swipes finger Right to Left (deltaX < -40)
    Gesture->>State: Advances stage from 'Preparing' to 'Ready'
    State->>Motion: Slide animate cards from right (+12px -> 0px)
    State->>UI: Updates rectangular button active highlight
```

```mermaid
graph TD
    subgraph EarningsNavigation ["3-Tier Earnings Navigation & Drill-Down"]
        MAIN["Main Earnings Dashboard (Daily | Week | Month)"]
        MAIN -- "Select Month (e.g. August)" --> MONTH_VIEW["MonthEarningsInsideView"]
        MONTH_VIEW -- "Select Week (e.g. 04 Aug-10 Aug)" --> WEEK_VIEW["WeekEarningsInsideView"]
        WEEK_VIEW -- "Select Day (e.g. Sun, 10 Aug)" --> DAY_VIEW["DailyEarningsInsideView"]
        
        DAY_VIEW -- "Tailless Back Arrow" --> WEEK_VIEW
        WEEK_VIEW -- "Tailless Back Arrow" --> MONTH_VIEW
        MONTH_VIEW -- "Tailless Back Arrow" --> MAIN
        
        MAIN -- "Select Week Directly" --> DIRECT_WEEK["WeekEarningsInsideView"]
        DIRECT_WEEK -- "Select Day" --> DIRECT_DAY["DailyEarningsInsideView"]
        DIRECT_DAY -- "Back" --> DIRECT_WEEK
        DIRECT_WEEK -- "Back" --> MAIN
    end
```
