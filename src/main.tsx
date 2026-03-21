import { createRoot } from 'react-dom/client';

// Import polyfills first
import './lib/polyfills.ts';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import App from './App.tsx';
import './index.css';

import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/inter';
import '@fontsource-variable/source-serif-4';

// Global unhandled promise rejection handler to prevent app crashes
// These often come from Nostr relay connections that fail silently
window.addEventListener('unhandledrejection', (event) => {
  // Ignore certain expected errors
  const reason = event.reason;
  if (reason instanceof Error) {
    // Ignore AbortError from cancelled fetch requests
    if (reason.name === 'AbortError') {
      event.preventDefault();
      return;
    }
    // Log other errors for debugging but don't crash the app
    console.warn('Unhandled Promise Rejection:', reason.message);
  }
  // Prevent the default browser behavior (logging to console)
  event.preventDefault();
});

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
