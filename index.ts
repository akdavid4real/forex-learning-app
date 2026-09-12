import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

import App from './App';
import { LandingPage } from './components/landing/landing-page';

function RootSurface() {
  // Keep the existing public enrollment/marketing site on web while native
  // builds open directly into the authenticated learner product.
  return Platform.OS === 'web' ? <LandingPage /> : <App />;
}

registerRootComponent(RootSurface);
