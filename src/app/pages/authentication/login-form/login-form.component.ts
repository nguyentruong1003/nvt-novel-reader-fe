import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import notify from 'devextreme/ui/notify';
import { AuthService } from '../../../shared/services';
import { LoadingService } from 'src/app/shared/services/helpers/loading.service';


@Component({
  // selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  loading = false;
  formData: any = {};

  constructor(private authService: AuthService, private router: Router, private onLoading: LoadingService) { }

  ngOnInit() {
    // this.onLoading.show();
  }

  async onSubmit(e: Event) {
    e.preventDefault();
    const { email, password } = this.formData;
    this.loading = true;

    // if (this.formData.valid) {
      this.loading = true
      this.onLoading.show()
      await this.authService.logIn(email, password).subscribe(
        {
          next: (token) => {
            this.loading = false
            this.onLoading.hide();
          },
      
          error: (err: any) => {
            this.loading = false;
            this.onLoading.hide();
            notify("error", 'error', 2000);
          },
        }
        // (token) => {
        //   // this.requestPermission()
        //   // if (token && this.authService.getToken()) {
        //   //   this.isLoading = false
        //   //   this.authService.storeProfile('/admin/dashboard');
        //   //   this.getNotification()
        //   // }
        // }, err => {
        //   this.loading = false;
        // }
      );
    // } else {
    //   Object.values(this.formData.controls).forEach(control => {
    //     this.loading = false
    //     // if (control.invalid) {
    //     //   control.markAsDirty();
    //     //   control.updateValueAndValidity({ onlySelf: true });
    //     // }
    //   });
    // }

    // const result = await this.authService.logIn(email, password);
    // if (!result.isOk) {
    //   this.loading = false;
    //   notify(result.message, 'error', 2000);
    // }
  }

  onCreateAccountClick = () => {
    this.router.navigate(['/authentication/create-account']);
  }
}
