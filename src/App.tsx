import { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  User,
  Headphones,
  Clock,
  CheckCircle2,
  PackageCheck,
  ChevronRight,
  ChevronLeft,
  Phone,
  MessageSquare,
  X,
  Store,
  MapPin,
  Calendar,
  AlertCircle,
  Check,
  Wallet,
  CalendarClock,
  ChevronDown,
  Sunrise,
  Sun,
  Sunset,
  Sparkles,
} from 'lucide-react';

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

const INITIAL_ORDERS: Order[] = [];

// 3D Coin Stack Icon for Incentives & Guarantees
function CoinStack3DIcon() {
  return (
    <svg width="46" height="46" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="26" cy="46" rx="16" ry="6" fill="#F59E0B" />
      <path d="M10 40C10 40 10 46 26 46C42 46 42 40 42 40V46C42 49.3 34.8 52 26 52C17.2 52 10 49.3 10 46V40Z" fill="#D97706" />
      <ellipse cx="26" cy="38" rx="16" ry="6" fill="#FBBF24" />
      <path d="M10 32C10 32 10 38 26 38C42 38 42 32 42 32V38C42 41.3 34.8 44 26 44C17.2 44 10 41.3 10 38V32Z" fill="#D97706" />
      <ellipse cx="26" cy="30" rx="16" ry="6" fill="#FCD34D" />
      <path d="M10 24C10 24 10 30 26 30C42 30 42 24 42 24V30C42 33.3 34.8 36 26 36C17.2 36 10 33.3 10 30V24Z" fill="#F59E0B" />
      <ellipse cx="26" cy="22" rx="16" ry="6" fill="#FEF08A" />
      <ellipse cx="44" cy="36" rx="12" ry="12" fill="#F59E0B" />
      <ellipse cx="44" cy="36" rx="10.5" ry="10.5" fill="#FCD34D" />
      <text x="44" y="40.5" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#78350F" fontFamily="sans-serif">₹</text>
    </svg>
  );
}

