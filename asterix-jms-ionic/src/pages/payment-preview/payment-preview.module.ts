import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentPreviewPage } from './payment-preview';

@NgModule({
  declarations: [
    PaymentPreviewPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentPreviewPage),
  ],
})
export class PaymentPreviewPageModule {}
