// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import 'rxjs/add/operator/map';
// import { Geolocation, Geoposition } from '@ionic-native/geolocation';
// //import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder/ngx';
// import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
// /*
//   Generated class for the GeocoderProvider provider.

//   See https://angular.io/guide/dependency-injection for more info on providers
//   and Angular DI.
// */
// @Injectable()
// export class GeocoderProvider {

// //   options: NativeGeocoderOptions = {
// //     useLocale: true,
// //     maxResults: 5
// //   };

//   constructor(public http: HttpClient,  private _GEOCODE  : NativeGeocoder) {
//     console.log('Hello GeocoderProvider Provider');
//   };

//   reverseGeocode(lat : number, lng : number) : Promise<any>
//   {
//    console.log('call reverseGeocode');
//      return new Promise((resolve, reject) =>
//      {
//       console.log('call ' + lat + " / " + lng);
//       this._GEOCODE.reverseGeocode(52.5072095, 13.1452818)
//     .then((result: NativeGeocoderResult[])=>{
// //...
// }).catch((error: any) => console.log(error));

//         this._GEOCODE.reverseGeocode(lat, lng)

//         .then((result : NativeGeocoderResult[]) => console.log(JSON.stringify(result[0])))
//       //   {
//       //    console.log(JSON.stringify(result[0]))
//       //     console.log(result[0]);
//       //     console.log(result);
//       //      let str : string   = `The reverseGeocode address is ${result["street"]} in ${result["countryCode"]}`;
//       //      console.log(str);
//       //      resolve(str);
//       //   })
//         .catch((error: any) => 
//         {
//          console.log('call er');
//            console.log(error);
//            reject(error);
//         });
//      });
//   }

//   forwardGeocode(keyword : string) : Promise<any>
//    {
//       return new Promise((resolve, reject) =>
//       {
//          this._GEOCODE.forwardGeocode(keyword)
//          .then((coordinates : NativeGeocoderResult[]) => 
//          {
//           console.log(coordinates);
//             let str : string   = `The coordinates are latitude=${coordinates["latitude"]} and longitude=${coordinates["longitude"]}`;
//             resolve(str);
//          })
//          .catch((error: any) => 
//          {
//             console.log(error);
//             reject(error);
//          });
//       });
//    }
 
// }
