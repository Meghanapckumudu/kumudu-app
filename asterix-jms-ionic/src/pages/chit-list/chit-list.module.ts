import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChitListPage } from './chit-list';

@NgModule({
  declarations: [
    ChitListPage,
  ],
  imports: [
    IonicPageModule.forChild(ChitListPage),
  ],
})
export class ChitListPageModule {}
