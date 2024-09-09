import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PushnotePage } from './pushnote';

@NgModule({
  declarations: [
    PushnotePage,
  ],
  imports: [
    IonicPageModule.forChild(PushnotePage),
  ],
})
export class PushnotePageModule {}
