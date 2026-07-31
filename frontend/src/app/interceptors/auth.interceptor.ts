import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('token');

    if (!token) {
      return next.handle(req);
    }

    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next.handle(clonedRequest).pipe(
      catchError((error) => {
        if (error.status === 401) {
          // Session expired or unauthorized
          this.authService.logout();
          this.toastService.showWarning('انتهت الجلسة، الرجاء تسجيل الدخول مجدداً');
          this.router.navigate(['/login']);
        } else if (error.status >= 400 && error.status < 500) {
          // Client errors (e.g. Validation, Bad Request)
          const message = error.error?.message || 'حدث خطأ في الطلب';
          this.toastService.showError(message);
        } else if (error.status >= 500) {
          // Server errors
          this.toastService.showError('حدث خطأ في الخادم، يرجى المحاولة لاحقاً');
        } else if (error.status === 0) {
          // Network errors / API down
          this.toastService.showError('لا يوجد اتصال بالخادم، تحقق من الإنترنت');
        }

        return throwError(() => error);
      })
    );
  }
}