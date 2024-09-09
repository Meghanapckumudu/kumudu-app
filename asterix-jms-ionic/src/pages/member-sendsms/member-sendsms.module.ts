import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { membersendsmsPage } from './member-sendsms';

@NgModule({
  declarations: [
    membersendsmsPage,
  ],
  imports: [
    IonicPageModule.forChild(membersendsmsPage),
  ],
})
export class membersendsmsPageModule {}
