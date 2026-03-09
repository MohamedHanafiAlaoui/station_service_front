import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';

import { clientReducer } from './features/client/store/client.reducer';
import { ClientEffects } from './features/client/store/client.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    //  Store مع Feature client
    provideStore({
      client: clientReducer
    }),

    //  Effects مع Feature client
    provideEffects([
      ClientEffects
    ]),

    //  DevTools
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),

    //  HttpClient + Interceptor
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
