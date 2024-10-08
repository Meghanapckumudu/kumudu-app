import { DataProvider } from '../../providers/data/data';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { WebClientProvider } from '../../providers/web-client/web-client';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';



@IonicPage()
@Component({
   selector: 'page-geoloc',
   templateUrl: 'geoloc.html',
})
export class geolocPage {
   geoLatitude: number;
   geoLongitude: number;
   geoAccuracy: number;
   geoAddress: string;
   watchLocationUpdates: any;
   loading: any;
   isWatching: boolean;
   //Geocoder configuration
   geoencoderOptions: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
   };
   constructor(
      private geolocation: Geolocation,  private nativeGeocoder: NativeGeocoder
   ) {
   }

   //Get current coordinates of device
   getGeolocation(){
      this.geolocation.getCurrentPosition().then((resp) => {
        this.geoLatitude = resp.coords.latitude;
        this.geoLongitude = resp.coords.longitude; 
        this.geoAccuracy = resp.coords.accuracy; 
        this.getGeoencoder(this.geoLatitude,this.geoLongitude);
       }).catch((error) => {
         alert('Error getting location'+ JSON.stringify(error));
       });
    }

    //geocoder method to fetch address from coordinates passed as arguments
    getGeoencoder(latitude,longitude){
      this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderReverseResult[]) => {
        this.geoAddress = this.generateAddress(result[0]);
      })
      .catch((error: any) => {
        alert('Error getting location'+ JSON.stringify(error));
      });
    }

    //Return Comma saperated address
    generateAddress(addressObj){
      let obj = [];
      let address = "";
      for (let key in addressObj) {
        obj.push(addressObj[key]);
      }
      obj.reverse();
      for (let val in obj) {
        console.log('val :' + val)

        if(obj[val].length)
        address += obj[val]+', ';
        console.log('obj[val] :' + obj[val])
      }
    return address.slice(0, -2);
  }

  //Start location update watch
  watchLocation(){
   this.isWatching = true;
   this.watchLocationUpdates = this.geolocation.watchPosition();
   this.watchLocationUpdates.subscribe((resp) => {
     this.geoLatitude = resp.coords.latitude;
     this.geoLongitude = resp.coords.longitude; 
     this.getGeoencoder(this.geoLatitude,this.geoLongitude);
   });
 }

 //Stop location update watch
 stopLocationWatch(){
   this.isWatching = false;
   this.watchLocationUpdates.unsubscribe();
 }
 


}