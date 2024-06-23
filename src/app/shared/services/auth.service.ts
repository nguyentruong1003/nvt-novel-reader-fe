import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { BASE_API } from '../constants/base.constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import CommonUtil from '../utils/common-utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LOCAL_STORAGE, SESSION_STORAGE } from 'src/app/shared/constants/local-session-cookies.constants';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';


const defaultPath = '/';
const defaultUser = {
  email: 'sandra@example.com',
  avatarUrl: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/06.png'
};

@Injectable()
export class AuthService {
  public currentUser: any;
  get loggedIn(): boolean {
    // console.log(!!this.$localStorage.retrieve(LOCAL_STORAGE.REFRESH_TOKEN));
    
    return !!this.$localStorage.retrieve(LOCAL_STORAGE.REFRESH_TOKEN);
  }

  get isAdminLogin(): boolean {
    this.currentUser = this.getCurrentUser();
    const roles = this.currentUser?.roles?.data.map((r: any) => { return r.name});
    if (roles?.includes('admin') || roles?.includes('moderator')) {
      return true;
    }

    const permissions = this.currentUser?.permissions?.data.map((r: any) => { return r.name});
    if (permissions?.includes('access-dashboard')) {
      return true;
    }
    
    return false;
  }

  private _lastAuthenticatedPath: string = defaultPath;
  set lastAuthenticatedPath(value: string) {
    this._lastAuthenticatedPath = value;
  }

  constructor(
    private router: Router,
    private http: HttpClient,
    private $localStorage: LocalStorageService,
    private $sessionStorage: SessionStorageService,
  ) { }

  logIn(email: string, password: string, rememberMe = false): Observable<any> {
    return this.http
      .post<any>(`${BASE_API}clients/web/login`, {
        email,
        password
      }, {
        headers: CommonUtil.headers(true)
      })
      .pipe(map(this.authenticateSuccess.bind(this, rememberMe)));
  }

  authenticateSuccess(rememberMe: boolean, response: any) {
    response = response?.data;
    const accessToken = response?.access_token;
    const refreshToken = response?.refresh_token;

    if (!accessToken) {
      // this.toast.error(this.translateService.instant('model.login.error.unauthorized'));
      this.router.navigate(['/authentication/login-form']);
    } else {
      if (!!refreshToken) {
        // const endCodeRefreshToken = CommonUtil.encryptMessage(refreshToken, this.getTokenPrivateKey());
        const endCodeRefreshToken = refreshToken;
        this.$localStorage.store(LOCAL_STORAGE.REFRESH_TOKEN, endCodeRefreshToken);
      }
      if (accessToken) {
        this.storeAuthenticationToken(accessToken, rememberMe);
        this.storeProfile();
        this.router.navigate([this._lastAuthenticatedPath]);
        return accessToken;
      }
    }
  }

