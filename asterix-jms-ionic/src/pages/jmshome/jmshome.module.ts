import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JmshomePage } from './jmshome';

@NgModule({
  declarations: [
    JmshomePage,
  ],
  imports: [
    IonicPageModule.forChild(JmshomePage),
  ],
})
export class JmshomePageModule {}
