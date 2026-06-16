// Vercel Speed Insights initialization
import { injectSpeedInsights } from './node_modules/@vercel/speed-insights/dist/index.mjs';

// Initialize Speed Insights with default options
injectSpeedInsights({
  debug: false,  // Set to true to see debug logs in development
  // sampleRate: 1, // Send 100% of events (default)
  // beforeSend: (event) => event, // Optional middleware to modify events
});
