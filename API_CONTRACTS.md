# API_CONTRACTS.md — Strict Schema Lock
*Contracts defining request/response shapes between Phase 1 UI and Phase 2 Backend*

---

## 1. Cloud Run Health Check
- **Endpoint:** `GET /health`
- **Purpose:** Cloud Run container startup probe and liveness check.
- **Response `200 OK`:**
```json
{
  "status": "ok",
  "service": "smartrun-partner-app",
  "timestamp": "2026-10-22T19:25:00.000Z",
  "uptime": 124.5
}
```

---

## 2. Partner Store Status (Online / Offline Toggle)
- **Endpoint:** `PUT /api/partner/status`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer <session-token>`
- **Request Body:**
```json
{
  "isOnline": true
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "partnerId": "ptr_9921448",
  "isOnline": true,
  "updatedAt": "2026-10-22T19:25:02.120Z",
  "message": "Store status is now Online. Ready to receive orders."
}
```

---

## 3. Order Stage Transition (Preparing -> Ready -> Delivered)
- **Endpoint:** `PATCH /api/orders/:id/status`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer <session-token>`
- **Request Body:**
```json
{
  "status": "delivered"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "orderId": "ord-101",
  "status": "delivered",
  "updatedAt": "2026-10-22T19:26:15.000Z"
}
```

---

## 4. UI TypeScript Data Models
```typescript
export type TabType = 'order' | 'earning' | 'my_shifts' | 'profile';
export type OrderCategory = 'new_order' | 'delivered';
export type OrderItemStatus = 'preparing' | 'ready' | 'delivered';

export interface OrderItem {
  name: string;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  placedAt: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderItemStatus;
  deliveryPartner?: string;
  otp?: string;
}

export interface PartnerStatusPayload {
  isOnline: boolean;
  partnerId?: string;
}

export interface PartnerStatusResponse {
  success: boolean;
  partnerId: string;
  isOnline: boolean;
  updatedAt: string;
  message: string;
}

export interface CustomerCareContact {
  hotline: string;
  supportChatUrl: string;
  partnerId: string;
}

export interface WeekDayRecord {
  id: string;
  title: string;
  amount: number;
  dutyHours: string;
  basePay?: number;
  tips?: number;
  adjustments?: number;
}

export interface EarningBreakdownItem {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  basePay: number;
  surgePay: number;
  tips: number;
  incentive: number;
  ordersCount: number;
  dutyHours: string;
  adjustments?: number;
  payout?: number;
export interface ShiftTimeSlot {
  id: string;
  period: 'morning' | 'afternoon' | 'evening';
  timeRange: string;
  duration: string;
  tag: string;
}

export interface ShiftDayItem {
  id: string;
  dateNum: number;
  dayName: string;
  monthShort: string;
  year: number;
  isToday: boolean;
}
```

---

## 5. Shift Slot Booking & Persistence
- **Endpoint:** `PUT /api/shifts/book`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer <session-token>`
- **Request Body:**
```json
{
  "dateId": "2026-10-24",
  "slotId": "morn-1",
  "action": "book"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "dateId": "2026-10-24",
  "bookedSlotIds": ["morn-1"],
  "updatedAt": "2026-10-24T12:55:00.000Z"
}
```