// 3D Flip Calendar Icon for Rate Card
function Calendar3DIcon() {
  return (
    <svg width="46" height="46" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 46L30 20L48 46H14Z" fill="#818CF8" />
      <path d="M16 46L32 24L48 46H16Z" fill="#A5B4FC" />
      <rect x="16" y="24" width="34" height="24" rx="4" transform="rotate(-6 16 24)" fill="#FDA4AF" />
      <rect x="18" y="22" width="34" height="24" rx="4" transform="rotate(-3 18 22)" fill="#FFFFFF" />
      <rect x="18" y="22" width="34" height="6" rx="2" transform="rotate(-3 18 22)" fill="#FB7185" />
      <circle cx="23" cy="20" r="1.5" fill="#E11D48" />
      <circle cx="31" cy="19.5" r="1.5" fill="#E11D48" />
      <circle cx="39" cy="19" r="1.5" fill="#E11D48" />
      <circle cx="47" cy="18.5" r="1.5" fill="#E11D48" />
      <line x1="24" y1="32" x2="44" y2="31" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="37" x2="40" y2="36" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Delivery Rider Avatar Icon matching design
function RiderAvatarIcon({ className = 'w-14 h-14' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="#D1FAE5" />
      <path d="M16 54C16 45 22 42 32 42C42 42 48 45 48 54H16Z" fill="#10B981" />
      <circle cx="32" cy="34" r="12" fill="#FBBF24" />
      <path d="M20 30C19 36 21 40 22 40" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
      <path d="M44 30C45 36 43 40 42 40" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
      <path d="M19 28C19 20 24 16 32 16C40 16 45 20 45 28C45 29 44 30 42 30H22C20 30 19 29 19 28Z" fill="#EF4444" />
      <circle cx="32" cy="22" r="2.5" fill="#FCD34D" />
      <rect x="23" y="28" width="8" height="6" rx="2" fill="#111827" />
      <rect x="33" y="28" width="8" height="6" rx="2" fill="#111827" />
      <line x1="30" y1="30" x2="34" y2="30" stroke="#111827" strokeWidth="2" />
      <path d="M28 39C29.5 41 34.5 41 36 39" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export interface WeeklyEarningRecord {
  range: string;
  label: string;
  total: number;
  duty: string;
  goalMsg: string;
  goalEmoji: string;
  ordersCount: number;
  basePay: number;
  surgePay: number;
  tips: number;
  incentive: number;
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
  days?: WeekDayRecord[];
  weeks?: EarningBreakdownItem[];
}

export interface DailyEarningHeaderRecord {
  date: string;
  label: string;
  total: number;
  duty: string;
  goalMsg: string;
  goalEmoji: string;
  ordersCount: number;
  basePay: number;
  surgePay: number;
  tips: number;
  incentive: number;
  adjustments?: number;
}

export interface DailyTransactionItem {
  id: string;
  title: string;
  timestamp: string;
  amount: number;
  category: 'orders' | 'incentives' | 'adjustments';
  badge?: 'surge' | 'rain' | 'tip' | 'xl';
  status?: string;
  isRejected?: boolean;
  orderId?: string;
  date?: string;
  paymentMode?: 'online' | 'cash';
  itemTotal?: number;
  itemCount?: number;
}

const SAMPLE_DAILY_TRANSACTIONS: DailyTransactionItem[] = [
  {
    id: 'tx-1',
    title: 'TDS Deductions - Week 31_2025',
    date: '06 Aug 2026',
    timestamp: '01:50 AM',
    amount: -2,
    category: 'adjustments',
  },
  {
    id: 'tx-2',
    title: 'Pizza Hut',
    orderId: 'Order #OD-4412',
    date: '06 Aug 2026',
    timestamp: '12:18 AM',
    amount: 0,
    category: 'orders',
    isRejected: true,
    status: 'Rejected',
    paymentMode: 'online',
    itemTotal: 650,
    itemCount: 2,
  },
  {
    id: 'tx-3',
    title: 'Rejection Penalty',
    date: '06 Aug 2026',
    timestamp: '12:18 AM',
    amount: -30,
    category: 'adjustments',
  },
  {
    id: 'tx-4',
    title: 'Burger King - Indiranagar',
    orderId: 'Order #OD-7821',
    date: '06 Aug 2026',
    timestamp: '10:45 PM',
    amount: 340,
    category: 'orders',
    badge: 'surge',
    status: 'Delivered',
    paymentMode: 'online',
    itemTotal: 890,
    itemCount: 3,
  },
  {
    id: 'tx-5',
    title: 'KFC Express Delivery',
    orderId: 'Order #OD-8842',
    date: '06 Aug 2026',
    timestamp: '09:15 PM',
    amount: 420,
    category: 'orders',
    badge: 'tip',
    status: 'Delivered',
    paymentMode: 'cash',
    itemTotal: 1240,
    itemCount: 4,
  },
  {
    id: 'tx-6',
    title: 'Dominos Pizza Hot & Fresh',
    orderId: 'Order #OD-9923',
    date: '06 Aug 2026',
    timestamp: '08:45 PM',
    amount: 248,
    category: 'orders',
    badge: 'rain',
    status: 'Delivered',
    paymentMode: 'cash',
    itemTotal: 680,
    itemCount: 2,
  },
  {
    id: 'tx-7',
    title: 'Peak Rain Surge Incentive',
    date: '06 Aug 2026',
    timestamp: '08:30 PM',
    amount: 60,
    category: 'incentives',
    badge: 'rain',
    status: 'Credited',
  },
  {
    id: 'tx-8',
    title: 'Evening Milestone Bonus',
    date: '06 Aug 2026',
    timestamp: '07:15 PM',
    amount: 110,
    category: 'incentives',
    status: 'Credited',
  },
  {
    id: 'tx-9',
    title: 'Late Delivery Penalty',
    date: '06 Aug 2026',
    timestamp: '06:30 PM',
    amount: -30,
    category: 'adjustments',
  },
];

const DAILY_HEADER_DATA: DailyEarningHeaderRecord[] = [
  {
    date: 'TODAY, 10 AUG 2026',
    label: "TODAY'S EARNING",
    total: 1008,
    duty: '27m on duty',
    goalMsg: "GOOD JOB! YOU'RE DOING GREAT TODAY!",
    goalEmoji: '🤑',
    ordersCount: 4,
    basePay: 50,
    surgePay: 0,
    tips: 1020,
    incentive: 0,
    adjustments: -62,
  },
  {
    date: '09 AUG 2026',
    label: 'DAILY EARNING',
    total: 1450,
    duty: '1h 20m on duty',
    goalMsg: 'TARGET ACHIEVED! COMPLETED ALL PEAK SLOTS!',
    goalEmoji: '🌟',
    ordersCount: 7,
    basePay: 1100,
    surgePay: 100,
    tips: 280,
    incentive: 0,
    adjustments: -30,
  },
  {
    date: '08 AUG 2026',
    label: 'DAILY EARNING',
    total: 2180,
    duty: '2H 15M ON DUTY',
    goalMsg: 'FANTASTIC WEEKEND RUN! HIGH CUSTOMER TIPS!',
    goalEmoji: '🔥',
    ordersCount: 10,
    basePay: 1600,
    surgePay: 320,
    tips: 140,
    incentive: 120,
  },
  {
    date: '07 AUG 2026',
    label: 'DAILY EARNING',
    total: 1820,
    duty: '1H 50M ON DUTY',
    goalMsg: 'STEADY RHYTHM! ZERO CANCELLED ORDERS!',
    goalEmoji: '⚡',
    ordersCount: 9,
    basePay: 1400,
    surgePay: 240,
    tips: 90,
    incentive: 90,
  },
  {
    date: '06 AUG 2026',
    label: 'DAILY EARNING',
    total: 1240,
    duty: '1H 10M ON DUTY',
    goalMsg: 'MID-WEEK SLOTS CLEARED WITH FULL RATING!',
    goalEmoji: '👍',
    ordersCount: 6,
    basePay: 980,
    surgePay: 140,
    tips: 60,
    incentive: 60,
  },
  {
    date: '05 AUG 2026',
    label: 'DAILY EARNING',
    total: 860,
    duty: '45M ON DUTY',
    goalMsg: 'GOOD START! ON-TIME PICKUPS REWARDED!',
    goalEmoji: '💪',
    ordersCount: 3,
    basePay: 680,
    surgePay: 90,
    tips: 40,
    incentive: 50,
  },
];

const WEEKLY_DATA: WeeklyEarningRecord[] = [
  {
    range: '04 AUG-10 AUG',
    label: 'THIS WEEK',
    total: 1010,
    duty: '27M ON DUTY',
    goalMsg: "GOOD JOB! YOU'RE DOING GREAT THIS WEEK!",
    goalEmoji: '🤑',
    ordersCount: 4,
    basePay: 780,
    surgePay: 120,
    tips: 50,
    incentive: 60,
  },
  {
    range: '28 JUL-03 AUG',
    label: 'PAST WEEK',
    total: 7650,
    duty: '32H 15M ON DUTY',
    goalMsg: 'TARGET ACHIEVED! OUTSTANDING CONSISTENCY!',
    goalEmoji: '🌟',
    ordersCount: 48,
    basePay: 5600,
    surgePay: 950,
    tips: 420,
    incentive: 680,
  },
  {
    range: '21 JUL-27 JUL',
    label: 'PAST WEEK',
    total: 8420,
    duty: '35H 50M ON DUTY',
    goalMsg: 'HIGHEST WEEKLY PAYOUT RECORDED THIS MONTH!',
    goalEmoji: '🔥',
    ordersCount: 52,
    basePay: 6100,
    surgePay: 1120,
    tips: 510,
    incentive: 690,
  },
];

const DAILY_EARNINGS: EarningBreakdownItem[] = [
  {
    id: 'd-1',
    title: 'WED, 06 AUG',
    subtitle: '• 27MIN • 4 ORDERS',
    amount: 1008,
    basePay: 50,
    surgePay: 0,
    tips: 1020,
    incentive: 0,
    adjustments: -62,
    ordersCount: 4,
    dutyHours: '27m',
  },
  {
    id: 'd-2',
    title: 'TUE, 05 AUG',
    subtitle: '• 1.3HRS • 7 ORDERS',
    amount: 1450,
    basePay: 1100,
    surgePay: 100,
    tips: 280,
    incentive: 0,
    adjustments: -30,
    ordersCount: 7,
    dutyHours: '1h 20m',
  },
  {
    id: 'd-3',
    title: 'MON, 04 AUG',
    subtitle: '• 45MIN • 3 ORDERS',
    amount: 860,
    basePay: 680,
    surgePay: 40,
    tips: 160,
    incentive: 0,
    adjustments: -20,
    ordersCount: 3,
    dutyHours: '45m',
  },
  {
    id: 'd-4',
    title: 'SUN, 03 AUG',
    subtitle: '• 2.6HRS • 12 ORDERS',
    amount: 2340,
    basePay: 1750,
    surgePay: 150,
    tips: 490,
    incentive: 0,
    adjustments: -50,
    ordersCount: 12,
    dutyHours: '2h 40m',
  },
];

const WEEKLY_EARNINGS: EarningBreakdownItem[] = [
  {
    id: 'w-1',
    title: '04 Aug-10 Aug',
    subtitle: '• IN PROGRESS • 28 ORDERS',
    amount: 9776,
    basePay: 7020,
    surgePay: 0,
    tips: 3010,
    incentive: 0,
    adjustments: -254,
    ordersCount: 28,
    dutyHours: '8h 24m on duty',
    payout: 0,
    days: [
      {
        id: 'w1-d7',
        title: 'Sun, 10 Aug',
        amount: 1008,
        dutyHours: '27m on duty',
        basePay: 50,
        tips: 1020,
        adjustments: -62,
      },
      {
        id: 'w1-d6',
        title: 'Sat, 09 Aug',
        amount: 1450,
        dutyHours: '1h 20m on duty',
        basePay: 1200,
        tips: 280,
        adjustments: -30,
      },
      {
        id: 'w1-d5',
        title: 'Fri, 08 Aug',
        amount: 2180,
        dutyHours: '2h 15m on duty',
        basePay: 2060,
        tips: 140,
        adjustments: -20,
      },
      {
        id: 'w1-d4',
        title: 'Thu, 07 Aug',
        amount: 1820,
        dutyHours: '1h 50m on duty',
        basePay: 1740,
        tips: 110,
        adjustments: -30,
      },
      {
        id: 'w1-d3',
        title: 'Wed, 06 Aug',
        amount: 1008,
        dutyHours: '27m on duty',
        basePay: 50,
        tips: 1020,
        adjustments: -62,
      },
      {
        id: 'w1-d2',
        title: 'Tue, 05 Aug',
        amount: 1450,
        dutyHours: '1h 20m on duty',
        basePay: 1200,
        tips: 280,
        adjustments: -30,
      },
      {
        id: 'w1-d1',
        title: 'Mon, 04 Aug',
        amount: 860,
        dutyHours: '45m on duty',
        basePay: 720,
        tips: 160,
        adjustments: -20,
      },
    ],
  },
  {
    id: 'w-2',
    title: '28 Jul-03 Aug',
    subtitle: '• 32HRS • 48 ORDERS',
    amount: 7650,
    basePay: 5780,
    surgePay: 0,
    tips: 1980,
    incentive: 0,
    adjustments: -110,
    ordersCount: 48,
    dutyHours: '32h on duty',
    payout: 7650,
    days: [
      {
        id: 'w2-d7',
        title: 'Sun, 03 Aug',
        amount: 1840,
        dutyHours: '6h 40m on duty',
        basePay: 1350,
        tips: 520,
        adjustments: -30,
      },
      {
        id: 'w2-d6',
        title: 'Sat, 02 Aug',
        amount: 1620,
        dutyHours: '6h 15m on duty',
        basePay: 1200,
        tips: 440,
        adjustments: -20,
      },
      {
        id: 'w2-d5',
        title: 'Fri, 01 Aug',
        amount: 1380,
        dutyHours: '5h 25m on duty',
        basePay: 1050,
        tips: 350,
        adjustments: -20,
      },
      {
        id: 'w2-d4',
        title: 'Thu, 31 Jul',
        amount: 990,
        dutyHours: '4h 10m on duty',
        basePay: 760,
        tips: 240,
        adjustments: -10,
      },
      {
        id: 'w2-d3',
        title: 'Wed, 30 Jul',
        amount: 750,
        dutyHours: '3h 30m on duty',
        basePay: 580,
        tips: 180,
        adjustments: -10,
      },
      {
        id: 'w2-d2',
        title: 'Tue, 29 Jul',
        amount: 610,
        dutyHours: '3h 10m on duty',
        basePay: 480,
        tips: 140,
        adjustments: -10,
      },
      {
        id: 'w2-d1',
        title: 'Mon, 28 Jul',
        amount: 460,
        dutyHours: '2h 50m on duty',
        basePay: 360,
        tips: 110,
        adjustments: -10,
      },
    ],
  },
  {
    id: 'w-3',
    title: '21 Jul-27 Jul',
    subtitle: '• 36HRS • 52 ORDERS',
    amount: 8420,
    basePay: 6370,
    surgePay: 0,
    tips: 2150,
    incentive: 0,
    adjustments: -100,
    ordersCount: 52,
    dutyHours: '36h on duty',
    payout: 8420,
    days: [
      {
        id: 'w3-d7',
        title: 'Sun, 27 Jul',
        amount: 2020,
        dutyHours: '7h 30m on duty',
        basePay: 1510,
        tips: 530,
        adjustments: -20,
      },
      {
        id: 'w3-d6',
        title: 'Sat, 26 Jul',
        amount: 1840,
        dutyHours: '7h 10m on duty',
        basePay: 1380,
        tips: 480,
        adjustments: -20,
      },
      {
        id: 'w3-d5',
        title: 'Fri, 25 Jul',
        amount: 1480,
        dutyHours: '6h 15m on duty',
        basePay: 1120,
        tips: 380,
        adjustments: -20,
      },
      {
        id: 'w3-d4',
        title: 'Thu, 24 Jul',
        amount: 1120,
        dutyHours: '5h 15m on duty',
        basePay: 850,
        tips: 280,
        adjustments: -10,
      },
      {
        id: 'w3-d3',
        title: 'Wed, 23 Jul',
        amount: 820,
        dutyHours: '4h 00m on duty',
        basePay: 630,
        tips: 200,
        adjustments: -10,
      },
      {
        id: 'w3-d2',
        title: 'Tue, 22 Jul',
        amount: 660,
        dutyHours: '3h 10m on duty',
        basePay: 510,
        tips: 160,
        adjustments: -10,
      },
      {
        id: 'w3-d1',
        title: 'Mon, 21 Jul',
        amount: 480,
        dutyHours: '2h 40m on duty',
        basePay: 370,
        tips: 120,
        adjustments: -10,
      },
    ],
  },
  {
    id: 'w-4',
    title: '14 Jul-20 Jul',
    subtitle: '• 28HRS • 39 ORDERS',
    amount: 6190,
    basePay: 4700,
    surgePay: 0,
    tips: 1580,
    incentive: 0,
    adjustments: -90,
    ordersCount: 39,
    dutyHours: '28h on duty',
    payout: 6190,
    days: [
      {
        id: 'w4-d7',
        title: 'Sun, 20 Jul',
        amount: 1510,
        dutyHours: '6h 10m on duty',
        basePay: 1140,
        tips: 390,
        adjustments: -20,
      },
      {
        id: 'w4-d6',
        title: 'Sat, 19 Jul',
        amount: 1380,
        dutyHours: '5h 40m on duty',
        basePay: 1040,
        tips: 360,
        adjustments: -20,
      },
      {
        id: 'w4-d5',
        title: 'Fri, 18 Jul',
        amount: 1090,
        dutyHours: '4h 50m on duty',
        basePay: 830,
        tips: 270,
        adjustments: -10,
      },
      {
        id: 'w4-d4',
        title: 'Thu, 17 Jul',
        amount: 820,
        dutyHours: '4h 00m on duty',
        basePay: 620,
        tips: 210,
        adjustments: -10,
      },
      {
        id: 'w4-d3',
        title: 'Wed, 16 Jul',
        amount: 610,
        dutyHours: '3h 00m on duty',
        basePay: 470,
        tips: 150,
        adjustments: -10,
      },
      {
        id: 'w4-d2',
        title: 'Tue, 15 Jul',
        amount: 460,
        dutyHours: '2h 30m on duty',
        basePay: 350,
        tips: 120,
        adjustments: -10,
      },
      {
        id: 'w4-d1',
        title: 'Mon, 14 Jul',
        amount: 320,
        dutyHours: '1h 50m on duty',
        basePay: 250,
        tips: 80,
        adjustments: -10,
      },
    ],
  },
];

const MONTHLY_EARNINGS: EarningBreakdownItem[] = [
  {
    id: 'm-1',
    title: 'AUGUST 2026',
    subtitle: '• IN PROGRESS • 1 DAY 2 HRS • 48 ORDERS',
    amount: 14616,
    basePay: 10620,
    surgePay: 0,
    tips: 4320,
    incentive: 0,
    adjustments: -324,
    ordersCount: 48,
    dutyHours: '1 day 2 hrs 44m on duty',
    payout: 0,
    weeks: [
      {
        id: 'm1-w2',
        title: '04 Aug-10 Aug',
        subtitle: '• IN PROGRESS • 28 ORDERS',
        amount: 9776,
        basePay: 7020,
        surgePay: 0,
        tips: 3010,
        incentive: 0,
        adjustments: -254,
        ordersCount: 28,
        dutyHours: '8h 24m on duty',
        payout: 0,
        days: [
          {
            id: 'm1-w2-d7',
            title: 'Sun, 10 Aug',
            amount: 1008,
            dutyHours: '27m on duty',
            basePay: 50,
            tips: 1020,
            adjustments: -62,
          },
          {
            id: 'm1-w2-d6',
            title: 'Sat, 09 Aug',
            amount: 1450,
            dutyHours: '1h 20m on duty',
            basePay: 1200,
            tips: 280,
            adjustments: -30,
          },
          {
            id: 'm1-w2-d5',
            title: 'Fri, 08 Aug',
            amount: 2180,
            dutyHours: '2h 15m on duty',
            basePay: 2060,
            tips: 140,
            adjustments: -20,
          },
          {
            id: 'm1-w2-d4',
            title: 'Thu, 07 Aug',
            amount: 1820,
            dutyHours: '1h 50m on duty',
            basePay: 1740,
            tips: 110,
            adjustments: -30,
          },
          {
            id: 'm1-w2-d3',
            title: 'Wed, 06 Aug',
            amount: 1008,
            dutyHours: '27m on duty',
            basePay: 50,
            tips: 1020,
            adjustments: -62,
          },
          {
            id: 'm1-w2-d2',
            title: 'Tue, 05 Aug',
            amount: 1450,
            dutyHours: '1h 20m on duty',
            basePay: 1200,
            tips: 280,
            adjustments: -30,
          },
          {
            id: 'm1-w2-d1',
            title: 'Mon, 04 Aug',
            amount: 860,
            dutyHours: '45m on duty',
            basePay: 720,
            tips: 160,
            adjustments: -20,
          },
        ],
      },
      {
        id: 'm1-w1',
        title: '01 Aug-03 Aug',
        subtitle: '• 18HRS • 20 ORDERS',
        amount: 4840,
        basePay: 3600,
        surgePay: 0,
        tips: 1310,
        incentive: 0,
        adjustments: -70,
        ordersCount: 20,
        dutyHours: '18h 20m on duty',
        payout: 4840,
        days: [
          {
            id: 'm1-w1-d3',
            title: 'Sun, 03 Aug',
            amount: 1840,
            dutyHours: '6h 40m on duty',
            basePay: 1350,
            tips: 520,
            adjustments: -30,
          },
          {
            id: 'm1-w1-d2',
            title: 'Sat, 02 Aug',
            amount: 1620,
            dutyHours: '6h 15m on duty',
            basePay: 1200,
            tips: 440,
            adjustments: -20,
          },
          {
            id: 'm1-w1-d1',
            title: 'Fri, 01 Aug',
            amount: 1380,
            dutyHours: '5h 25m on duty',
            basePay: 1050,
            tips: 350,
            adjustments: -20,
          },
        ],
      },
    ],
  },
  {
    id: 'm-2',
    title: 'JULY 2026',
    subtitle: '• 5 DAYS 18 HRS • 201 ORDERS',
    amount: 32400,
    basePay: 24520,
    surgePay: 0,
    tips: 8260,
    incentive: 0,
    adjustments: -380,
    ordersCount: 201,
    dutyHours: '5 days 18 hrs on duty',
    payout: 32400,
    weeks: [
      {
        id: 'm2-w4',
        title: '25 Jul-31 Jul',
        subtitle: '• 36HRS • 52 ORDERS',
        amount: 8420,
        basePay: 6370,
        surgePay: 0,
        tips: 2150,
        incentive: 0,
        adjustments: -100,
        ordersCount: 52,
        dutyHours: '36h on duty',
        payout: 8420,
        days: [
          { id: 'm2-w4-d7', title: 'Thu, 31 Jul', amount: 2020, dutyHours: '7h 30m on duty', basePay: 1510, tips: 530, adjustments: -20 },
          { id: 'm2-w4-d6', title: 'Wed, 30 Jul', amount: 1840, dutyHours: '7h 10m on duty', basePay: 1380, tips: 480, adjustments: -20 },
          { id: 'm2-w4-d5', title: 'Tue, 29 Jul', amount: 1480, dutyHours: '6h 15m on duty', basePay: 1120, tips: 380, adjustments: -20 },
          { id: 'm2-w4-d4', title: 'Mon, 28 Jul', amount: 1120, dutyHours: '5h 15m on duty', basePay: 850, tips: 280, adjustments: -10 },
          { id: 'm2-w4-d3', title: 'Sun, 27 Jul', amount: 820, dutyHours: '4h 00m on duty', basePay: 630, tips: 200, adjustments: -10 },
          { id: 'm2-w4-d2', title: 'Sat, 26 Jul', amount: 660, dutyHours: '3h 10m on duty', basePay: 510, tips: 160, adjustments: -10 },
          { id: 'm2-w4-d1', title: 'Fri, 25 Jul', amount: 480, dutyHours: '2h 40m on duty', basePay: 370, tips: 120, adjustments: -10 },
        ],
      },
      {
        id: 'm2-w3',
        title: '18 Jul-24 Jul',
        subtitle: '• 32HRS • 48 ORDERS',
        amount: 7650,
        basePay: 5780,
        surgePay: 0,
        tips: 1980,
        incentive: 0,
        adjustments: -110,
        ordersCount: 48,
        dutyHours: '32h on duty',
        payout: 7650,
        days: [
          { id: 'm2-w3-d7', title: 'Thu, 24 Jul', amount: 1840, dutyHours: '6h 40m on duty', basePay: 1350, tips: 520, adjustments: -30 },
          { id: 'm2-w3-d6', title: 'Wed, 23 Jul', amount: 1620, dutyHours: '6h 15m on duty', basePay: 1200, tips: 440, adjustments: -20 },
          { id: 'm2-w3-d5', title: 'Tue, 22 Jul', amount: 1380, dutyHours: '5h 25m on duty', basePay: 1050, tips: 350, adjustments: -20 },
          { id: 'm2-w3-d4', title: 'Mon, 21 Jul', amount: 990, dutyHours: '4h 10m on duty', basePay: 760, tips: 240, adjustments: -10 },
          { id: 'm2-w3-d3', title: 'Sun, 20 Jul', amount: 750, dutyHours: '3h 30m on duty', basePay: 580, tips: 180, adjustments: -10 },
          { id: 'm2-w3-d2', title: 'Sat, 19 Jul', amount: 610, dutyHours: '3h 10m on duty', basePay: 480, tips: 140, adjustments: -10 },
          { id: 'm2-w3-d1', title: 'Fri, 18 Jul', amount: 460, dutyHours: '2h 50m on duty', basePay: 360, tips: 110, adjustments: -10 },
        ],
      },
      {
        id: 'm2-w2',
        title: '11 Jul-17 Jul',
        subtitle: '• 35HRS • 50 ORDERS',
        amount: 8140,
        basePay: 6160,
        surgePay: 0,
        tips: 2070,
        incentive: 0,
        adjustments: -90,
        ordersCount: 50,
        dutyHours: '35h on duty',
        payout: 8140,
        days: [
          { id: 'm2-w2-d7', title: 'Thu, 17 Jul', amount: 1940, dutyHours: '7h 10m on duty', basePay: 1460, tips: 500, adjustments: -20 },
          { id: 'm2-w2-d6', title: 'Wed, 16 Jul', amount: 1720, dutyHours: '6h 50m on duty', basePay: 1300, tips: 440, adjustments: -20 },
          { id: 'm2-w2-d5', title: 'Tue, 15 Jul', amount: 1410, dutyHours: '6h 00m on duty', basePay: 1070, tips: 360, adjustments: -20 },
          { id: 'm2-w2-d4', title: 'Mon, 14 Jul', amount: 1120, dutyHours: '5h 20m on duty', basePay: 850, tips: 280, adjustments: -10 },
          { id: 'm2-w2-d3', title: 'Sun, 13 Jul', amount: 810, dutyHours: '4h 00m on duty', basePay: 620, tips: 200, adjustments: -10 },
          { id: 'm2-w2-d2', title: 'Sat, 12 Jul', amount: 650, dutyHours: '3h 10m on duty', basePay: 500, tips: 160, adjustments: -10 },
          { id: 'm2-w2-d1', title: 'Fri, 11 Jul', amount: 490, dutyHours: '2h 30m on duty', basePay: 360, tips: 130, adjustments: 0 },
        ],
      },
      {
        id: 'm2-w1',
        title: '01 Jul-10 Jul',
        subtitle: '• 35HRS • 51 ORDERS',
        amount: 8190,
        basePay: 6210,
        surgePay: 0,
        tips: 2060,
        incentive: 0,
        adjustments: -80,
        ordersCount: 51,
        dutyHours: '35h on duty',
        payout: 8190,
        days: [
          { id: 'm2-w1-d7', title: 'Thu, 10 Jul', amount: 1980, dutyHours: '7h 20m on duty', basePay: 1500, tips: 500, adjustments: -20 },
          { id: 'm2-w1-d6', title: 'Wed, 09 Jul', amount: 1740, dutyHours: '6h 40m on duty', basePay: 1320, tips: 440, adjustments: -20 },
          { id: 'm2-w1-d5', title: 'Tue, 08 Jul', amount: 1420, dutyHours: '6h 10m on duty', basePay: 1080, tips: 360, adjustments: -20 },
          { id: 'm2-w1-d4', title: 'Mon, 07 Jul', amount: 1110, dutyHours: '5h 10m on duty', basePay: 840, tips: 280, adjustments: -10 },
          { id: 'm2-w1-d3', title: 'Sun, 06 Jul', amount: 820, dutyHours: '4h 00m on duty', basePay: 630, tips: 200, adjustments: -10 },
          { id: 'm2-w1-d2', title: 'Sat, 05 Jul', amount: 640, dutyHours: '3h 00m on duty', basePay: 490, tips: 150, adjustments: 0 },
          { id: 'm2-w1-d1', title: 'Fri, 04 Jul', amount: 480, dutyHours: '2h 40m on duty', basePay: 350, tips: 130, adjustments: 0 },
        ],
      },
    ],
  },
  {
    id: 'm-3',
    title: 'JUNE 2026',
    subtitle: '• 5 DAYS 16 HRS • 196 ORDERS',
    amount: 29850,
    basePay: 22600,
    surgePay: 0,
    tips: 7580,
    incentive: 0,
    adjustments: -330,
    ordersCount: 196,
    dutyHours: '5 days 16 hrs on duty',
    payout: 29850,
    weeks: [
      {
        id: 'm3-w4',
        title: '22 Jun-30 Jun',
        subtitle: '• 36HRS • 51 ORDERS',
        amount: 7850,
        basePay: 5950,
        surgePay: 0,
        tips: 1990,
        incentive: 0,
        adjustments: -90,
        ordersCount: 51,
        dutyHours: '36h on duty',
        payout: 7850,
        days: [
          { id: 'm3-w4-d7', title: 'Tue, 30 Jun', amount: 1880, dutyHours: '7h 10m on duty', basePay: 1420, tips: 480, adjustments: -20 },
          { id: 'm3-w4-d6', title: 'Mon, 29 Jun', amount: 1680, dutyHours: '6h 40m on duty', basePay: 1270, tips: 430, adjustments: -20 },
          { id: 'm3-w4-d5', title: 'Sun, 28 Jun', amount: 1390, dutyHours: '6h 00m on duty', basePay: 1060, tips: 350, adjustments: -20 },
          { id: 'm3-w4-d4', title: 'Sat, 27 Jun', amount: 1080, dutyHours: '5h 30m on duty', basePay: 820, tips: 270, adjustments: -10 },
          { id: 'm3-w4-d3', title: 'Fri, 26 Jun', amount: 790, dutyHours: '4h 10m on duty', basePay: 600, tips: 200, adjustments: -10 },
          { id: 'm3-w4-d2', title: 'Thu, 25 Jun', amount: 590, dutyHours: '3h 30m on duty', basePay: 450, tips: 150, adjustments: -10 },
          { id: 'm3-w4-d1', title: 'Wed, 24 Jun', amount: 440, dutyHours: '3h 00m on duty', basePay: 330, tips: 110, adjustments: 0 },
        ],
      },
      {
        id: 'm3-w3',
        title: '15 Jun-21 Jun',
        subtitle: '• 34HRS • 49 ORDERS',
        amount: 7460,
        basePay: 5650,
        surgePay: 0,
        tips: 1890,
        incentive: 0,
        adjustments: -80,
        ordersCount: 49,
        dutyHours: '34h on duty',
        payout: 7460,
        days: [
          { id: 'm3-w3-d7', title: 'Sun, 21 Jun', amount: 1820, dutyHours: '7h 00m on duty', basePay: 1380, tips: 460, adjustments: -20 },
          { id: 'm3-w3-d6', title: 'Sat, 20 Jun', amount: 1580, dutyHours: '6h 20m on duty', basePay: 1200, tips: 400, adjustments: -20 },
          { id: 'm3-w3-d5', title: 'Fri, 19 Jun', amount: 1320, dutyHours: '5h 40m on duty', basePay: 1000, tips: 330, adjustments: -10 },
          { id: 'm3-w3-d4', title: 'Thu, 18 Jun', amount: 1040, dutyHours: '5h 00m on duty', basePay: 790, tips: 260, adjustments: -10 },
          { id: 'm3-w3-d3', title: 'Wed, 17 Jun', amount: 740, dutyHours: '4h 00m on duty', basePay: 560, tips: 190, adjustments: -10 },
          { id: 'm3-w3-d2', title: 'Tue, 16 Jun', amount: 540, dutyHours: '3h 10m on duty', basePay: 410, tips: 140, adjustments: -10 },
          { id: 'm3-w3-d1', title: 'Mon, 15 Jun', amount: 420, dutyHours: '2h 50m on duty', basePay: 310, tips: 110, adjustments: 0 },
        ],
      },
      {
        id: 'm3-w2',
        title: '08 Jun-14 Jun',
        subtitle: '• 33HRS • 48 ORDERS',
        amount: 7320,
        basePay: 5540,
        surgePay: 0,
        tips: 1860,
        incentive: 0,
        adjustments: -80,
        ordersCount: 48,
        dutyHours: '33h on duty',
        payout: 7320,
        days: [
          { id: 'm3-w2-d7', title: 'Sun, 14 Jun', amount: 1790, dutyHours: '6h 50m on duty', basePay: 1360, tips: 450, adjustments: -20 },
          { id: 'm3-w2-d6', title: 'Sat, 13 Jun', amount: 1550, dutyHours: '6h 10m on duty', basePay: 1170, tips: 400, adjustments: -20 },
          { id: 'm3-w2-d5', title: 'Fri, 12 Jun', amount: 1290, dutyHours: '5h 30m on duty', basePay: 980, tips: 320, adjustments: -10 },
          { id: 'm3-w2-d4', title: 'Thu, 11 Jun', amount: 1020, dutyHours: '5h 00m on duty', basePay: 770, tips: 260, adjustments: -10 },
          { id: 'm3-w2-d3', title: 'Wed, 10 Jun', amount: 730, dutyHours: '3h 50m on duty', basePay: 550, tips: 190, adjustments: -10 },
          { id: 'm3-w2-d2', title: 'Tue, 09 Jun', amount: 530, dutyHours: '3h 00m on duty', basePay: 400, tips: 140, adjustments: -10 },
          { id: 'm3-w2-d1', title: 'Mon, 08 Jun', amount: 410, dutyHours: '2h 40m on duty', basePay: 310, tips: 100, adjustments: 0 },
        ],
      },
      {
        id: 'm3-w1',
        title: '01 Jun-07 Jun',
        subtitle: '• 33HRS • 48 ORDERS',
        amount: 7220,
        basePay: 5460,
        surgePay: 0,
        tips: 1840,
        incentive: 0,
        adjustments: -80,
        ordersCount: 48,
        dutyHours: '33h on duty',
        payout: 7220,
        days: [
          { id: 'm3-w1-d7', title: 'Sun, 07 Jun', amount: 1760, dutyHours: '6h 50m on duty', basePay: 1330, tips: 450, adjustments: -20 },
          { id: 'm3-w1-d6', title: 'Sat, 06 Jun', amount: 1530, dutyHours: '6h 10m on duty', basePay: 1160, tips: 390, adjustments: -20 },
          { id: 'm3-w1-d5', title: 'Fri, 05 Jun', amount: 1280, dutyHours: '5h 30m on duty', basePay: 970, tips: 320, adjustments: -10 },
          { id: 'm3-w1-d4', title: 'Thu, 04 Jun', amount: 1010, dutyHours: '4h 50m on duty', basePay: 760, tips: 260, adjustments: -10 },
          { id: 'm3-w1-d3', title: 'Wed, 03 Jun', amount: 720, dutyHours: '3h 50m on duty', basePay: 550, tips: 180, adjustments: -10 },
          { id: 'm3-w1-d2', title: 'Tue, 02 Jun', amount: 520, dutyHours: '3h 00m on duty', basePay: 390, tips: 140, adjustments: -10 },
          { id: 'm3-w1-d1', title: 'Mon, 01 Jun', amount: 400, dutyHours: '2h 50m on duty', basePay: 300, tips: 100, adjustments: 0 },
        ],
      },
    ],
  },
];

const ORDER_CATEGORIES: OrderCategory[] = ['new_order', 'delivered'];

const MONTHS_SHORT = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];
const DAYS_OF_WEEK_SHORT = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export interface ShiftDayItem {
  id: string;
  dateNum: number;
  dayName: string;
  monthShort: string;
  year: number;
  isToday: boolean;
}

export interface MonthShiftGroup {
  monthShort: string;
  year: number;
  days: ShiftDayItem[];
}

function getUpcoming5ShiftDays(baseDate: Date): ShiftDayItem[] {
  const days: ShiftDayItem[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + i);
    days.push({
      id: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      dateNum: d.getDate(),
      dayName: DAYS_OF_WEEK_SHORT[d.getDay()],
      monthShort: MONTHS_SHORT[d.getMonth()],
      year: d.getFullYear(),
      isToday: i === 0,
    });
  }
  return days;
}

function groupShiftDaysByMonth(days: ShiftDayItem[]): MonthShiftGroup[] {
  const groups: MonthShiftGroup[] = [];
  days.forEach((day) => {
    let group = groups.find((g) => g.monthShort === day.monthShort && g.year === day.year);
    if (!group) {
      group = {
        monthShort: day.monthShort,
        year: day.year,
        days: [],
      };
      groups.push(group);
    }
    group.days.push(day);
  });
  return groups;
}

function MorningSunriseBg() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden rounded-3xl">
      <svg
        viewBox="0 0 400 240"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full object-cover opacity-45 blur-[2.5px] scale-110"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mornSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#ffedd5" stopOpacity="0.75" />
            <stop offset="75%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fdba74" stopOpacity="0.95" />
          </linearGradient>
          <radialGradient id="sunGlowGrad" cx="50%" cy="85%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="20%" stopColor="#fef9c3" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#fb923c" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mornHillsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <rect width="400" height="240" fill="url(#mornSkyGrad)" />
        <circle cx="200" cy="190" r="115" fill="url(#sunGlowGrad)" />
        <circle cx="200" cy="190" r="48" fill="#fef08a" opacity="0.95" />
        <path d="M200 190 L120 40 L160 30 Z" fill="#fef08a" opacity="0.35" />
        <path d="M200 190 L180 20 L220 20 Z" fill="#fef08a" opacity="0.4" />
        <path d="M200 190 L240 30 L280 40 Z" fill="#fef08a" opacity="0.35" />
        <path d="M200 190 L60 110 L90 85 Z" fill="#fdba74" opacity="0.3" />
        <path d="M200 190 L340 110 L310 85 Z" fill="#fdba74" opacity="0.3" />
        <path d="M0 240 Q90 170 190 205 T400 195 L400 240 Z" fill="url(#mornHillsGrad)" />
        <path d="M0 240 Q130 195 240 215 T400 220 L400 240 Z" fill="#ea580c" opacity="0.18" />
      </svg>
      <div className="absolute inset-0 bg-white/40" />
    </div>
  );
}

