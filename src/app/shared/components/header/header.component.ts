import { Component, NgModule, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services';
import { UserPanelModule } from '../user-panel/user-panel.component';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';
import { User } from 'src/app/shared/models/user.model';

import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  @Output()
  menuToggle = new EventEmitter<boolean>();

  @Input()
  menuToggleEnabled = false;

  @Input()
  title!: string;

  user: User;

  userMenuItems: any;

  isAuthenticated: any = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.loggedIn) {
      this.user = this.authService.getCurrentUser();
      this.isAuthenticated = true;
      this.userMenuItems = [{
        text: 'Profile',
        icon: 'user',
        onClick: () => {
          this.router.navigate(['/profile']);
        }
      },
      {
        text: 'Logout',
        icon: 'runner',
        onClick: () => {
          this.authService.logOut();
        }
      }];
    } else {
      this.isAuthenticated = false;
      this.userMenuItems = [
        {
          text: 'Login',
          icon: 'user',
          onClick: () => {
            this.router.navigate(['/authentication/login-form']);
          }
        },
        {
          text: 'Sign up',
          icon: 'user',
          onClick: () => {
            this.router.navigate(['/authentication/create-account']);
          }
        }
      ];
    }
  }

  toggleMenu = () => {
    this.menuToggle.emit();
  }
}

@NgModule({
  imports: [
    CommonModule,
    DxButtonModule,
    UserPanelModule,
    DxToolbarModule
  ],
  declarations: [ HeaderComponent ],
  exports: [ HeaderComponent ]
})
export class HeaderModule { }
