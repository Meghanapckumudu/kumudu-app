import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BenifitsPage } from './benifits';

@NgModule({
  declarations: [
    BenifitsPage,
  ],
  imports: [
    IonicPageModule.forChild(BenifitsPage),
  ],
})
export class BenifitsPageModule {}
