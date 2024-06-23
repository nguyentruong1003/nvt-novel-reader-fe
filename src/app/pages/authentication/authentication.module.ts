import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginFormComponent } from './login-form/login-form.component';
import { ResetPasswordFormComponent } from './reset-password-form/reset-password-form.component';
import { ChangePasswordFormComponent } from './change-password-form/change-password-form.component';
import { CreateAccountFormComponent } from './create-account-form/create-account-form.component';


@NgModule({
  declarations: [
    LoginFormComponent,
    ResetPasswordFormComponent,
    ChangePasswordFormComponent,
    CreateAccountFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AuthenticationRoutingModule
  ]
})
export class AuthenticationModule {
}
