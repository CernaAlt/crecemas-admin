import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter} from '@angular/router';

import { routes } from './app.routes';
import { AuthGuard } from './guards/auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


export const appConfig: ApplicationConfig = {

  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    //provideAnimations(),
    provideAnimationsAsync(),

    providePrimeNG({}),

    [AuthGuard,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
      },
      ConfirmationService,
      MessageService
    ],

  ]
};


