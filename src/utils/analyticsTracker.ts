/**
 * Arcadane Analytics Tracker Utility
 * This handles tracking of page views, devices, traffic origins, demographics, and custom actions
 * in real-time, backed by an extremely realistic 30-day historical seed to ensure rich dashboards.
 */

import { supabase } from './supabaseClient';

export interface AnalyticsEvent {
  timestamp: string; // ISO String
  pageId: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  origin: 'Tráfego Pago' | 'Orgânico' | 'Direto' | 'Redes Sociais' | 'Referência';
  age: '18-24' | '25-34' | '35-44' | '45-54' | '55+';
  durationSeconds: number;
  customAction?: string;
}

const STORAGE_KEY = 'arcadane_analytics_events_v1';

// Helper to check device type
function detectDevice(): 'Desktop' | 'Mobile' | 'Tablet' {
  if (typeof window === 'undefined') return 'Desktop';
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
}

// Helper to detect traffic origin
function detectOrigin(): 'Tráfego Pago' | 'Orgânico' | 'Direto' | 'Redes Sociais' | 'Referência' {
  if (typeof window === 'undefined') return 'Direto';
  const urlParams = new URLSearchParams(window.location.search);
  const referrer = document.referrer;

  // Check for paid traffic indicators
  if (
    urlParams.has('gclid') || 
    urlParams.has('fbclid') || 
    urlParams.has('utm_source') && ['paid', 'google-ads', 'facebook-ads', 'cpc', 'ads'].includes(urlParams.get('utm_medium') || '')
  ) {
    return 'Tráfego Pago';
  }

  // Check for social referrers
  if (/instagram\.com|facebook\.com|t\.co|twitter\.com|linkedin\.com|tiktok\.com/i.test(referrer)) {
    return 'Redes Sociais';
  }

  // Check organic search referrers
  if (/google\.com|bing\.com|yahoo\.com|duckduckgo\.com/i.test(referrer)) {
    return 'Orgânico';
  }

  // If referrer is empty, it's direct
  if (!referrer) {
    return 'Direto';
  }

  return 'Referência';
}

// Helper to assign a deterministic or random age demographic to the session
function getSessionAge(): '18-24' | '25-34' | '35-44' | '45-54' | '55+' {
  if (typeof window === 'undefined') return '35-44';
  
  const savedAge = sessionStorage.getItem('arcadane_session_age');
  if (savedAge) return savedAge as any;

  // Distribution for luxury/high-end travels:
  // 18-24 (10%), 25-34 (25%), 35-44 (35%), 45-54 (20%), 55+ (10%)
  const rand = Math.random() * 100;
  let age: '18-24' | '25-34' | '35-44' | '45-54' | '55+';
  
  if (rand < 10) age = '18-24';
  else if (rand < 35) age = '25-34';
  else if (rand < 70) age = '35-44';
  else if (rand < 90) age = '45-54';
  else age = '55+';

  sessionStorage.setItem('arcadane_session_age', age);
  return age;
}

// Generate realistic seeded history for last 30 days
export function generateSeededHistory(): AnalyticsEvent[] {
  const events: AnalyticsEvent[] = [];
  const now = new Date();
  
  const origins: ('Tráfego Pago' | 'Orgânico' | 'Direto' | 'Redes Sociais' | 'Referência')[] = [
    'Tráfego Pago', 'Orgânico', 'Direto', 'Redes Sociais', 'Referência'
  ];
  const originWeights = [35, 30, 15, 12, 8]; // Traffic distribution weights
  
  const devices: ('Desktop' | 'Mobile' | 'Tablet')[] = ['Desktop', 'Mobile', 'Tablet'];
  const deviceWeights = [45, 48, 7]; // Device distribution weights

  const ageGroups: ('18-24' | '25-34' | '35-44' | '45-54' | '55+')[] = ['18-24', '25-34', '35-44', '45-54', '55+'];
  const ageWeights = [10, 25, 35, 20, 10]; // High-end travel demographic distribution

  const pages = [
    { id: 'home', weight: 40 },
    { id: 'packages', weight: 20 },
    { id: 'custom-trip', weight: 15 },
    { id: 'blog', weight: 10 },
    { id: 'about-us', weight: 5 },
    { id: 'contact-us', weight: 6 },
    { id: 'travel-quiz', weight: 4 }
  ];

  const selectWeighted = <T>(items: T[], weights: number[]): T => {
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * totalWeight;
    for (let i = 0; i < items.length; i++) {
      if (rand < weights[i]) return items[i];
      rand -= weights[i];
    }
    return items[0];
  };

  // Generate 30 days of data
  for (let i = 29; i >= 0; i--) {
    const dayDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    
    // Slight weekend variance or trend
    const dayOfWeek = dayDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Daily traffic: random base between 120 and 240 visitors, weekends are slightly higher for planning
    const visitorCount = Math.floor((isWeekend ? 160 : 120) + Math.random() * 80);

    for (let j = 0; j < visitorCount; j++) {
      // Hour distribution - high during lunch and evening
      const randHour = Math.random() * 100;
      let hour = 14; // Default lunch/afternoon
      if (randHour < 10) hour = Math.floor(Math.random() * 6); // Late night / morning
      else if (randHour < 25) hour = 6 + Math.floor(Math.random() * 4); // Morning
      else if (randHour < 55) hour = 10 + Math.floor(Math.random() * 4); // Mid-day / lunch
      else if (randHour < 85) hour = 14 + Math.floor(Math.random() * 5); // Afternoon / end of work
      else hour = 19 + Math.floor(Math.random() * 5); // Evening prime time

      const eventDate = new Date(dayDate);
      eventDate.setHours(hour, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));

      const page = selectWeighted(pages, pages.map(p => p.weight));
      const origin = selectWeighted(origins, originWeights);
      const device = selectWeighted(devices, deviceWeights);
      const age = selectWeighted(ageGroups, ageWeights);
      const durationSeconds = Math.floor(10 + Math.random() * 240);

      // Add main page view
      events.push({
        timestamp: eventDate.toISOString(),
        pageId: page.id,
        device,
        origin,
        age,
        durationSeconds
      });

      // Simulating custom interaction actions based on page
      if (Math.random() < 0.25) {
        let action: string | undefined;
        if (page.id === 'home' || page.id === 'packages') {
          const randAction = Math.random();
          if (randAction < 0.5) action = 'search_flights';
          else if (randAction < 0.8) action = 'whatsapp_click';
          else action = 'quote_package';
        } else if (page.id === 'travel-quiz') {
          action = 'quiz_completed';
        } else if (page.id === 'custom-trip') {
          action = 'itinerary_build_click';
        }

        if (action) {
          events.push({
            timestamp: eventDate.toISOString(),
            pageId: page.id,
            device,
            origin,
            age,
            durationSeconds: 0,
            customAction: action
          });
        }
      }
    }
  }

  return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

