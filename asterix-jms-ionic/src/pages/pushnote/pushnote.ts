import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { FCM } from '@ionic-native/fcm';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs-compat';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
//import { map } from 'rxjs-compat/operator';

/**
 * Generated class for the PushnotePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pushnote',
  templateUrl: 'pushnote.html',

})
export class PushnotePage {
  pushes: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private fcm: FCM, public plt: Platform) {
    this.plt.ready()
      .then(() => {
        try {
          this.fcm.getToken().then(token => {
            console.log("gettoken");
            console.log(token);
          });
          this.fcm.onTokenRefresh().subscribe(token => {
            console.log("refresh")
            console.log(token);
          });

          console.log("Received");
          this.fcm.onNotification().subscribe(data => {
            console.log(data);
             console.log(JSON.stringify(data));
            console.log("this.pushes:" + data.title);
           
            // console.log("this.pushes:" + this.pushes)
            // console.log("this.pushes.title:" + this.pushes.title)
            // console.log('title' + this.pushes.title);
            if (data.wasTapped) {
              console.log("Received in background");
              this.pushes.push({
                body: data.body,
                title: data.title
              })
            } else {
              console.log("Received in foreground");
              this.pushes.push({
                body: data.body,
                title: data.title
              })
            };
          });

          this.fcm.onTokenRefresh().subscribe(token => {
            // Register your new token in your back-end if you want
            // backend.registerToken(token);
          });
        } catch (error) {

        }
      })

  }
  // subscribeToTopic() {
  //   this.fcm.subscribeToTopic('enappd');
  // }
  // getToken() {
  //   this.fcm.getToken().then(token => {
  //     // Register your new token in your back-end if you want
  //     // backend.registerToken(token);
  //   });
  // }
  // unsubscribeFromTopic() {
  //   this.fcm.unsubscribeFromTopic('enappd');
  // }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PushnotePage');
  }

}
