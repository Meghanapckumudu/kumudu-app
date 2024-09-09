import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { memberupdatePage } from './member-update';

@NgModule({
  declarations: [
    memberupdatePage,
  ],
  imports: [
    IonicPageModule.forChild(memberupdatePage),
  ],
})
export class memberupdatePageModule {}