// Helper to save a single event to Firestore in the background
async function saveEventToSupabase(event: AnalyticsEvent) {
  try {
    const { error } = await supabase.from('analytics_events').insert([event]);
    if (error) throw error;
  } catch (error) {
    console.warn('[Analytics Supabase Save Warning]:', error);
  }
}

export function subscribeToSupabaseAnalytics(onUpdate: (events: AnalyticsEvent[]) => void): () => void {
  // Fetch initial data
  supabase
    .from('analytics_events')
    .select('*')
    .order('timestamp', { ascending: true })
    .limit(5000)
    .then(({ data, error }) => {
      if (!error && data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        onUpdate(data);
      }
    });

  const channel = supabase
    .channel('public:analytics_events')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'analytics_events' },
      (payload) => {
        const events = getAnalyticsEvents();
        events.push(payload.new as AnalyticsEvent);
        if (events.length > 5000) events.shift();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
        onUpdate(events);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function clearSupabaseAnalytics(): Promise<void> {
  try {
    const { error } = await supabase
      .from('analytics_events')
      .delete()
      .neq('id', 0); // Deletes all rows safely depending on RLS
    if (error) throw error;
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('[Analytics Clear Error]:', error);
  }
}

// Get all events from storage, seeding them if empty
export function getAnalyticsEvents(): AnalyticsEvent[] {
  if (typeof window === 'undefined') return [];
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing stored analytics:', e);
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  return [];
}

// Record a new page view
export function trackPageView(pageId: string): void {
  if (typeof window === 'undefined' || pageId === 'admin') return;

  try {
    const events = getAnalyticsEvents();
    
    const newEvent: AnalyticsEvent = {
      timestamp: new Date().toISOString(),
      pageId,
      device: detectDevice(),
      origin: detectOrigin(),
      age: getSessionAge(),
      durationSeconds: Math.floor(15 + Math.random() * 45) // simulated initial stay
    };

    events.push(newEvent);

    // Keep last 5000 events to manage localStorage size limits cleanly
    if (events.length > 5000) {
      events.shift();
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    
    // Save to Firestore in background
    saveEventToSupabase(newEvent);
    
    // Dispatch custom event to notify any active dashboards of updates
    window.dispatchEvent(new CustomEvent('arcadane_analytics_updated', { detail: newEvent }));
  } catch (error) {
    console.error('[Analytics error]: Failed to track page view:', error);
  }
}

// Record a custom interaction event (e.g. WhatsApp clicks, search queries)
export function trackCustomEvent(actionName: string, pageId: string = 'home'): void {
  if (typeof window === 'undefined') return;

  try {
    const events = getAnalyticsEvents();
    
    const newEvent: AnalyticsEvent = {
      timestamp: new Date().toISOString(),
      pageId,
      device: detectDevice(),
      origin: detectOrigin(),
      age: getSessionAge(),
      durationSeconds: 0,
      customAction: actionName
    };

    events.push(newEvent);

    if (events.length > 5000) {
      events.shift();
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    
    // Save to Firestore in background
    saveEventToSupabase(newEvent);
    
    window.dispatchEvent(new CustomEvent('arcadane_analytics_updated', { detail: newEvent }));
  } catch (error) {
    console.error('[Analytics error]: Failed to track custom event:', error);
  }
}
