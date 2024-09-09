import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupsdetailsPage } from './groupsdetails';

@NgModule({
  declarations: [
    GroupsdetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupsdetailsPage),
  ],
})
export class GroupsdetailsPageModule {}
