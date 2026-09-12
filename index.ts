import { registerRootComponent } from 'expo';
import { createElement } from 'react';
import { Platform } from 'react-native';

import App from './App';
import { PublicLandingPage } from './components/landing/public-landing-page';

function RootSurface() {
  // Public enrollment stays on web; native builds launch the learner product.
  return createElement(Platform.OS === 'web' ? PublicLandingPage : App);
}

registerRootComponent(RootSurface);
