import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserLedgerPage } from './user-ledger';

@NgModule({
  declarations: [
    UserLedgerPage,
  ],
  imports: [
    IonicPageModule.forChild(UserLedgerPage),
  ],
})
export class UserLedgerPageModule {}
