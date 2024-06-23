import { Injectable, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { AUTH_PATH } from 'src/app/shared/constants/base.constant';
import { AuthService } from 'src/app/shared/services';
import { ROUTER_UTILS } from 'src/app/shared/utils/router.utils';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private $localStorage: LocalStorageService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log("guard ", this.authService.loggedIn);
    
    if (!this.authService.loggedIn) {
      this.router.navigate(['/' + ROUTER_UTILS.authentication.root + '/' + ROUTER_UTILS.authentication.login]);
    }
    const authorities = route?.data['authorities'] || [];
    console.log(this.checkRole(authorities, state.url));
    
    return this.checkRole(authorities, state.url);
  }

  checkRole(authorities: string[], url: string): boolean {
    // debugger
    console.log(authorities);
    
    if (!authorities || authorities.length === 0) {
      this.router.navigate([AUTH_PATH]);
      return false;
    }

    if (this.authService.getUserProfile()) {
      const hasAnyAuthority = this.authService.hasAnyAuthority(authorities);
      if (hasAnyAuthority) {
        return true;
      }

      if (isDevMode()) {
        console.error('User has not any of required authorities: ', authorities);
      }
      // this.handle403();
    }
    this.router.navigate([AUTH_PATH]);
    return false;
  }

  // handle403(): boolean {
  //   this.router.navigate(['/403']);
  //   return false;
  // }

}