function NoonSunBg() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden rounded-3xl">
      <svg
        viewBox="0 0 400 240"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full object-cover opacity-40 blur-[2.5px] scale-110"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="noonSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#e0f2fe" stopOpacity="0.8" />
            <stop offset="85%" stopColor="#fef08a" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#fef9c3" stopOpacity="0.75" />
          </linearGradient>
          <radialGradient id="noonCoronaGrad" cx="50%" cy="25%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="25%" stopColor="#fef08a" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#fde047" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="240" fill="url(#noonSkyGrad)" />
        <circle cx="200" cy="55" r="120" fill="url(#noonCoronaGrad)" />
        <circle cx="200" cy="55" r="44" fill="#fffbeb" opacity="0.95" />
        <path d="M200 55 L80 180 L110 200 Z" fill="#fef08a" opacity="0.35" />
        <path d="M200 55 L160 230 L195 235 Z" fill="#fef08a" opacity="0.4" />
        <path d="M200 55 L205 235 L240 230 Z" fill="#fef08a" opacity="0.4" />
        <path d="M200 55 L290 200 L320 180 Z" fill="#fef08a" opacity="0.35" />
        <path d="M200 55 L30 110 L50 145 Z" fill="#bae6fd" opacity="0.3" />
        <path d="M200 55 L370 110 L350 145 Z" fill="#bae6fd" opacity="0.3" />
        <ellipse cx="90" cy="235" rx="110" ry="40" fill="#ffffff" opacity="0.75" />
        <ellipse cx="290" cy="230" rx="130" ry="45" fill="#ffffff" opacity="0.75" />
        <ellipse cx="190" cy="240" rx="90" ry="35" fill="#ffffff" opacity="0.8" />
      </svg>
      <div className="absolute inset-0 bg-white/45" />
    </div>
  );
}

