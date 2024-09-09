import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CollectionSummaryPage } from './collection-summary';

@NgModule({
  declarations: [
    CollectionSummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(CollectionSummaryPage),
  ],
})
export class CollectionSummaryPageModule {}
