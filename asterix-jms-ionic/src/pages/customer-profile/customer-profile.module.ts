import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerProfilePage } from './customer-profile';

@NgModule({
  declarations: [
    CustomerProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerProfilePage),
  ],
})
export class CustomerProfilePageModule {}
