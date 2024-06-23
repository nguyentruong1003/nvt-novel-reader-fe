import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { TranslateService } from '@ngx-translate/core';
import { LOCAL_STORAGE } from 'src/app/shared/constants/local-session-cookies.constants';
import { STATUS } from 'src/app/shared/constants/status.constants';
// import { EventManagerService } from 'src/app/shared/service/helpers/event-manager.service';
// import { ToastService } from 'src/app/shared/service/helpers/toast.service';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import CommonUtil from 'src/app/shared/utils/common-utils';
import {environment} from 'src/environments//environment';
import { AUTH_PATH } from 'src/app/shared/constants/base.constant';
import { AuthService } from 'src/app/shared/services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthService,
    // private eventManagerService: EventManagerService,
    // private translateService: TranslateService,
    // private toastService: ToastService,
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService,
  ) {}
  private isTokenRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  private static addTokenToHeader(
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === STATUS.ERROR_401) {
          // 401 do đăng nhập fail
          if (window.location.href.includes('authentication/login')) {
            // this.authService.clear();
            // this.toastService.error(
            //   this.translateService.instant('error.login')
            // );
          } else {
            // 401 do token hết hạn
            this.clearTokenRefLogout();
            // const refreshToken = this.localStorage.retrieve(LOCAL_STORAGE.REFRESH_TOKEN);
            // const userName = this.authService.getCurrentUser()?.username || '';
            // // kiểm tra có refresh token hay không
            // if (!!refreshToken && !!CommonUtil.decryptMessage(refreshToken, this.authService.getTokenPrivateKey())) {
            //   const decodeRefreshToken = CommonUtil.decryptMessage(refreshToken, this.authService.getTokenPrivateKey());
            //   return this.handle401Error(request, next, decodeRefreshToken, userName);
            // } else {
            //   // clear token back về trang đăng nhập
            //   this.clearTokenRefLogout();
            // }
          }
        } else if (err.status === STATUS.ERROR_403) {
          // this.toastService.error(this.getError(err));
          this.handle403Error(request, next);
        } else if (err.status === STATUS.ERROR_404) {
          if (err?.error?.error === 'USER_NOT_FOUND') {
            // this.toastService.error('error.login');
          } else {
            // this.toastService.error(this.getError(err));
          }
        } else if (this.getError(err)) {
          // this.toastService.error(this.getError(err));
        }
        return throwError(this.getError(err));
      })
    );
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler,
    refreshToken: string,
    userName: string
  ): Observable<any> {
    if (!this.isTokenRefreshing) {
      this.isTokenRefreshing = true;
      this.refreshTokenSubject.next(null);
      this.localStorage.clear(LOCAL_STORAGE.JWT_TOKEN);
      return this.authService.refreshToken(refreshToken).pipe(
        switchMap((res: any) => {
          const accessToken = res?.data?.accessToken;
          this.isTokenRefreshing = false;
          this.refreshTokenSubject.next(accessToken);
          // this.reloadCurrentUrl(accessToken);
          return next.handle(
            ErrorInterceptor.addTokenToHeader(request, accessToken)
          );
        }),
        catchError((err, osb) => {
          this.clearTokenRefLogout();
          return throwError(err?.error?.message);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          // this.reloadCurrentUrl(jwt);
          return next.handle(ErrorInterceptor.addTokenToHeader(request, jwt));
        })
      );
    }
  }

  private handle403Error(request: HttpRequest<any>, next: HttpHandler): void {
    // this.router.navigate(["/"]);
  }

  // @TODO: implement case export file
  // private getErrorFile(err: any): any {
  //   const blob = new Blob([err.error]);
  //   return blob.text().then(data => {
  //     console.log(JSON.parse(data));
  //   });
  // }

  private getError(err: any): any {
    if (err?.error?.errors?.length > 0) {
      return err?.error?.errors[0]?.message || err?.message;
    }
    // return (
    //   err?.error?.message ||
    //   err?.message ||
    //   this.translateService.instant('error.msg')
    // );
  }

  private clearTokenRefLogout(): void {
    // this.authService.clear();
    // this.toastService.info('model.logout.success.session');
    this.router.navigate([AUTH_PATH]);
  }

  private reloadCurrentUrl(token: string): void {
    const url = this.router.routerState.snapshot.url;
    // this.eventManagerService.broadcast({
    //   name: 'reload',
    //   content: {
    //     url,
    //     token,
    //   },
    // });
  }
}
