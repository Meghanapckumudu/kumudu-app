import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SchemeDetailPage } from './scheme-detail';

@NgModule({
  declarations: [
    SchemeDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SchemeDetailPage),
  ],
})
export class SchemeDetailPageModule {}
