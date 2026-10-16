# Rahla Journeys — Next.js

Qatar trip planner (plan → preferences → stay → itinerary, with map, explore, dining,
reservations, budget and saved trips), ported from the single-file `Rahla.html` prototype
to a Next.js 15 App Router project.

## Run it

```bash
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

Deploys to Vercel as-is (static page, no env vars needed).

## Structure

```
app/
  layout.tsx       metadata, viewport, DM Sans (self-hosted via @fontsource)
  page.tsx         renders <RahlaApp />
  globals.css      all styles from the prototype
  icon.svg         favicon
components/
  RahlaApp.tsx     client shell: #app, #modal dialog, #toast; starts/stops the engine
lib/
  data.ts          typed catalogue: hotels, places, photos, default preferences
  planner.ts       typed itinerary logic: generate, reschedule, checkDay, travel times, budgets
  trip-map.ts      OpenStreetMap tile map with pins, route line, pan/zoom
  engine.js        UI engine: views, dialogs, routing (#plan #trip #explore #saved),
                   drag-and-drop, localStorage persistence, export
public/images/
  doha.jpg         hero / fallback photo (was a 1.25 MB inline PNG; now 110 KB JPG)
```

Behaviour is unchanged from the prototype. `engine.js` still renders HTML strings into `#app`;
the natural next step is converting its views (overview, itinerary, explore, stays, dining,
budget, plan steps) into React components that consume `lib/data.ts` and `lib/planner.ts`.

Trips and saved places persist in the browser under `rahla-v2-trips` / `rahla-v2-places`.
