import { registerRootComponent } from 'expo';

import { LandingPage } from "./components/landing/landing-page";

// registerRootComponent registers the public website as the app entry point.
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(LandingPage);
