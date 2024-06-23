import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PUBLIC_PATH } from 'src/app/shared/constants/base.constant';
import { LOCAL_STORAGE, SESSION_STORAGE } from 'src/app/shared/constants/local-session-cookies.constants';
import CommonUtil from 'src/app/shared/utils/common-utils';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from 'src/app/shared/services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  urlsToNotUse = ['/authentication/login', './assets/i18n/vi.json', './assets/i18n/en.json'];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService,
    private authService: AuthService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
    });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    
    if (
      !request ||
      (request.url && this.urlsToNotUse.includes(request.url)) || request?.url.includes(PUBLIC_PATH)
    ) {
      return next.handle(request);
    }
    const token =
      this.localStorage.retrieve(LOCAL_STORAGE.JWT_TOKEN) || this.sessionStorage.retrieve(SESSION_STORAGE.JWT_TOKEN);
    // const lang = this.localStorage.retrieve(LOCAL_STORAGE.LANGUAGE) || LANGUAGE_VI;
    if (!!token) {
      const decodeAccessToken = token;
      
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${decodeAccessToken}`,
          // language: lang,
          // 'Accept-Language': lang
        },
      });
    }
    // else {
    //   this.router.navigate(['/authentication/login']);
    // }

    // if (environment.login_type == 'sso') {
    //   request = request.clone({
    //     setHeaders: {
    //       Authorization: `Bearer ${ CommonUtil.getCookie('token')}`,
    //       language: lang,
    //       'Accept-Language': lang
    //     },
    //   });
    // }
    return next.handle(request);
  }
}
