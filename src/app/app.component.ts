import { Component, HostBinding, Input } from '@angular/core';
import { AuthService, ScreenService, AppInfoService } from './shared/services';
import { ROUTER_UTILS } from './shared/utils/router.utils';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  @HostBinding('class') get getClass() {
    return Object.keys(this.screen.sizes).filter(cl => this.screen.sizes[cl]).join(' ');
  }

  @Input()
  login_page: Boolean = false

  constructor(private authService: AuthService, private screen: ScreenService, public appInfo: AppInfoService, private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          console.log('this.router.url', this.router.url);
          console.log(this.router.url.includes(ROUTER_UTILS.authentication.root));
          
          if (this.isAuthenticated()) this.login_page = false
          else if (this.router.url.includes(ROUTER_UTILS.authentication.root)) {
            this.login_page = true;
          } else this.login_page = false
        }
      }
    );
  }

  isAuthenticated() {
    return this.authService.isAdminLogin;
  }

  isLoginPage() {
    return this.login_page
  }
}
