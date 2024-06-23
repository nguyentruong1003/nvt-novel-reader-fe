import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { DxDataGridModule, DxFormModule, DxLoadIndicatorModule, DxScrollViewModule } from 'devextreme-angular';
import { SharedModule } from '../shared/shared.module';
import { SingleCardComponent } from './single-card/single-card.component';



@NgModule({
  declarations: [
    SingleCardComponent
  ],
  imports: [
    CommonModule,
    DxDataGridModule,
    DxLoadIndicatorModule,
    DxFormModule,
    SharedModule,
    DxScrollViewModule
  ],
  exports: [
    SingleCardComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
})
export class LayoutModule {
}
