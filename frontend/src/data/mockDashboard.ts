import { DashboardStats } from '../types';

export const mockDashboardStats: DashboardStats = {
  totalLeads: 12,
  activeLeads: 8,
  conversionRate: 25.0, // (Booked / Total) = 3 / 12 * 100 = 25%
  avgResponseTimeMs: 420,
  leadTemperatures: {
    Hot: 2,       // Rahul, Sneha
    Warm: 1,      // Priya
    Cold: 1,      // (New sessions / others)
    Escalated: 1  // Arjun
  },
  escalationsCount: 1, // Arjun
  siteVisitsCount: 1,  // Sneha
  funnelStats: {
    visited: 12,
    qualified: 8,
    recommended: 6,
    booked: 3,
    escalated: 1
  },
  weeklyBookingTrends: [
    { day: 'Mon', bookings: 0 },
    { day: 'Tue', bookings: 1 },
    { day: 'Wed', bookings: 0 },
    { day: 'Thu', bookings: 2 },
    { day: 'Fri', bookings: 1 },
    { day: 'Sat', bookings: 3 },
    { day: 'Sun', bookings: 1 }
  ],
  activityFeed: [
    {
      id: 'act-1',
      sessionName: 'Sneha Reddy',
      timestamp: '10:08 AM',
      description: 'Booked a Site Visit to Pinewood Estates for Saturday 11 AM.',
      type: 'booking'
    },
    {
      id: 'act-2',
      sessionName: 'Rahul Sharma',
      timestamp: '10:20 AM',
      description: 'Recommended Green Meadows Phase 1 (Plot A12) - Match Score 95%.',
      type: 'recommendation'
    },
    {
      id: 'act-3',
      sessionName: 'Arjun Mehta',
      timestamp: 'Tuesday',
      description: 'Session escalated to Senior Sales Executive (requested price negotiation).',
      type: 'escalated'
    },
    {
      id: 'act-4',
      sessionName: 'Priya Reddy',
      timestamp: '9:30 AM',
      description: 'Customer updated budget preferences to Under 45 Lakhs, location: Shankarpally.',
      type: 'message'
    },
    {
      id: 'act-5',
      sessionName: 'Vikram Rao',
      timestamp: 'Yesterday',
      description: 'New lead joined from Facebook WhatsApp Click-to-Chat ad.',
      type: 'joined'
    }
  ]
};