function NightSundownBg() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden rounded-3xl">
      <svg
        viewBox="0 0 400 240"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full object-cover opacity-45 blur-[2.5px] scale-110"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sundownSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#312e81" stopOpacity="0.8" />
            <stop offset="35%" stopColor="#6366f1" stopOpacity="0.65" />
            <stop offset="65%" stopColor="#e11d48" stopOpacity="0.65" />
            <stop offset="85%" stopColor="#f97316" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#fde047" stopOpacity="0.85" />
          </linearGradient>
          <radialGradient id="sundownGlowGrad" cx="50%" cy="85%" r="55%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
            <stop offset="35%" stopColor="#f43f5e" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#818cf8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="240" fill="url(#sundownSkyGrad)" />
        <circle cx="50" cy="30" r="1.5" fill="#ffffff" opacity="0.85" />
        <circle cx="120" cy="20" r="1.2" fill="#ffffff" opacity="0.9" />
        <circle cx="280" cy="25" r="1.5" fill="#ffffff" opacity="0.8" />
        <circle cx="340" cy="35" r="1.2" fill="#ffffff" opacity="0.85" />
        <circle cx="210" cy="15" r="1.6" fill="#ffffff" opacity="0.9" />
        <circle cx="200" cy="195" r="95" fill="url(#sundownGlowGrad)" />
        <circle cx="200" cy="195" r="38" fill="#fff1f2" opacity="0.95" />
        <path d="M0 240 Q110 190 200 208 T400 198 L400 240 Z" fill="#1e1b4b" opacity="0.45" />
        <path d="M0 240 Q150 208 260 215 T400 218 L400 240 Z" fill="#0f172a" opacity="0.35" />
      </svg>
      <div className="absolute inset-0 bg-white/40" />
    </div>
  );
}

export interface ShiftTimeSlot {
  id: string;
  period: 'morning' | 'afternoon' | 'evening';
  timeRange: string;
  duration: string;
  tag: string;
}

export const SHIFT_TIME_SLOTS: ShiftTimeSlot[] = [
  // Morning (3 slots in strict ascending order)
  {
    id: 'morn-1',
    period: 'morning',
    timeRange: '06:00 AM - 09:00 AM',
    duration: '3 hrs',
    tag: 'Breakfast Shift',
  },
  {
    id: 'morn-3',
    period: 'morning',
    timeRange: '07:00 AM - 11:00 AM',
    duration: '4 hrs',
    tag: 'Morning Extended',
  },
  {
    id: 'morn-2',
    period: 'morning',
    timeRange: '09:00 AM - 12:00 PM',
    duration: '3 hrs',
    tag: 'Brunch & Quick Bites',
  },
  // Afternoon (2 slots in strict ascending order)
  {
    id: 'aft-1',
    period: 'afternoon',
    timeRange: '12:00 PM - 03:00 PM',
    duration: '3 hrs',
    tag: 'Lunch Rush',
  },
  {
    id: 'aft-2',
    period: 'afternoon',
    timeRange: '03:00 PM - 06:00 PM',
    duration: '3 hrs',
    tag: 'Tea & Snacks Shift',
  },
  // Evening (3 slots in strict ascending order)
  {
    id: 'eve-1',
    period: 'evening',
    timeRange: '06:00 PM - 09:00 PM',
    duration: '3 hrs',
    tag: 'Dinner Rush',
  },
  {
    id: 'eve-3',
    period: 'evening',
    timeRange: '07:00 PM - 11:00 PM',
    duration: '4 hrs',
    tag: 'Evening Prime Slot',
  },
  {
    id: 'eve-2',
    period: 'evening',
    timeRange: '09:00 PM - 12:00 AM',
    duration: '3 hrs',
    tag: 'Late Night Delivery',
  },
];

