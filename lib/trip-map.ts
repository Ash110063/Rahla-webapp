// Rahla Journeys — lightweight OpenStreetMap tile map (no map library needed).
import type { LatLng } from './data';

export interface MapPoint extends LatLng {
  name: string;
}

export interface TripMap {
  select(i: number): void;
  fit(): void;
  destroy(): void;
}

/** Web Mercator projection to pixel space at zoom z. */
export function project(lat: number, lng: number, z: number) {
  const scale = 256 * 2 ** z;
  const s = Math.sin((lat * Math.PI) / 180);
  return { x: ((lng + 180) / 360) * scale, y: (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * scale };
}

export function unproject(x: number, y: number, z: number): LatLng {
  const scale = 256 * 2 ** z;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  return { lat: (180 / Math.PI) * Math.atan(Math.sinh(n)), lng: (x / scale) * 360 - 180 };
}

export function mountTripMap(
  host: HTMLElement,
  {
    points = [],
    onSelect = () => {},
    color = '#d86a4b',
  }: { points?: MapPoint[]; onSelect?: (p: MapPoint, i: number) => void; color?: string } = {},
): TripMap {
  let zoom = 12;
  let center: LatLng = { lat: 25.315, lng: 51.535 };
  let selected = -1;
  let drag: { x: number; y: number; c: { x: number; y: number } } | null = null;
  let loaded = 0;
  let destroyed = false;

  host.innerHTML =
    '<div class="geo-viewport" tabindex="0" role="region" aria-label="Trip map. Use plus and minus to zoom, arrow keys to pan."><div class="geo-scene"><div class="geo-tiles"></div><svg class="geo-line" aria-hidden="true"></svg><div class="geo-markers"></div></div></div>' +
    '<div class="geo-controls"><button type="button" data-zoom="1" aria-label="Zoom in">+</button><button type="button" data-zoom="-1" aria-label="Zoom out">−</button><button type="button" data-fit aria-label="Fit all stops">⌖</button></div>' +
    '<div class="geo-status" hidden>Base map unavailable. Place positions are still shown.</div>' +
    '<div class="geo-attribution">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors</div>';

  const view = host.querySelector<HTMLElement>('.geo-viewport')!;
  const scene = host.querySelector<HTMLElement>('.geo-scene')!;
  const tiles = host.querySelector<HTMLElement>('.geo-tiles')!;
  const markers = host.querySelector<HTMLElement>('.geo-markers')!;
  const line = host.querySelector<SVGSVGElement>('.geo-line')!;
  const status = host.querySelector<HTMLElement>('.geo-status')!;

  function fit() {
    if (points.length) {
      const minLat = Math.min(...points.map((p) => p.lat));
      const maxLat = Math.max(...points.map((p) => p.lat));
      const minLng = Math.min(...points.map((p) => p.lng));
      const maxLng = Math.max(...points.map((p) => p.lng));
      center = { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 };
      for (zoom = 14; zoom > 8; zoom--) {
        const a = project(minLat, minLng, zoom);
        const b = project(maxLat, maxLng, zoom);
        if (Math.abs(a.x - b.x) < view.clientWidth - 120 && Math.abs(a.y - b.y) < view.clientHeight - 200) break;
      }
    }
    draw();
  }

  function draw() {
    if (destroyed) return;
    const w = view.clientWidth || 500;
    const h = view.clientHeight || 600;
    const c = project(center.lat, center.lng, zoom);
    const left = c.x - w / 2;
    const top = c.y - h / 2;
    tiles.replaceChildren();
    markers.replaceChildren();
    scene.style.transform = '';
    loaded = 0;
    status.hidden = true;
    const n = 2 ** zoom;
    for (let x = Math.floor(left / 256); x <= Math.floor((left + w) / 256); x++)
      for (let y = Math.floor(top / 256); y <= Math.floor((top + h) / 256); y++) {
        if (y < 0 || y >= n) continue;
        const image = document.createElement('img');
        image.src = `https://tile.openstreetmap.org/${zoom}/${((x % n) + n) % n}/${y}.png`;
        image.alt = '';
        image.draggable = false;
        image.width = 256;
        image.height = 256;
        image.style.cssText = `position:absolute;left:${x * 256 - left}px;top:${y * 256 - top}px;width:256px;height:256px;max-width:none;`;
        image.onload = () => {
          loaded++;
          status.hidden = true;
        };
        image.onerror = () => {
          image.style.visibility = 'hidden';
          if (!loaded) status.hidden = false;
        };
        tiles.append(image);
      }
    const projected = points.map((p) => {
      const v = project(p.lat, p.lng, zoom);
      return { x: v.x - left, y: v.y - top };
    });
    line.setAttribute('viewBox', `0 0 ${w} ${h}`);
    line.innerHTML =
      projected.length > 1
        ? `<polyline points="${projected.map((p) => p.x + ',' + p.y).join(' ')}" fill="none" stroke="${color}" stroke-width="3" stroke-dasharray="6 7" opacity=".7"/>`
        : '';
    points.forEach((p, i) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'geo-marker' + (selected === i ? ' selected' : '');
      el.style.cssText = `left:${projected[i].x}px;top:${projected[i].y}px;--pin-color:${color}`;
      el.innerHTML = '<b>' + (i + 1) + '</b>';
      el.title = p.name;
      el.setAttribute('aria-label', 'Stop ' + (i + 1) + ': ' + p.name);
      el.onclick = () => {
        selected = i;
        highlight();
        onSelect(p, i);
      };
      markers.append(el);
    });
  }

  function highlight() {
    markers.querySelectorAll('.geo-marker').forEach((m, i) => m.classList.toggle('selected', selected === i));
  }

  function select(i: number) {
    selected = i;
    if (points[i]) center = { lat: points[i].lat, lng: points[i].lng };
    draw();
  }

  host.querySelectorAll<HTMLButtonElement>('[data-zoom]').forEach((b) => {
    b.onclick = () => {
      zoom = Math.max(8, Math.min(17, zoom + Number(b.dataset.zoom)));
      draw();
    };
  });
  host.querySelector<HTMLButtonElement>('[data-fit]')!.onclick = fit;

  view.onpointerdown = (e) => {
    if ((e.target as HTMLElement).closest('button,a')) return;
    drag = { x: e.clientX, y: e.clientY, c: project(center.lat, center.lng, zoom) };
    view.setPointerCapture(e.pointerId);
    view.classList.add('panning');
  };
  view.onpointermove = (e) => {
    if (drag) scene.style.transform = `translate(${e.clientX - drag.x}px,${e.clientY - drag.y}px)`;
  };
  view.onpointerup = (e) => {
    if (!drag) return;
    center = unproject(drag.c.x - e.clientX + drag.x, drag.c.y - e.clientY + drag.y, zoom);
    drag = null;
    view.classList.remove('panning');
    draw();
  };
  view.onpointercancel = () => {
    drag = null;
    view.classList.remove('panning');
    scene.style.transform = '';
  };
  view.onkeydown = (e) => {
    const delta = ({ ArrowLeft: [-80, 0], ArrowRight: [80, 0], ArrowUp: [0, -80], ArrowDown: [0, 80] } as Record<string, number[]>)[e.key];
    if (delta) {
      e.preventDefault();
      const p = project(center.lat, center.lng, zoom);
      center = unproject(p.x + delta[0], p.y + delta[1], zoom);
      draw();
    } else if (['+', '=', '-'].includes(e.key)) {
      e.preventDefault();
      zoom = Math.max(8, Math.min(17, zoom + (e.key === '-' ? -1 : 1)));
      draw();
    }
  };

  const observer = new ResizeObserver(() => fit());
  observer.observe(view);
  fit();

  return {
    select,
    fit,
    destroy() {
      destroyed = true;
      observer.disconnect();
    },
  };
}
