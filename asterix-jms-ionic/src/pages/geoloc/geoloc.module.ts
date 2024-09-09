import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { geolocPage } from './geoloc';

@NgModule({
  declarations: [
    geolocPage,
  ],
  imports: [
    IonicPageModule.forChild(geolocPage),
  ],
})
export class geolocPageModule {}
