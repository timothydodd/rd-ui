import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideLucideIcons, LucideX, LucideCheck, LucideChevronDown, LucideSearch } from '@lucide/angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideLucideIcons(
      LucideX,
      LucideCheck,
      LucideChevronDown,
      LucideSearch,
    ),
  ],
};