  refreshToken(refreshToken: any): Observable<any> {
    return this.http.post<any>(`${BASE_API}/refresh-token`, { refreshToken }, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      }
    }).pipe(
      // tap(
      //   (res) => {
      //     const endCodeRefreshToken = CommonUtil.encryptMessage(res?.data?.refreshToken, this.getTokenPrivateKey());
      //     this.$localStorage.store(LOCAL_STORAGE.REFRESH_TOKEN, endCodeRefreshToken);
      //     this.storeAuthenticationToken(res?.data?.accessToken, true);
      //   },
      //   (err) => throwError(err)
      // )
    );
  }

  storeAuthenticationToken(jwt: any, rememberMe: boolean): void {
    // const endCodeAccessToken = CommonUtil.encryptMessage(jwt, this.getTokenPrivateKey());
    const endCodeAccessToken = jwt
    if (rememberMe) {
      this.$localStorage.store(LOCAL_STORAGE.JWT_TOKEN, endCodeAccessToken);
    } else {
      this.$sessionStorage.store(SESSION_STORAGE.JWT_TOKEN, endCodeAccessToken);
    }
  }
  
  getToken(): string {
    const accessTokenEncode = this.$localStorage.retrieve(LOCAL_STORAGE.JWT_TOKEN)
      || this.$sessionStorage.retrieve(SESSION_STORAGE.JWT_TOKEN);
    // return CommonUtil.decryptMessage(accessTokenEncode, this.getTokenPrivateKey());
    return accessTokenEncode
  }

  // getTokenPrivateKey(): string {
  //   let tokenPrivateKey = '';
  //   if (!this.tokenPrivateKey) {
  //     // nếu không có key tồn tại thì lấy key từ userProfile local storage
  //     // console.error('Token private key is not defined');
  //     const user = this.getCurrentUser();
  //     if (user) {
  //       tokenPrivateKey = user.id as string;
  //       this.tokenPrivateKey = tokenPrivateKey;
  //     } else {
  //       // nếu trong local storage không có user thì xoá hết thông tin profile
  //       console.error('User is not defined');
  //       this.clear();
  //     }
  //   } else {
  //     tokenPrivateKey = this.tokenPrivateKey;
  //   }
  //   return tokenPrivateKey;
  // }

  hasAnyAuthority(authorities: string[]): boolean {
    this.currentUser = this.getCurrentUser();
    let roles: any = [];
    console.log("test user", this.currentUser);
    
    roles = this.currentUser?.roles?.data.map((r: any) => { return r.name});
    if (roles?.includes('admin')) {
      return true;
    }
    let containsAll = authorities.length > 0 ? false : true;
    let grantedPermissions: any = [];
    if (this.currentUser) {
      if (this.currentUser.permissions) {
        grantedPermissions = this.currentUser.permissions.map((aData: any) => {
          // grantedPermissions = grantedPermissions.concat(aData?.map((pm: any) => { return pm.name}));
          return aData.name;
        });
      }
      if (grantedPermissions && authorities.length > 0) {
        containsAll = authorities.some(element => grantedPermissions.includes(element));
      }
    }
    return containsAll;
  }

  getUserProfile() {
    // Send request
    return this.http
      .get<any>(`${BASE_API}user/profile?include=roles,permissions`, { observe: 'response' });
  }

  async storeProfile() {
    await this.getUserProfile().subscribe(
      {
        next: (response) => {
          const currentUser = response?.body?.data
          this.$localStorage.store(LOCAL_STORAGE.PROFILE, currentUser);
          this.router.navigate(['/home']).then(()=> window.location.reload());  
        },
        error: (err: any) => { },
      });
  }

  
  getCurrentUser() {
    return this.$localStorage.retrieve(LOCAL_STORAGE.PROFILE);
  }

  createAccount(email: string, password: string) {
    // Send request
    console.log(email, password);
    
    return this.http
    .post<any>(`${BASE_API}register`, {
      email,
      password
    }, {
      headers: CommonUtil.headers(true)
    });
    
  }

  async changePassword(email: string, recoveryCode: string) {
    try {
      // Send request

      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Failed to change password"
      }
    }
  }

  async resetPassword(email: string) {
    try {
      // Send request

      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Failed to reset password"
      };
    }
  }

  async logOut() {
    const url = `${BASE_API}/logout`;
    let logoutRevokeRequest = {};
    const refreshToken = this.$localStorage.retrieve(LOCAL_STORAGE.REFRESH_TOKEN);
    if (refreshToken) {
      logoutRevokeRequest = {
        refreshToken,
      };
    }
    this.http.post<any>(url, logoutRevokeRequest);
    this.clear();
    this.router.navigate(['/authentication/login-form']);
  }

  clear(): void {
    this.$localStorage.clear(LOCAL_STORAGE.PROFILE);
    this.$localStorage.clear(LOCAL_STORAGE.JWT_TOKEN);
    this.$localStorage.clear(LOCAL_STORAGE.REFRESH_TOKEN);
    this.$sessionStorage.clear(SESSION_STORAGE.JWT_TOKEN);
  }
}
