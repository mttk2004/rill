import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { Ziggy } from './ziggy';
import { PlayerProvider } from './context/PlayerContext';
import { ToastProvider } from './context/ToastContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
  title: (title) => title ? `${title} - ${appName}` : appName,
  resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
  setup({ el, App, props }) {
    // Set Ziggy config globally for route helper
    window.Ziggy = Ziggy;

    const root = createRoot(el);

    root.render(
      <ToastProvider>
        <PlayerProvider>
          <App {...props} />
        </PlayerProvider>
      </ToastProvider>
    );
  },
  progress: {
    color: '#4B5563',
  },
});

// This will set light / dark mode on load...
initializeTheme();
