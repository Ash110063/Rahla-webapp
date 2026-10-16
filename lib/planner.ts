// Rahla Journeys — itinerary planning logic (pure functions, no DOM).
import { byId, hotelById, places, type LatLng, type Place, type Prefs } from './data';

export interface Stop {
  uid: string;
  id: string;
  start: number; // minutes from midnight
  duration: number;
  locked: boolean;
  reference: string;
  notes: string;
  done: boolean;
  meal: string;
}

export interface Trip {
  id: string;
  prefs: Prefs;
  hotel: string | null;
  days: Stop[][];
  created: string;
  hotelReference: string;
  sample?: boolean;
}

export const date = (v: string, n = 0) => new Date(new Date(v + 'T12:00:00').getTime() + n * 86400000);
export const daysBetween = (p: Pick<Prefs, 'start' | 'end'>) =>
  Math.round((date(p.end).getTime() - date(p.start).getTime()) / 86400000) + 1;
export const minutes = (t: string) => Number(t.split(':')[0]) * 60 + Number(t.split(':')[1]);
export const clock = (n: number) =>
  String(Math.floor(n / 60)).padStart(2, '0') + ':' + String(n % 60).padStart(2, '0');
export const formatDate = (v: string) => date(v).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

/** Great-circle distance in km. */
export function distance(a: LatLng, b: LatLng) {
  const r = Math.PI / 180;
  const dlat = (a.lat - b.lat) * r;
  const dlng = (a.lng - b.lng) * r;
  const h = Math.sin(dlat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dlng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/** Estimated driving minutes between two points, rounded up to 5 (min 20). */
export const travel = (a: LatLng, b: LatLng) =>
  Math.max(20, Math.ceil(((distance(a, b) * 1.4) / 35 * 60 + 10) / 5) * 5);

/** Plannable window for a given day, leaving airport buffers on flight days. */
export function bounds(p: Prefs, d: number) {
  return {
    start: d === 0 ? Math.max(570, minutes(p.arrival) + 120) : 570,
    end: d === daysBetween(p) - 1 ? Math.min(1290, minutes(p.departure) - 180) : 1290,
  };
}

export function validatePrefs(p: Prefs): string {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(p.start) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(p.end) ||
    !Number.isFinite(date(p.start).getTime()) ||
    !Number.isFinite(date(p.end).getTime())
  )
    return 'Choose valid travel dates.';
  const n = daysBetween(p);
  if (n < 1 || n > 14) return 'Choose a trip between 1 and 14 days.';
  if (!/^\d{2}:\d{2}$/.test(p.arrival) || !/^\d{2}:\d{2}$/.test(p.departure)) return 'Enter both flight times.';
  if (n === 1 && minutes(p.departure) - minutes(p.arrival) < 300)
    return 'Allow at least five hours between flights for a same-day visit.';
  if (p.adults < 1 || p.adults > 8) return 'Choose between 1 and 8 adults.';
  if (!p.interests.length || !p.cuisines.length) return 'Choose at least one interest and one cuisine.';
  return '';
}

export function baseFor(p: Prefs, hotel: string | null): LatLng {
  if (!p.booked) return hotelById(hotel) || { lat: 25.29, lng: 51.53 };
  const areas: Record<string, LatLng> = {
    'West Bay': { lat: 25.326, lng: 51.531 },
    'The Pearl': { lat: 25.369, lng: 51.55 },
    Lusail: { lat: 25.406, lng: 51.527 },
  };
  return areas[p.hotelArea] || { lat: 25.285, lng: 51.53 };
}

/** Build a full trip: one ordered list of stops per day. */
export function generate(p: Prefs, hotel: string | null): Trip {
  const used = new Set<string>();
  const days: Stop[][] = [];
  for (let d = 0; d < daysBetween(p); d++) {
    const b = bounds(p, d);
    const stops: Stop[] = [];
    let cursor = b.start;
    let prev: LatLng = baseFor(p, hotel);
    let spend = 0;
    const meals = places.filter(
      (x) => x.type === 'Restaurant' && p.cuisines.includes(x.cuisine!) && (p.dining === 'Mixed' || x.dining === p.dining),
    );
    const pool = places.filter(
      (x) =>
        x.type === 'Attraction' &&
        (!x.operator ||
          (p.interests.includes('Adventure') && p.children === 0 && p.mobility === 'Standard' && d > 0 && d < daysBetween(p) - 1)),
    );
    const score = (x: Place) =>
      x.tags.filter((t) => p.interests.includes(t)).length * 70 -
      (used.has(x.id) ? 140 : 0) -
      distance(prev, x) * 2 -
      (x.outdoor && cursor < 960 ? 10 : 0) -
      (p.mobility === 'Minimal walking' && x.outdoor ? 30 : 0);
    const targets: [string, number][] =
      p.pace === 'Relaxed'
        ? [['activity', 600], ['lunch', 780], ['activity', 1020], ['dinner', 1140]]
        : p.pace === 'Full days'
          ? [['activity', 570], ['lunch', 765], ['activity', 885], ['activity', 1035], ['dinner', 1170]]
          : [['activity', 600], ['lunch', 780], ['activity', 960], ['dinner', 1140]];

    for (const [kind, target] of targets) {
      let candidates = kind === 'activity' ? pool : meals.filter((x) => !x.meal || x.meal === kind);
      candidates = [...candidates].filter((x) => !stops.some((s) => s.id === x.id)).sort((a, c) => score(c) - score(a));
      for (const x of candidates) {
        const duration = p.mobility === 'Minimal walking' && x.outdoor && !x.operator ? Math.min(45, x.duration) : x.duration;
        const buffer = travel(prev, x) + (p.pace === 'Relaxed' ? 15 : 0);
        const start = Math.max(target, cursor + buffer);
        if (start + duration > b.end || spend + x.price > p.dailyBudget) continue;
        stops.push({
          uid: crypto.randomUUID(),
          id: x.id,
          start,
          duration,
          locked: false,
          reference: '',
          notes: '',
          done: false,
          meal: kind === 'activity' ? '' : kind,
        });
        cursor = start + duration;
        spend += x.price;
        prev = x;
        used.add(x.id);
        break;
      }
    }
    days.push(stops);
  }
  return { id: crypto.randomUUID(), prefs: structuredClone(p), hotel: hotel || null, days, created: new Date().toISOString(), hotelReference: '' };
}

/** Returns an error message if a day's stops overlap or break airport buffers. */
export function checkDay(stops: Stop[], p: Prefs, d: number): string {
  const b = bounds(p, d);
  for (let i = 0; i < stops.length; i++) {
    const s = stops[i];
    if (s.start < b.start || s.start + s.duration > b.end)
      return 'This stop would overlap your airport buffer or run beyond the day.';
    if (i) {
      const prev = stops[i - 1];
      if (s.start < prev.start + prev.duration + travel(byId(prev.id), byId(s.id)))
        return 'There is not enough travel time between these stops.';
    }
  }
  return '';
}

/** Push unlocked stops later (optionally by a delay) so travel buffers fit; locked stops never move. */
export function reschedule(stops: Stop[], p: Prefs, d: number, delay = 0): { error: string } | { stops: Stop[] } {
  const b = bounds(p, d);
  let cursor = b.start;
  let previous: Stop | null = null;
  const next = structuredClone(stops);
  for (let i = 0; i < next.length; i++) {
    const s = next[i];
    const earliest = cursor + (previous ? travel(byId(previous.id), byId(s.id)) : 0);
    if (s.locked) {
      if (s.start < earliest)
        return { error: 'This change would conflict with a locked reservation. Choose another time or unlock it first.' };
    } else {
      s.start = Math.max(s.start + delay, earliest);
    }
    cursor = s.start + s.duration;
    previous = s;
  }
  const error = checkDay(next, p, d);
  return error ? { error } : { stops: next };
}

export function dayCost(stops: Stop[], p: Prefs) {
  return stops.reduce((s, x) => s + byId(x.id).price, 0) * p.adults;
}
