import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ValidationCallbackData } from 'devextreme-angular/common';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import notify from 'devextreme/ui/notify';
import { AuthService } from '../../../shared/services';
import { LoadingService } from 'src/app/shared/services/helpers/loading.service';


@Component({
  selector: 'app-create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: ['./create-account-form.component.scss']
})
export class CreateAccountFormComponent {
  loading = false;
  formData: any = {};

  constructor(private authService: AuthService, private router: Router, private onLoading: LoadingService) { }

  async onSubmit(e: Event) {
    e.preventDefault();
    const { email, password } = this.formData;
    this.loading = true;
    this.onLoading.show();

    this.authService.createAccount(email, password).subscribe(
      {
        next: (token) => {
          this.loading = false
          this.onLoading.hide();
          // this.router.navigate(['/authentication/login-form']);
          this.authService.logIn(email, password).subscribe();
        },
    
        error: (err: any) => {
          this.loading = false;
          this.onLoading.hide();
          notify("error", 'error', 2000);
        },
      }
    );
    this.loading = false;

    // if (result.isOk) {
    //   this.router.navigate(['/authentication/login-form']);
    // } else {
    //   notify(result.message, 'error', 2000);
    // }
  }

  confirmPassword = (e: ValidationCallbackData) => {
    return e.value === this.formData.password;
  }
}
