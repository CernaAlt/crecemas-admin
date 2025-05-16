import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpErrorResponse,
} from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenRefreshModalComponent } from '../components/token-refresh-modal/token-refresh-modal.component';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    // Referencia al componente modal
    modalRef: ComponentRef<TokenRefreshModalComponent> | null = null;

    constructor(
        private router: Router, // Inyectamos Router
        private authService: AuthService, // Inyectamos AuthService
        private appRef: ApplicationRef, // Inyectamos ApplicationRef
        private injector: Injector, // Inyectamos Injector
        private resolver: ComponentFactoryResolver
    ) { }


    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('supabase.auth.token');

        // Clonamos la solicitud para añadir el token si existe
        const clonedRequest = token
            ? req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            })
            : req;

        // Manejo de errores en la respuesta
        return next.handle(clonedRequest).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 || error.status === 403) {
                    console.warn('Token expirado. Intentando refrescar...');

                    // Mostrar el Modal de alerta
                    this.showModal();

                    // Convertimos la promesa en un observable para mantener la cadena
                    return from(this.authService.refreshSession()).pipe(
                        switchMap((response) => {

                            // Ocultamos el modal al terminar
                            this.hideModal();


                            if (response?.error) {
                                console.error('Error al refrescar token:', response.error);
                                this.router.navigate(['/login']);
                                return throwError(() => new Error('No autorizado'));
                            } else {
                                const newToken = localStorage.getItem('supabase.auth.token');
                                const retryRequest = req.clone({
                                    setHeaders: {
                                        Authorization: `Bearer ${newToken}`,
                                    },
                                });
                                return next.handle(retryRequest);
                            }
                        }),
                        catchError(err => {
                            this.router.navigate(['/login']);
                            return throwError(() => err);
                        })
                    );
                }

                // Para otros errores que no sean 401/403
                return throwError(() => error);
            })
        );
    }


    showModal() {
        if (!this.modalRef) {
            const factory = this.resolver.resolveComponentFactory(TokenRefreshModalComponent);
            this.modalRef = factory.create(this.injector);
            this.appRef.attachView(this.modalRef.hostView);
            const domElem = (this.modalRef.hostView as any).rootNodes[0] as HTMLElement;
            document.body.appendChild(domElem);
            this.modalRef.instance.show();
        }
    }

    hideModal() {
        if (this.modalRef) {
            this.modalRef.instance.hide();
            document.body.removeChild((this.modalRef.hostView as any).rootNodes[0]);
            this.appRef.detachView(this.modalRef.hostView);
            this.modalRef.destroy();
            this.modalRef = null;
        }
    }
}
