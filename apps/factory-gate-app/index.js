import { registerRootComponent } from 'expo';
import App from './App';

// This explicitly registers the app and bypasses the PNPM hoisting issue
registerRootComponent(App);