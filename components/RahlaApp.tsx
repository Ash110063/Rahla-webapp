'use client';

import { useEffect } from 'react';
import { startRahla } from '@/lib/engine';

/**
 * Client shell for Rahla Journeys. Provides the stable DOM nodes the UI engine
 * renders into (app, modal, toast) and starts/stops the engine with the component.
 */
export default function RahlaApp() {
  useEffect(() => startRahla(), []);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div id="app" />
      <dialog id="modal">
        <button className="icon-button modal-close" aria-label="Close dialog" data-action="close">
          ×
        </button>
        <div id="modal-content" />
      </dialog>
      <div id="toast" role="status" aria-live="polite" />
    </>
  );
}
