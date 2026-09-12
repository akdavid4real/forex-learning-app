import { registerRootComponent } from 'expo';

import App from './App';

// The learner application is the native/Expo entry point.
// The public landing page is kept as a web surface/component rather than replacing
// the authenticated learning experience at application startup.
registerRootComponent(App);
