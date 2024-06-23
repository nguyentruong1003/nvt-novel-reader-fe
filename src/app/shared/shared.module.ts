import { CommonModule, DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FooterModule, HeaderModule } from './components';
import { DxDataGridModule, DxFormModule, DxLoadIndicatorModule } from 'devextreme-angular';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    DxDataGridModule,
    DxLoadIndicatorModule,
    DxFormModule,
  ],
  exports: [
    FormsModule,
    DxDataGridModule,
    DxLoadIndicatorModule,
    DxFormModule,
  ],
  providers: [
  ],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {
  
}