function DailyEarningsInsideView({
  date,
  totalAmount,
  dutyHours,
  orderEarnings,
  customerTips,
  adjustments,
  filter,
  onFilterChange,
  transactions,
}: {
  date: string;
  totalAmount: number;
  dutyHours: string;
  orderEarnings: number;
  customerTips: number;
  adjustments: number;
  filter: 'all' | 'orders' | 'incentives' | 'adjustments';
  onFilterChange: (f: 'all' | 'orders' | 'incentives' | 'adjustments') => void;
  transactions: DailyTransactionItem[];
}) {
  const filtered =
    filter === 'all'
      ? transactions
      : transactions.filter((t) => t.category === filter);

  return (
    <div className="space-y-4 pt-1">
      {/* 1. Main Daily Card matching user screenshot */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs">
        <div className="text-center">
          <span className="text-xs sm:text-sm font-medium text-slate-600 block">
            {date}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            ₹{totalAmount.toLocaleString('en-IN')}
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {dutyHours.toLowerCase().includes('on duty')
                ? dutyHours.toLowerCase()
                : `${dutyHours.toLowerCase()} on duty`}
            </span>
          </div>
        </div>

        {/* Dashed divider with centered downward chevron */}
        <div className="relative my-4">
          <div className="border-b border-dashed border-slate-200" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
              <ChevronDown className="w-3 h-3 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Itemized summary breakdown */}
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Order Earnings</span>
            <span className="font-bold text-slate-900">
              ₹{orderEarnings.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Customer Tips</span>
            <span className="font-bold text-slate-900">
              ₹{customerTips.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Adjustments</span>
            <span className="font-bold text-slate-900">
              - ₹{Math.abs(adjustments).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Filter Buttons - Fit 4 buttons in screen width without scrolling */}
      <div className="grid grid-cols-4 gap-1.5 pt-1 select-none w-full">
        {(
          [
            { key: 'all', label: 'All' },
            { key: 'orders', label: 'Order' },
            { key: 'incentives', label: 'Incentive' },
            { key: 'adjustments', label: 'Adjustment' },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onFilterChange(key)}
            className={`w-full py-2 px-1 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer select-none text-center truncate ${
              filter === key
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 3. Detailed Activity / Transaction List */}
      <div className="divide-y divide-dashed divide-slate-200 pt-1">
        {filtered.map((tx) => (
          <div key={tx.id} className="py-3.5 flex items-start justify-between gap-3">
            {/* Left side: Order ID as main name + Time (not date), below: Total bill, items count, status */}
            <div className="space-y-1 min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug flex items-center gap-2 truncate">
                <span>
                  {tx.category === 'orders'
                    ? (tx.orderId || `Order #${tx.id.toUpperCase()}`)
                    : tx.title}
                </span>
                <span className="text-slate-400 font-normal text-xs shrink-0">
                  {tx.timestamp}
                </span>
              </h4>

              {/* Sub-line on left side: Total bill, items count, status */}
              {tx.category === 'orders' ? (
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                  <span>
                    Total bill: ₹{(tx.itemTotal ?? 0).toLocaleString('en-IN')}
                  </span>
                  <span>•</span>
                  <span>({tx.itemCount ?? 1} items)</span>
                  <span>•</span>
                  <span
                    className={
                      tx.isRejected
                        ? 'text-rose-500 font-semibold'
                        : 'text-emerald-600 font-semibold'
                    }
                  >
                    {tx.isRejected ? 'Rejected' : tx.status || 'Delivered'}
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <span>
                    {tx.category === 'adjustments'
                      ? 'Settlement Adjustment'
                      : 'Milestone Reward'}
                  </span>
                  <span>•</span>
                  <span
                    className={
                      tx.amount < 0
                        ? 'text-rose-500 font-semibold'
                        : 'text-emerald-600 font-semibold'
                    }
                  >
                    {tx.amount < 0 ? 'Deducted' : 'Credited'}
                  </span>
                </div>
              )}
            </div>

            {/* Right side: Income from that order, minus tag, adjusted with cash order tag, and status */}
            <div className="text-right flex flex-col items-end shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {tx.amount < 0
                    ? `- ₹${Math.abs(tx.amount)}`
                    : `₹${tx.amount.toLocaleString('en-IN')}`}
                </span>
                {tx.category === 'orders' && (
                  <ChevronRight className="w-3.5 h-3.5 text-orange-500 stroke-[2.5]" />
                )}
              </div>

              {/* Minus tag if amount is negative */}
              {tx.amount < 0 && (
                <span className="text-[11px] font-bold text-rose-500 mt-0.5 block">
                  Minus
                </span>
              )}

              {/* Money adjust with cash order tag */}
              {tx.category === 'orders' && tx.paymentMode === 'cash' && !tx.isRejected && (
                <span className="text-[11px] font-bold text-amber-600 mt-0.5 block">
                  Adjusted with cash order
                </span>
              )}

              {/* Status / Badges without background */}
              {tx.isRejected && (
                <span className="text-xs font-bold text-rose-500 mt-0.5 block">
                  Rejected
                </span>
              )}
              {tx.badge === 'surge' && !tx.isRejected && (
                <span className="text-xs font-bold text-amber-500 mt-0.5 block">
                  Surge
                </span>
              )}
              {tx.badge === 'tip' && !tx.isRejected && (
                <span className="text-xs font-bold text-emerald-600 mt-0.5 block">
                  Tip
                </span>
              )}
              {tx.badge === 'rain' && !tx.isRejected && (
                <span className="text-xs font-bold text-blue-500 mt-0.5 block">
                  Rain
                </span>
              )}
              {tx.badge === 'xl' && !tx.isRejected && (
                <span className="text-xs font-bold text-orange-500 mt-0.5 block">
                  XL Order
                </span>
              )}
              {tx.status === 'Credited' && (
                <span className="text-xs font-bold text-emerald-600 mt-0.5 block">
                  Credited
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function parseDutyMinutes(dutyStr: string): number {
  if (!dutyStr) return 0;
  let total = 0;
  const daysMatch = dutyStr.match(/(\d+)\s*d(?:ays?)?/i);
  if (daysMatch) {
    total += parseInt(daysMatch[1], 10) * 24 * 60;
  }
  const hoursMatch = dutyStr.match(/(\d+)\s*h(?:(?:ou)?rs?)?/i);
  if (hoursMatch) {
    total += parseInt(hoursMatch[1], 10) * 60;
  }
  const minsMatch = dutyStr.match(/(\d+)\s*m(?:in(?:ute)?s?)?/i);
  if (minsMatch) {
    total += parseInt(minsMatch[1], 10);
  }
  return total;
}

function formatDutyTime(totalMinutes: number): string {
  if (totalMinutes <= 0) return '0m on duty';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m on duty`;
  }
  if (hours > 0) {
    return `${hours}h on duty`;
  }
  return `${minutes}m on duty`;
}

function formatDutyDaysAndHours(totalMinutes: number): string {
  if (totalMinutes <= 0) return '0 hrs on duty';
  const totalHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days === 0) {
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m on duty`;
    if (hours > 0) return `${hours}h on duty`;
    return `${minutes}m on duty`;
  }

  const parts: string[] = [];
  parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? 'hr' : 'hrs'}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }

  return `${parts.join(' ')} on duty`;
}

function WeekEarningsInsideView({
  weekTitle,
  totalAmount,
  dutyHours,
  orderEarnings,
  customerTips,
  adjustments,
  payout,
  days,
  onSelectDay,
}: {
  weekTitle: string;
  totalAmount: number;
  dutyHours: string;
  orderEarnings: number;
  customerTips: number;
  adjustments: number;
  payout?: number;
  days?: WeekDayRecord[];
  onSelectDay: (day: WeekDayRecord) => void;
}) {
  const daysList =
    days && days.length > 0
      ? days
      : [
          {
            id: 'fallback-d7',
            title: 'Sun, 10 Aug',
            amount: 1008,
            dutyHours: '27m on duty',
            basePay: 50,
            tips: 1020,
            adjustments: -62,
          },
          {
            id: 'fallback-d6',
            title: 'Sat, 09 Aug',
            amount: 1450,
            dutyHours: '1h 20m on duty',
            basePay: 1200,
            tips: 280,
            adjustments: -30,
          },
          {
            id: 'fallback-d5',
            title: 'Fri, 08 Aug',
            amount: 2180,
            dutyHours: '2h 15m on duty',
            basePay: 2060,
            tips: 140,
            adjustments: -20,
          },
          {
            id: 'fallback-d4',
            title: 'Thu, 07 Aug',
            amount: 1820,
            dutyHours: '1h 50m on duty',
            basePay: 1740,
            tips: 110,
            adjustments: -30,
          },
          {
            id: 'fallback-d3',
            title: 'Wed, 06 Aug',
            amount: 1008,
            dutyHours: '27m on duty',
            basePay: 50,
            tips: 1020,
            adjustments: -62,
          },
          {
            id: 'fallback-d2',
            title: 'Tue, 05 Aug',
            amount: 1450,
            dutyHours: '1h 20m on duty',
            basePay: 1200,
            tips: 280,
            adjustments: -30,
          },
          {
            id: 'fallback-d1',
            title: 'Mon, 04 Aug',
            amount: 860,
            dutyHours: '45m on duty',
            basePay: 720,
            tips: 160,
            adjustments: -20,
          },
        ];

  const computedTotal =
    daysList.length > 0
      ? daysList.reduce((sum, d) => sum + d.amount, 0)
      : totalAmount;

  const computedMinutes =
    daysList.length > 0
      ? daysList.reduce((sum, d) => sum + parseDutyMinutes(d.dutyHours), 0)
      : parseDutyMinutes(dutyHours);

  const computedDuty = computedMinutes > 0 ? formatDutyTime(computedMinutes) : dutyHours;

  const computedOrderEarnings =
    daysList.length > 0
      ? daysList.reduce((sum, d) => sum + (d.basePay ?? 0), 0)
      : orderEarnings;

  const computedTips =
    daysList.length > 0
      ? daysList.reduce((sum, d) => sum + (d.tips ?? 0), 0)
      : customerTips;

  const computedAdjustments =
    daysList.length > 0
      ? daysList.reduce((sum, d) => sum + (d.adjustments ?? 0), 0)
      : adjustments;

  return (
    <div className="space-y-4 pt-1">
      {/* 1. Main Week Earnings Card matching user screenshot */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs">
        <div className="text-center">
          <span className="text-xs sm:text-sm font-medium text-slate-600 block">
            {weekTitle}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            ₹{computedTotal.toLocaleString('en-IN')}
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {computedDuty.toLowerCase().includes('on duty')
                ? computedDuty.toLowerCase()
                : `${computedDuty.toLowerCase()} on duty`}
            </span>
          </div>
        </div>

        {/* Dashed divider with centered downward chevron */}
        <div className="relative my-4">
          <div className="border-b border-dashed border-slate-200" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
              <ChevronDown className="w-3 h-3 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Itemized summary breakdown */}
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Order Earnings</span>
            <span className="font-bold text-slate-900">
              ₹{computedOrderEarnings.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Customer Tips</span>
            <span className="font-bold text-slate-900">
              ₹{computedTips.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Adjustments</span>
            <span className="font-bold text-slate-900">
              - ₹{Math.abs(computedAdjustments).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. This week payout Card matching user screenshot */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs">
        <span className="text-xs sm:text-sm font-semibold text-slate-600 block">
          This week payout: {weekTitle}
        </span>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight mt-1.5">
          ₹{(payout ?? 0).toLocaleString('en-IN')}
        </h3>
      </div>

      {/* 3. Daily Breakdown and Week Totals matching user screenshot */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        {/* Days List: Clicking date with arrow sign will open that day page */}
        <div className="divide-y divide-dashed divide-slate-200">
          {daysList.map((day) => (
            <button
              key={day.id}
              type="button"
              onClick={() => onSelectDay(day)}
              className="w-full py-3.5 flex items-center justify-between text-left hover:bg-slate-50/80 -mx-2 px-2 rounded-2xl transition cursor-pointer group"
            >
              <div>
                <span className="text-sm font-bold text-slate-900 block group-hover:text-orange-600 transition-colors">
                  {day.title}
                </span>
                <span className="text-xs text-slate-500 font-normal block mt-0.5">
                  {day.dutyHours}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-slate-900">
                  ₹{day.amount.toLocaleString('en-IN')}
                </span>
                <div className="w-6 h-6 rounded-full bg-orange-100/60 flex items-center justify-center text-orange-500 group-hover:bg-orange-200/80 group-hover:translate-x-0.5 transition-all">
                  <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Dashed divider */}
        <div className="border-b border-dashed border-slate-200 pt-1" />

        {/* Totals Section */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-medium text-slate-600">Total earnings</span>
            <span className="text-base sm:text-lg font-black text-slate-900">
              ₹{computedTotal.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="border-b border-dotted border-slate-200" />
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-medium text-slate-600">Time spent</span>
            <span className="font-medium text-slate-600">
              {computedDuty.toLowerCase().includes('on duty')
                ? computedDuty.toLowerCase()
                : `${computedDuty.toLowerCase()} on duty`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MonthEarningsInsideView({
  monthTitle,
  totalAmount,
  dutyHours,
  orderEarnings,
  customerTips,
  adjustments,
  payout,
  weeks,
  onSelectWeek,
}: {
  monthTitle: string;
  totalAmount: number;
  dutyHours: string;
  orderEarnings: number;
  customerTips: number;
  adjustments: number;
  payout?: number;
  weeks?: EarningBreakdownItem[];
  onSelectWeek: (week: EarningBreakdownItem) => void;
}) {
  const weeksList = weeks && weeks.length > 0 ? weeks : [];

  const computedTotal =
    weeksList.length > 0
      ? weeksList.reduce((sum, w) => sum + w.amount, 0)
      : totalAmount;

  const computedMinutes =
    weeksList.length > 0
      ? weeksList.reduce((sum, w) => sum + parseDutyMinutes(w.dutyHours), 0)
      : parseDutyMinutes(dutyHours);

  const computedDuty =
    computedMinutes > 0 ? formatDutyDaysAndHours(computedMinutes) : dutyHours;

  const computedOrderEarnings =
    weeksList.length > 0
      ? weeksList.reduce((sum, w) => sum + (w.basePay ?? 0), 0)
      : orderEarnings;

  const computedTips =
    weeksList.length > 0
      ? weeksList.reduce((sum, w) => sum + (w.tips ?? 0), 0)
      : customerTips;

  const computedAdjustments =
    weeksList.length > 0
      ? weeksList.reduce((sum, w) => sum + (w.adjustments ?? 0), 0)
      : adjustments;

  return (
    <div className="space-y-4 pt-1">
      {/* 1. Main Month Earnings Card - similar design style like week */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs">
        <div className="text-center">
          <span className="text-xs sm:text-sm font-medium text-slate-600 block">
            {monthTitle}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            ₹{computedTotal.toLocaleString('en-IN')}
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {computedDuty.toLowerCase().includes('on duty')
                ? computedDuty.toLowerCase()
                : `${computedDuty.toLowerCase()} on duty`}
            </span>
          </div>
        </div>

        {/* Dashed divider with centered downward chevron */}
        <div className="relative my-4">
          <div className="border-b border-dashed border-slate-200" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
              <ChevronDown className="w-3 h-3 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Itemized summary breakdown */}
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Order Earnings</span>
            <span className="font-bold text-slate-900">
              ₹{computedOrderEarnings.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Customer Tips</span>
            <span className="font-bold text-slate-900">
              ₹{computedTips.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Adjustments</span>
            <span className="font-bold text-slate-900">
              - ₹{Math.abs(computedAdjustments).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. This month payout Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs">
        <span className="text-xs sm:text-sm font-semibold text-slate-600 block">
          This month payout: {monthTitle}
        </span>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight mt-1.5">
          ₹{(payout ?? 0).toLocaleString('en-IN')}
        </h3>
      </div>

      {/* 3. Weekly Breakdown and Month Totals */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        {/* Weeks List: Clicking week date with arrow sign will open that week page */}
        <div className="divide-y divide-dashed divide-slate-200">
          {weeksList.map((week) => (
            <button
              key={week.id}
              type="button"
              onClick={() => onSelectWeek(week)}
              className="w-full py-3.5 flex items-center justify-between text-left hover:bg-slate-50/80 -mx-2 px-2 rounded-2xl transition cursor-pointer group"
            >
              <div>
                <span className="text-sm font-bold text-slate-900 block group-hover:text-orange-600 transition-colors">
                  {week.title}
                </span>
                <span className="text-xs text-slate-500 font-normal block mt-0.5">
                  {formatDutyDaysAndHours(parseDutyMinutes(week.dutyHours))} • {week.ordersCount} orders
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-slate-900">
                  ₹{week.amount.toLocaleString('en-IN')}
                </span>
                <div className="w-6 h-6 rounded-full bg-orange-100/60 flex items-center justify-center text-orange-500 group-hover:bg-orange-200/80 group-hover:translate-x-0.5 transition-all">
                  <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Dashed divider */}
        <div className="border-b border-dashed border-slate-200 pt-1" />

        {/* Totals Section */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-medium text-slate-600">Total earnings</span>
            <span className="text-base sm:text-lg font-black text-slate-900">
              ₹{computedTotal.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="border-b border-dotted border-slate-200" />
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-medium text-slate-600">Time spent</span>
            <span className="font-medium text-slate-600">
              {computedDuty.toLowerCase().includes('on duty')
                ? computedDuty.toLowerCase()
                : `${computedDuty.toLowerCase()} on duty`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('order');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [orderCategory, setOrderCategory] = useState<OrderCategory>('new_order');
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [isSupportOpen, setIsSupportOpen] = useState<boolean>(false);

  // Earning feature states
  const [earningSubPage, setEarningSubPage] = useState<
    'main' | 'incentives' | 'rate_card' | 'week_details' | 'payout_history' | 'detail_item'
  >('main');
  const [earningPeriod, setEarningPeriod] = useState<'daily' | 'week' | 'month'>('daily');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [selectedEarningDetail, setSelectedEarningDetail] = useState<EarningBreakdownItem | null>(null);
  const [selectedWeekFromMonth, setSelectedWeekFromMonth] = useState<EarningBreakdownItem | null>(null);
  const [selectedDayFromWeek, setSelectedDayFromWeek] = useState<WeekDayRecord | null>(null);
  const [dailyTransactionFilter, setDailyTransactionFilter] = useState<
    'all' | 'orders' | 'incentives' | 'adjustments'
  >('all');

  // Dynamic Accurate Calendar for My Shifts (Current + Future 5 Dates Only)
  const baseShiftDate = useMemo(() => new Date(), []);

  const upcoming5ShiftDays = useMemo(() => {
    return getUpcoming5ShiftDays(baseShiftDate);
  }, [baseShiftDate]);

  const monthShiftGroups = useMemo(() => {
    return groupShiftDaysByMonth(upcoming5ShiftDays);
  }, [upcoming5ShiftDays]);

  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);
  const activeShiftId = selectedShiftId || upcoming5ShiftDays[0]?.id;

  // Booked shift slots mapped by date ID (e.g. '2026-10-23' -> ['morn-1'])
  const [bookedSlotsByDate, setBookedSlotsByDate] = useState<Record<string, string[]>>({
    [upcoming5ShiftDays[0]?.id || '']: ['morn-1'],
  });

  // Popup modal state to confirm a time slot
  const [slotToConfirm, setSlotToConfirm] = useState<{
    slot: ShiftTimeSlot;
    dateItem: ShiftDayItem;
    isBooked: boolean;
  } | null>(null);

  const [shiftToastMsg, setShiftToastMsg] = useState<string | null>(null);

  const activeDateItem = useMemo(() => {
    return upcoming5ShiftDays.find((d) => d.id === activeShiftId) || upcoming5ShiftDays[0];
  }, [upcoming5ShiftDays, activeShiftId]);

  const handleSlotClick = (slot: ShiftTimeSlot) => {
    if (!activeDateItem) return;
    const currentBooked = bookedSlotsByDate[activeDateItem.id] || [];
    const isBooked = currentBooked.includes(slot.id);
    setSlotToConfirm({
      slot,
      dateItem: activeDateItem,
      isBooked,
    });
  };

  const handleConfirmOrCancelSlot = () => {
    if (!slotToConfirm) return;
    const { slot, dateItem, isBooked } = slotToConfirm;
    const currentBooked = bookedSlotsByDate[dateItem.id] || [];

    if (isBooked) {
      setBookedSlotsByDate((prev) => ({
        ...prev,
        [dateItem.id]: currentBooked.filter((id) => id !== slot.id),
      }));
      setShiftToastMsg(`Cancelled ${slot.timeRange} shift for ${dateItem.dateNum} ${dateItem.monthShort}`);
    } else {
      setBookedSlotsByDate((prev) => ({
        ...prev,
        [dateItem.id]: [...currentBooked, slot.id],
      }));
      setShiftToastMsg(`Confirmed ${slot.timeRange} shift for ${dateItem.dateNum} ${dateItem.monthShort}!`);
    }
    setSlotToConfirm(null);
    setTimeout(() => {
      setShiftToastMsg(null);
    }, 3500);
  };

  const currentDay = DAILY_HEADER_DATA[selectedDayIndex] || DAILY_HEADER_DATA[0];
  const currentPeriodList =
    earningPeriod === 'daily'
      ? DAILY_EARNINGS
      : earningPeriod === 'week'
        ? WEEKLY_EARNINGS
        : MONTHLY_EARNINGS;

  const getEarningHeaderTitle = () => {
    switch (earningSubPage) {
      case 'incentives':
        return 'INCENTIVES & GUARANTEES';
      case 'rate_card':
        return 'RATE CARD';
      case 'week_details':
        return currentDay.date;
      case 'payout_history':
        return 'PAYOUT HISTORY';
      case 'detail_item':
        if (selectedDayFromWeek) {
          return selectedDayFromWeek.title;
        }
        if (selectedWeekFromMonth) {
          return selectedWeekFromMonth.title;
        }
        return selectedEarningDetail?.title || 'EARNINGS DETAILS';
      default:
        return 'EARNINGS';
    }
  };

  // Swipe detection coordinates for mobile gesture switching
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Trigger only if swipe is distinctly horizontal (> 40px threshold)
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      const currentIndex = ORDER_CATEGORIES.indexOf(orderCategory);
      if (deltaX < 0 && currentIndex < ORDER_CATEGORIES.length - 1) {
        // Swiped Left -> Move to Delivered
        setOrderCategory(ORDER_CATEGORIES[currentIndex + 1]);
      } else if (deltaX > 0 && currentIndex > 0) {
        // Swiped Right -> Move to New Order
        setOrderCategory(ORDER_CATEGORIES[currentIndex - 1]);
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // State transitions for orders
  const markAsReady = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: 'ready' } : ord))
    );
  };

  const markAsDelivered = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: 'delivered' } : ord))
    );
  };

  const newOrdersList = orders.filter((o) => o.status !== 'delivered');
  const deliveredOrdersList = orders.filter((o) => o.status === 'delivered');

  const newOrdersCount = newOrdersList.length;
  const deliveredOrdersCount = deliveredOrdersList.length;

  const currentDisplayOrders =
    orderCategory === 'new_order' ? newOrdersList : deliveredOrdersList;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans selection:bg-slate-100 selection:text-slate-900">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
        {/* Row 1: Online/Offline Switch & Customer Support (Only in Order Page), Text Heading on Other Pages */}
        {activeTab === 'order' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
            {/* Left: Compact Solid Green/Red Online / Offline Switch */}
            <div className="flex items-center">
              <button
                type="button"
                role="switch"
                aria-checked={isOnline}
                onClick={() => setIsOnline(!isOnline)}
                aria-label={`Store status: ${isOnline ? 'Online' : 'Offline'}. Click to toggle.`}
                className={`group relative inline-flex items-center h-8 w-[94px] rounded-full p-1 select-none cursor-pointer
                           transition-colors duration-300 active:scale-[0.97] 
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                             isOnline
                               ? 'bg-emerald-500 hover:bg-emerald-600 shadow-[0_3px_10px_rgba(16,185,129,0.32)] focus-visible:ring-emerald-500'
                               : 'bg-red-500 hover:bg-red-600 shadow-[0_3px_10px_rgba(239,68,68,0.32)] focus-visible:ring-red-500'
                           }`}
              >
                {/* Left Side Label: Shown when knob is on the RIGHT side (Online) */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: isOnline ? 1 : 0,
                    x: isOnline ? 0 : -4,
                  }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute left-2.5 inset-y-0 flex items-center pointer-events-none"
                >
                  <span className="text-[11px] font-bold text-white tracking-tight font-sans">
                    Online
                  </span>
                </motion.div>

                {/* Right Side Label: Shown when knob is on the LEFT side (Offline) */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: !isOnline ? 1 : 0,
                    x: !isOnline ? 0 : 4,
                  }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-2.5 inset-y-0 flex items-center pointer-events-none"
                >
                  <span className="text-[11px] font-bold text-white tracking-tight font-sans">
                    Offline
                  </span>
                </motion.div>

                {/* Solid White Circular Slider Knob */}
                <motion.div
                  layout
                  initial={false}
                  animate={{
                    x: isOnline ? 62 : 0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 32,
                    mass: 0.8,
                  }}
                  className="relative z-10 w-6 h-6 rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,0.22)] pointer-events-none"
                />
              </button>
            </div>

            {/* Right: Customer Care Button */}
            <div className="flex items-center">
              <button
                onClick={() => setIsSupportOpen(true)}
                title="Customer Support"
                aria-label="Customer Support"
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition active:scale-95"
              >
                <Headphones className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : activeTab === 'earning' && earningSubPage !== 'main' ? (
          /* Sub-page header with tailless arrow back button and left-aligned title next to it */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (selectedDayFromWeek) {
                  setSelectedDayFromWeek(null);
                } else if (selectedWeekFromMonth) {
                  setSelectedWeekFromMonth(null);
                } else {
                  setEarningSubPage('main');
                  setSelectedEarningDetail(null);
                }
              }}
              aria-label="Back"
              className="p-1 -ml-1 text-slate-800 hover:text-black transition cursor-pointer shrink-0"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
            </button>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-wider uppercase text-left truncate">
              {getEarningHeaderTitle()}
            </h1>
          </div>
        ) : (
          /* For other pages (Earning main, My Shifts, Profile): Only show text as heading */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-center">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-wider uppercase">
              {activeTab === 'earning' && 'EARNINGS'}
              {activeTab === 'my_shifts' && 'My Shifts'}
              {activeTab === 'profile' && 'Profile'}
            </h1>
          </div>
        )}

        {/* Row 2: Text-Type Tab Buttons with Active Green Horizontal Line (Visible ONLY for Order Page) */}
        {activeTab === 'order' && (
          <div className="border-t border-slate-100 bg-white px-4 sm:px-6 transition-all">
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-8 sm:gap-12 w-full">
              {/* Button 1: New Order (Text type with green underline when active) */}
              <button
                type="button"
                onClick={() => setOrderCategory('new_order')}
                className={`relative py-3 text-sm sm:text-base font-semibold transition-colors duration-200 select-none cursor-pointer flex items-center gap-2 ${
                  orderCategory === 'new_order'
                    ? 'text-slate-900'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span>New Order</span>
                {newOrdersCount > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold transition-colors ${
                      orderCategory === 'new_order'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {newOrdersCount}
                  </span>
                )}

                {/* Horizontal Green Line below button when active */}
                {orderCategory === 'new_order' && (
                  <motion.div
                    layoutId="activeOrderUnderline"
                    className="absolute bottom-0 inset-x-0 h-[2.5px] bg-emerald-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>

              {/* Button 2: Delivered (Text type with green underline when active) */}
              <button
                type="button"
                onClick={() => setOrderCategory('delivered')}
                className={`relative py-3 text-sm sm:text-base font-semibold transition-colors duration-200 select-none cursor-pointer flex items-center gap-2 ${
                  orderCategory === 'delivered'
                    ? 'text-slate-900'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span>Delivered</span>
                {deliveredOrdersCount > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold transition-colors ${
                      orderCategory === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {deliveredOrdersCount}
                  </span>
                )}

                {/* Horizontal Green Line below button when active */}
                {orderCategory === 'delivered' && (
                  <motion.div
                    layoutId="activeOrderUnderline"
                    className="absolute bottom-0 inset-x-0 h-[2.5px] bg-emerald-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area with Swipe Gesture Support */}
      <main
        onTouchStart={activeTab === 'order' ? handleTouchStart : undefined}
        onTouchEnd={activeTab === 'order' ? handleTouchEnd : undefined}
        className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-24"
      >
        {/* Order Page: New Order and Delivered pages - All content removed */}
        {activeTab === 'order' && (
          <div className="min-h-[50vh]" />
        )}

        {/* Profile Tab View */}
        {activeTab === 'profile' && (
          <div className="space-y-4 max-w-xl mx-auto pt-2">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Smartrun Kitchen
                  </h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Indiranagar, Bengaluru • ID: PTR-9921448
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-500 font-medium block">
                    Operating Status
                  </span>
                  <span
                    className={`font-semibold ${
                      isOnline ? 'text-emerald-600' : 'text-red-500'
                    }`}
                  >
                    {isOnline ? '● Accepting Orders' : '○ Offline'}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-500 font-medium block">
                    Today&apos;s Revenue
                  </span>
                  <span className="font-semibold text-slate-900">₹3,095</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 divide-y divide-slate-100 shadow-xs text-xs overflow-hidden">
              <button
                type="button"
                onClick={() => setIsSupportOpen(true)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 text-left transition"
              >
                <div className="flex items-center gap-3 text-slate-700">
                  <Headphones className="w-4 h-4 text-slate-500" />
                  <span className="font-medium">Restaurant Partner Support</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <div className="flex items-center justify-between p-4 text-slate-700">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="font-medium">Opening Hours</span>
                </div>
                <span className="text-slate-500 font-medium">10:00 AM - 11:30 PM</span>
              </div>
              <div className="flex items-center justify-between p-4 text-slate-700">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-slate-500" />
                  <span className="font-medium">App Version</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">v2.4.0 (Cloud Run)</span>
              </div>
            </div>
          </div>
        )}

        {/* Earning Tab View (Complete Delivery Partner Design in All Capitals) */}
        {activeTab === 'earning' && (
          <div className="max-w-xl mx-auto space-y-4 pt-1">
            {/* Sub-Page 1: INCENTIVES & GUARANTEES (Empty with tailless arrow navigation) */}
            {earningSubPage === 'incentives' && (
              <div className="space-y-4 pt-2">
                <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
                    <CoinStack3DIcon />
                  </div>
                  <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">
                    INCENTIVES & GUARANTEES
                  </h2>
                  <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto uppercase leading-relaxed font-semibold">
                    NO ACTIVE INCENTIVE TARGETS OR GUARANTEED MINIMUM PAY SCHEMES CURRENTLY CONFIGURED FOR THIS DELIVERY SLOT. CHECK BACK DURING PEAK HOURS.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setEarningSubPage('main')}
                      aria-label="Back"
                      className="p-2 text-slate-700 hover:text-black transition cursor-pointer"
                    >
                      <ChevronLeft className="w-7 h-7 stroke-[2.2]" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Page 2: RATE CARD (Empty with tailless arrow navigation) */}
            {earningSubPage === 'rate_card' && (
              <div className="space-y-4 pt-2">
                <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                    <Calendar3DIcon />
                  </div>
                  <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">
                    RATE CARD
                  </h2>
                  <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto uppercase leading-relaxed font-semibold">
                    ZONE FARE STRUCTURES, PER-KILOMETER BASE PAYOUTS, WAITING TIME COMPENSATION, AND RAIN SURGE SLABS WILL BE PUBLISHED HERE.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setEarningSubPage('main')}
                      aria-label="Back"
                      className="p-2 text-slate-700 hover:text-black transition cursor-pointer"
                    >
                      <ChevronLeft className="w-7 h-7 stroke-[2.2]" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Page 3: DAILY DETAILS (Full page view for SEE DETAILS - matches screenshot) */}
            {earningSubPage === 'week_details' && (
              <DailyEarningsInsideView
                date={currentDay.date}
                totalAmount={currentDay.total}
                dutyHours={currentDay.duty}
                orderEarnings={currentDay.basePay ?? 50}
                customerTips={currentDay.tips ?? 1020}
                adjustments={currentDay.adjustments ?? -62}
                filter={dailyTransactionFilter}
                onFilterChange={setDailyTransactionFilter}
                transactions={SAMPLE_DAILY_TRANSACTIONS}
              />
            )}

            {/* Sub-Page 4: PAYOUT HISTORY (Full page view for PAYOUT HISTORY button) */}
            {earningSubPage === 'payout_history' && (
              <div className="space-y-4 pt-1">
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
                  <div className="pb-3 border-b border-slate-100">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      TRANSACTION RECORDS
                    </span>
                    <h2 className="text-base font-black text-slate-900 uppercase tracking-tight mt-0.5">
                      DIRECT BANK TRANSFER SETTLEMENTS
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/80 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-black text-slate-900 block">
                          ₹7,650.00
                        </span>
                        <span className="text-[11px] font-bold text-slate-500 uppercase block mt-0.5">
                          TRANSFER DATE: 04 AUG 2026 • REF: #TXN-994102
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full uppercase">
                        SETTLED
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/80 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-black text-slate-900 block">
                          ₹8,420.00
                        </span>
                        <span className="text-[11px] font-bold text-slate-500 uppercase block mt-0.5">
                          TRANSFER DATE: 28 JUL 2026 • REF: #TXN-881294
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full uppercase">
                        SETTLED
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/80 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-black text-slate-900 block">
                          ₹6,190.00
                        </span>
                        <span className="text-[11px] font-bold text-slate-500 uppercase block mt-0.5">
                          TRANSFER DATE: 21 JUL 2026 • REF: #TXN-773418
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full uppercase">
                        SETTLED
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5 text-[11px] font-bold text-slate-500 uppercase text-center">
                    TRANSFERRED AUTOMATICALLY EVERY TUESDAY TO HDFC BANK (•••• 4819)
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Page 5: DETAIL ITEM (Opened when clicking row in DAILY, WEEK, or MONTH) */}
            {earningSubPage === 'detail_item' && selectedEarningDetail && (
              selectedDayFromWeek ? (
                <DailyEarningsInsideView
                  date={selectedDayFromWeek.title}
                  totalAmount={selectedDayFromWeek.amount}
                  dutyHours={selectedDayFromWeek.dutyHours}
                  orderEarnings={selectedDayFromWeek.basePay ?? 50}
                  customerTips={selectedDayFromWeek.tips ?? 1020}
                  adjustments={selectedDayFromWeek.adjustments ?? -62}
                  filter={dailyTransactionFilter}
                  onFilterChange={setDailyTransactionFilter}
                  transactions={SAMPLE_DAILY_TRANSACTIONS}
                />
              ) : selectedWeekFromMonth ? (
                <WeekEarningsInsideView
                  weekTitle={selectedWeekFromMonth.title}
                  totalAmount={selectedWeekFromMonth.amount}
                  dutyHours={selectedWeekFromMonth.dutyHours}
                  orderEarnings={selectedWeekFromMonth.basePay}
                  customerTips={selectedWeekFromMonth.tips}
                  adjustments={selectedWeekFromMonth.adjustments ?? -62}
                  payout={selectedWeekFromMonth.payout ?? 0}
                  days={selectedWeekFromMonth.days}
                  onSelectDay={(day) => setSelectedDayFromWeek(day)}
                />
              ) : selectedEarningDetail.id.startsWith('d-') || earningPeriod === 'daily' ? (
                <DailyEarningsInsideView
                  date={selectedEarningDetail.title}
                  totalAmount={selectedEarningDetail.amount}
                  dutyHours={selectedEarningDetail.dutyHours}
                  orderEarnings={selectedEarningDetail.basePay}
                  customerTips={selectedEarningDetail.tips}
                  adjustments={selectedEarningDetail.adjustments ?? -62}
                  filter={dailyTransactionFilter}
                  onFilterChange={setDailyTransactionFilter}
                  transactions={SAMPLE_DAILY_TRANSACTIONS}
                />
              ) : selectedEarningDetail.id.startsWith('w-') || earningPeriod === 'week' ? (
                <WeekEarningsInsideView
                  weekTitle={selectedEarningDetail.title}
                  totalAmount={selectedEarningDetail.amount}
                  dutyHours={selectedEarningDetail.dutyHours}
                  orderEarnings={selectedEarningDetail.basePay}
                  customerTips={selectedEarningDetail.tips}
                  adjustments={selectedEarningDetail.adjustments ?? -62}
                  payout={selectedEarningDetail.payout ?? 0}
                  days={selectedEarningDetail.days}
                  onSelectDay={(day) => setSelectedDayFromWeek(day)}
                />
              ) : (
                <MonthEarningsInsideView
                  monthTitle={selectedEarningDetail.title}
                  totalAmount={selectedEarningDetail.amount}
                  dutyHours={selectedEarningDetail.dutyHours}
                  orderEarnings={selectedEarningDetail.basePay}
                  customerTips={selectedEarningDetail.tips}
                  adjustments={selectedEarningDetail.adjustments ?? -62}
                  payout={selectedEarningDetail.payout ?? 0}
                  weeks={selectedEarningDetail.weeks}
                  onSelectWeek={(week) => setSelectedWeekFromMonth(week)}
                />
              )
            )}

            {/* Main Earnings Dashboard (when earningSubPage === 'main') */}
            {earningSubPage === 'main' && (
              <div className="space-y-4">
                {/* 1. Top Two Card Boxes: INCENTIVES & GUARANTEES and RATE CARD */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Card 1: INCENTIVES & GUARANTEES */}
                  <button
                    type="button"
                    onClick={() => setEarningSubPage('incentives')}
                    className="bg-[#f2f4f7] hover:bg-[#e9ecf0] active:scale-[0.98] transition-all rounded-3xl p-4 flex flex-col items-center justify-center text-center cursor-pointer shadow-xs border border-slate-100 group"
                  >
                    <div className="w-14 h-14 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <CoinStack3DIcon />
                    </div>
                    <span className="text-xs font-black text-slate-800 mt-2.5 leading-snug uppercase tracking-tight">
                      INCENTIVES & GUARANTEES
                    </span>
                  </button>

                  {/* Card 2: RATE CARD */}
                  <button
                    type="button"
                    onClick={() => setEarningSubPage('rate_card')}
                    className="bg-[#f2f4f7] hover:bg-[#e9ecf0] active:scale-[0.98] transition-all rounded-3xl p-4 flex flex-col items-center justify-center text-center cursor-pointer shadow-xs border border-slate-100 group"
                  >
                    <div className="w-14 h-14 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Calendar3DIcon />
                    </div>
                    <span className="text-xs font-black text-slate-800 mt-2.5 leading-snug uppercase tracking-tight">
                      RATE CARD
                    </span>
                  </button>
                </div>

                {/* 2. Main Today/Daily Total Earning Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-4">
                  {/* Date in daily format with navigation arrows to see yesterday and other dates */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedDayIndex((prev) =>
                            Math.min(prev + 1, DAILY_HEADER_DATA.length - 1)
                          )
                        }
                        disabled={selectedDayIndex >= DAILY_HEADER_DATA.length - 1}
                        aria-label="Previous day"
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4 text-orange-500 stroke-[2.5]" />
                      </button>
                      <span className="text-sm font-black text-slate-800 tracking-wider uppercase">
                        {currentDay.date}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedDayIndex((prev) => Math.max(prev - 1, 0))
                        }
                        disabled={selectedDayIndex <= 0}
                        aria-label="Next day"
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4 text-orange-500 stroke-[2.5]" />
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-400 font-extrabold uppercase mt-0.5 tracking-wider">
                      {currentDay.label}
                    </span>
                  </div>

                  <div className="border-b border-dashed border-slate-200" />

                  {/* Total Earnings & Rider Avatar */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 font-extrabold uppercase block tracking-wider">
                        TOTAL EARNINGS
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight block mt-0.5">
                        ₹{currentDay.total.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-bold uppercase">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {currentDay.duty}
                      </span>
                    </div>
                    <div className="w-16 h-16 flex items-center justify-center">
                      <RiderAvatarIcon className="w-16 h-16 drop-shadow-xs" />
                    </div>
                  </div>

                  {/* Goal message for motivation */}
                  <div className="bg-[#e6f8f0] border border-emerald-100 rounded-2xl p-3 flex items-center gap-2.5 text-xs font-black text-emerald-900 uppercase shadow-xs">
                    <span className="text-base select-none">{currentDay.goalEmoji}</span>
                    <span>{currentDay.goalMsg}</span>
                  </div>

                  <div className="border-b border-dashed border-slate-200" />

                  {/* See details button: opens in new page */}
                  <button
                    type="button"
                    onClick={() => setEarningSubPage('week_details')}
                    className="w-full text-center flex items-center justify-center gap-1 text-xs font-black text-orange-500 hover:text-orange-600 transition cursor-pointer pt-1 uppercase tracking-wider"
                  >
                    <span>SEE DETAILS</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>

                {/* 3. Payout Status Notice Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 text-center shadow-xs space-y-2.5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">
                    NO PAYOUT TRANSFERRED DUE TO NO EARNINGS
                  </p>
                  <div className="border-b border-dashed border-slate-100" />
                  <button
                    type="button"
                    onClick={() => setEarningSubPage('payout_history')}
                    className="inline-flex items-center justify-center gap-1 text-xs font-black text-orange-500 hover:text-orange-600 transition cursor-pointer uppercase tracking-wider"
                  >
                    <span>PAYOUT HISTORY</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>

                {/* 4. DAILY, WEEK, and MONTH Section: Edge-to-edge full width touching both sides, sticky sub-navbar when scrolled */}
                <div className="pt-2">
                  {/* Sticky Edge-to-Edge Sub-Navbar: DAILY, WEEK, MONTH */}
                  <div className="sticky top-14 sm:top-16 z-30 bg-white border-y border-slate-200/90 shadow-xs -mx-4 sm:-mx-6 lg:-mx-8 grid grid-cols-3">
                    {(['daily', 'week', 'month'] as const).map((period) => (
                      <button
                        key={period}
                        type="button"
                        onClick={() => {
                          setSelectedDayFromWeek(null);
                          setSelectedWeekFromMonth(null);
                          setEarningPeriod(period);
                        }}
                        className={`relative py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-center transition cursor-pointer select-none ${
                          earningPeriod === period
                            ? 'text-orange-500 font-black'
                            : 'text-black hover:text-orange-600'
                        }`}
                      >
                        <span>{period.toUpperCase()}</span>
                        {earningPeriod === period && (
                          <motion.div
                            layoutId="earningPeriodUnderline"
                            className="absolute bottom-0 inset-x-4 sm:inset-x-8 h-[2.5px] bg-orange-500 rounded-full"
                            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* List Items touching both sides of phone screen */}
                  <div className="-mx-4 sm:-mx-6 lg:-mx-8 divide-y divide-slate-100 bg-white border-b border-slate-200/80">
                    <div className="max-w-xl mx-auto divide-y divide-slate-100">
                      {currentPeriodList.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedDayFromWeek(null);
                            setSelectedWeekFromMonth(null);
                            setSelectedEarningDetail(item);
                            setEarningSubPage('detail_item');
                          }}
                          className="px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-slate-50/90 active:bg-slate-100/80 transition cursor-pointer group"
                        >
                          <div>
                            <span className="text-xs sm:text-sm font-black text-slate-800 uppercase block tracking-wide group-hover:text-slate-900 transition-colors">
                              {item.title}
                            </span>
                            <span className="text-[11px] text-black font-normal uppercase tracking-tight block mt-0.5">
                              {item.subtitle}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                              ₹{item.amount.toLocaleString('en-IN')}
                            </span>
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-orange-500 group-hover:translate-x-1 transition-transform">
                              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* My Shifts Tab View */}
        {activeTab === 'my_shifts' && (
          <div className="max-w-xl mx-auto pt-2">
            {/* Horizontal Date Card Strip Grouped by Month */}
            <div className="w-full overflow-x-auto no-scrollbar py-1 -mx-4 sm:-mx-6 px-4 sm:px-6">
              <div className="flex items-start gap-4 min-w-max pb-1">
                {monthShiftGroups.map((group) => (
                  <div key={`${group.monthShort}-${group.year}`} className="flex flex-col">
                    {/* Month Name Above of That Date / Group */}
                    <div className="px-1 mb-2">
                      <span className="text-sm font-extrabold text-slate-900 tracking-wider uppercase">
                        {group.monthShort}
                      </span>
                    </div>

                    {/* Date Boxes Side by Side */}
                    <div className="flex items-center gap-2">
                      {group.days.map((item) => {
                        const isSelected = activeShiftId === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedShiftId(item.id)}
                            className={`flex flex-col items-center justify-center min-w-[58px] sm:min-w-[64px] h-[68px] sm:h-[72px] rounded-2xl px-2 transition-all duration-150 select-none cursor-pointer border relative ${
                              isSelected
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/20 scale-[1.02]'
                                : item.isToday
                                  ? 'bg-emerald-50/60 border-emerald-200 text-slate-800 hover:border-emerald-300'
                                  : 'bg-white border-slate-200/90 text-slate-800 hover:border-slate-300 hover:bg-slate-50/80'
                            }`}
                          >
                            <span
                              className={`text-lg sm:text-xl font-bold tracking-tight leading-none ${
                                isSelected ? 'text-white' : 'text-slate-900'
                              }`}
                            >
                              {item.dateNum}
                            </span>
                            <span
                              className={`text-[11px] font-bold tracking-wider uppercase mt-1 leading-none ${
                                isSelected
                                  ? 'text-emerald-100'
                                  : item.isToday
                                    ? 'text-emerald-700 font-extrabold'
                                    : 'text-slate-400'
                              }`}
                            >
                              {item.dayName}
                            </span>
                            {item.isToday && !isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-2 right-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Slot Sections for Selected Date */}
            <div className="mt-5 space-y-6 pb-24">
              {/* Notification Toast */}
              <AnimatePresence>
                {shiftToastMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md text-xs font-bold flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{shiftToastMsg}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShiftToastMsg(null)}
                      className="p-0.5 hover:bg-emerald-700 rounded-full transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Shift Periods: Morning, Afternoon, Evening */}
              {(
                [
                  {
                    key: 'morning',
                    title: 'Morning',
                    icon: Sunrise,
                    iconColor: 'text-amber-500',
                    bgComponent: MorningSunriseBg,
                  },
                  {
                    key: 'afternoon',
                    title: 'Afternoon',
                    icon: Sun,
                    iconColor: 'text-amber-500',
                    bgComponent: NoonSunBg,
                  },
                  {
                    key: 'evening',
                    title: 'Evening',
                    icon: Sunset,
                    iconColor: 'text-indigo-400',
                    bgComponent: NightSundownBg,
                  },
                ] as const
              ).map((periodGroup) => {
                const slots = SHIFT_TIME_SLOTS.filter(
                  (s) => s.period === periodGroup.key
                );
                const activeBookedSlotIds =
                  bookedSlotsByDate[activeDateItem?.id || ''] || [];
                const IconComponent = periodGroup.icon;
                const BgComponent = periodGroup.bgComponent;

                return (
                  <div
                    key={periodGroup.key}
                    className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xs p-4 sm:p-5 transition-all bg-white/70"
                  >
                    {/* Transparent Blurry Background Image Type */}
                    <BgComponent />

                    {/* Content Layer (z-10 relative) */}
                    <div className="relative z-10 space-y-3">
                      {/* Heading with Logo (NO CARD, JUST IMAGE & HEADING TEXT) with line below */}
                      <div className="flex items-center gap-2 px-1">
                        <div className={`w-5 h-5 flex items-center justify-center ${periodGroup.iconColor}`}>
                          <IconComponent className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-900 tracking-wide uppercase">
                          {periodGroup.title}
                        </h3>
                      </div>
                      {/* Horizontal Line Directly Below Heading */}
                      <div className="border-b border-slate-200/80" />

                      {/* Time Slot Buttons */}
                      <div className="space-y-2 pt-0.5">
                        {slots.map((slot) => {
                          const isPicked = activeBookedSlotIds.includes(slot.id);

                          return (
                            <button
                              key={slot.id}
                              type="button"
                              onClick={() => handleSlotClick(slot)}
                              className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl transition-all duration-200 select-none cursor-pointer border text-left ${
                                isPicked
                                  ? 'bg-emerald-50/95 border-emerald-500 shadow-xs'
                                  : 'bg-white/90 backdrop-blur-xs border-slate-200/90 hover:border-slate-300 hover:bg-white shadow-2xs'
                              }`}
                            >
                              {/* Left Side: Time Range & Duration/Tag (Clean: No Money, No Bonus) */}
                              <div className="space-y-0.5">
                                <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight block">
                                  {slot.timeRange}
                                </span>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                  <span>{slot.duration}</span>
                                  <span>•</span>
                                  <span>{slot.tag}</span>
                                </div>
                              </div>

                              {/* Right Side: Circle design to tick and pick time slot */}
                              <div className="flex items-center shrink-0 ml-3">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                    isPicked
                                      ? 'bg-emerald-600 text-white shadow-xs scale-105'
                                      : 'border-2 border-slate-300 bg-white hover:border-slate-400'
                                  }`}
                                >
                                  {isPicked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Popup Modal to Confirm Time Slot */}
            <AnimatePresence>
              {slotToConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative"
                  >
                    {/* Close button */}
                    <button
                      type="button"
                      onClick={() => setSlotToConfirm(null)}
                      className="absolute top-4 right-4 p-1.5 text-black/50 hover:text-black hover:bg-slate-100 rounded-full transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Header Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                      <CalendarClock className="w-6 h-6 stroke-[1.8]" />
                    </div>

                    <h3 className="text-base sm:text-lg font-semibold text-black text-center tracking-tight">
                      {slotToConfirm.isBooked ? 'Manage Time Slot' : 'Confirm Time Slot'}
                    </h3>

                    <p className="text-xs text-black/70 text-center mt-1 font-normal">
                      {slotToConfirm.dateItem.dayName}, {slotToConfirm.dateItem.dateNum}{' '}
                      {slotToConfirm.dateItem.monthShort} {slotToConfirm.dateItem.year}
                    </p>

                    {/* Slot details card (Clean without money or bonus, less bold, proper black color) */}
                    <div className="my-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-black/70 font-normal">Shift Time:</span>
                        <span className="font-medium text-black">
                          {slotToConfirm.slot.timeRange}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-black/70 font-normal">Duration:</span>
                        <span className="font-normal text-black">
                          {slotToConfirm.slot.duration} ({slotToConfirm.slot.tag})
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-black/70 font-normal">Status:</span>
                        <span
                          className={`font-medium ${
                            slotToConfirm.isBooked ? 'text-black' : 'text-black/80'
                          }`}
                        >
                          {slotToConfirm.isBooked ? 'Currently Booked' : 'Available for Booking'}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-black/60 text-center leading-relaxed font-normal">
                      {slotToConfirm.isBooked
                        ? 'You can cancel this slot anytime before 1 hour of shift commencement.'
                        : 'Confirming will reserve your slot. Please check-in within 15 minutes of shift start.'}
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-5 space-y-2">
                      <button
                        type="button"
                        onClick={handleConfirmOrCancelSlot}
                        className={`w-full py-3 px-4 rounded-xl font-medium text-xs sm:text-sm shadow-xs transition cursor-pointer ${
                          slotToConfirm.isBooked
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                        }`}
                      >
                        {slotToConfirm.isBooked ? 'Cancel' : 'Confirm'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSlotToConfirm(null)}
                        className="w-full py-2 text-xs font-normal text-black hover:text-black/80 transition cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Docked Mobile Bottom Navigation Bar (Logo on Top, Name Below) */}
      <nav
        aria-label="Bottom Navigation"
        className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]"
      >
        <div className="max-w-md mx-auto grid grid-cols-4 h-16 px-1 items-center">
          {/* 1. Order Tab Button */}
          <button
            type="button"
            onClick={() => setActiveTab('order')}
            className="relative flex flex-col items-center justify-center h-full w-full py-1 text-center select-none group transition-colors duration-200 cursor-pointer"
          >
            <ShoppingBag
              className={`w-5 h-5 transition-transform duration-200 ${
                activeTab === 'order'
                  ? 'text-emerald-600 scale-105 stroke-[2.2]'
                  : 'text-black group-hover:text-black stroke-[1.8]'
              }`}
            />
            <span
              className={`text-[11px] mt-1 tracking-tight leading-none transition-colors duration-200 ${
                activeTab === 'order'
                  ? 'font-bold text-emerald-600'
                  : 'font-medium text-black'
              }`}
            >
              Order
            </span>
          </button>

          {/* 2. Earning Tab Button */}
          <button
            type="button"
            onClick={() => setActiveTab('earning')}
            className="relative flex flex-col items-center justify-center h-full w-full py-1 text-center select-none group transition-colors duration-200 cursor-pointer"
          >
            <Wallet
              className={`w-5 h-5 transition-transform duration-200 ${
                activeTab === 'earning'
                  ? 'text-[#B08968] scale-105 stroke-[2.2]'
                  : 'text-black group-hover:text-black stroke-[1.8]'
              }`}
            />
            <span
              className={`text-[11px] mt-1 tracking-tight leading-none transition-colors duration-200 ${
                activeTab === 'earning'
                  ? 'font-bold text-[#B08968]'
                  : 'font-medium text-black'
              }`}
            >
              Earning
            </span>
          </button>

          {/* 3. My Shifts Tab Button */}
          <button
            type="button"
            onClick={() => setActiveTab('my_shifts')}
            className="relative flex flex-col items-center justify-center h-full w-full py-1 text-center select-none group transition-colors duration-200 cursor-pointer"
          >
            <CalendarClock
              className={`w-5 h-5 transition-transform duration-200 ${
                activeTab === 'my_shifts'
                  ? 'text-blue-600 scale-105 stroke-[2.2]'
                  : 'text-black group-hover:text-black stroke-[1.8]'
              }`}
            />
            <span
              className={`text-[11px] mt-1 tracking-tight leading-none transition-colors duration-200 whitespace-nowrap ${
                activeTab === 'my_shifts'
                  ? 'font-bold text-blue-600'
                  : 'font-medium text-black'
              }`}
            >
              My Shifts
            </span>
          </button>

          {/* 4. Profile Tab Button */}
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className="relative flex flex-col items-center justify-center h-full w-full py-1 text-center select-none group transition-colors duration-200 cursor-pointer"
          >
            <User
              className={`w-5 h-5 transition-transform duration-200 ${
                activeTab === 'profile'
                  ? 'text-[#0D9488] scale-105 stroke-[2.2]'
                  : 'text-black group-hover:text-black stroke-[1.8]'
              }`}
            />
            <span
              className={`text-[11px] mt-1 tracking-tight leading-none transition-colors duration-200 ${
                activeTab === 'profile'
                  ? 'font-bold text-[#0D9488]'
                  : 'font-medium text-black'
              }`}
            >
              Profile
            </span>
          </button>
        </div>
      </nav>

      {/* Customer Support Modal */}
      <AnimatePresence>
        {isSupportOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl border border-slate-200/80"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Partner Customer Care
                    </h3>
                    <p className="text-[11px] text-slate-500">24/7 Dedicated Support</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSupportOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-2.5">
                <a
                  href="tel:18002089999"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-slate-800 text-xs font-semibold"
                >
                  <span className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    Call Partner Helpline (1800-208-9999)
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                    Toll-Free
                  </span>
                </a>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-slate-800 text-xs font-semibold cursor-pointer">
                  <span className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    Live Priority Chat Support
                  </span>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold">
                    Instant
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSupportOpen(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
