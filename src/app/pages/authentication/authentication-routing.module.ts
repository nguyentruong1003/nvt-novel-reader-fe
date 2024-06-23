import { NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';
import { CreateAccountFormComponent } from './create-account-form/create-account-form.component';
import { ResetPasswordFormComponent } from './reset-password-form/reset-password-form.component';
import { ChangePasswordFormComponent } from './change-password-form/change-password-form.component';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { ROUTER_UTILS } from 'src/app/shared/utils/router.utils';

const routes: Routes = [
  {
    path: '',
    redirectTo: ROUTER_UTILS.authentication.login,
    pathMatch: 'full'
  },
  {
    path: ROUTER_UTILS.authentication.login,
    component: LoginFormComponent
  },
  {
    path: ROUTER_UTILS.authentication.signup,
    component: CreateAccountFormComponent
  },
  {
    path: ROUTER_UTILS.authentication.resetpassword,
    component: ResetPasswordFormComponent
  },
  {
    path: ROUTER_UTILS.authentication.changepassword,
    component: ChangePasswordFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['role:create'],
      title: 'login.reset-password.title'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule {
}
