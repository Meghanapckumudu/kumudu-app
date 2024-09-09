import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentModePage } from './payment-mode';

@NgModule({
  declarations: [
    PaymentModePage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentModePage),
  ],
})
export class PaymentModePageModule {}
