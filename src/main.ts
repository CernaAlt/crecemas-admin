import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component'
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []), // Mantiene los providers anteriores
    provideAnimations(),             // ✅ Habilita las animaciones
    provideRouter(routes)
  ]
}).catch((err) => console.error(err));

/*platformBrowserDynamic().bootstrapModule(AppComponent)
  .catch(err => console.error(err));*/



