import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestpayPage } from './testpay';

@NgModule({
  declarations: [
    TestpayPage,
  ],
  imports: [
    IonicPageModule.forChild(TestpayPage),
  ],
})
export class TestpayPageModule {}
