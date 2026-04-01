import { registerRootComponent } from 'expo';
import App from './App';

// This tells Expo to boot from your local App.tsx instead of the hoisted node_modules
registerRootComponent(App);