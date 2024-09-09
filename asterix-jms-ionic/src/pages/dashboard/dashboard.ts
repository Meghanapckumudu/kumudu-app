import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
//import { MessagesPage } from '../messages/messages';
//import { PaymentModePage } from '../payment-mode/payment-mode';
import { SchemeDetailPage } from '../scheme-detail/scheme-detail';
import { LoginPage } from '../login/login';
//import { JoinChitPage } from '../join-chit/join-chit';
import { ChitListPage } from '../chit-list/chit-list';
import { WebClientProvider } from '../../providers/web-client/web-client';
// import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
//import { PrinterListPage } from '../printer-list/printer-list';
import { DataProvider } from '../../providers/data/data';
import { memberupdatePage } from '../member-update/member-update';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { Platform } from 'ionic-angular';
//import { Observable } from 'rxjs-compat';
import { Location } from '@angular/common';
import { Storage } from '@ionic/storage';
import { SearchPage } from '../search/search';

//import { Paytm } from '@ionic-native/paytm';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  pushes: any = [];
  slide1 = "https://kumuduapps.in:8443/logo/" + this.data.storeID + "/slide/slide1.jpg"
  slide2 = "https://kumuduapps.in:8443/logo/" + this.data.storeID + "/slide/slide2.jpg"
  slide3 = "https://kumuduapps.in:8443/logo/" + this.data.storeID + "/slide/slide3.jpg"
  slide4 = "https://kumuduapps.in:8443/logo/" + this.data.storeID + "/slide/slide4.jpg"
  slide5 = "https://kumuduapps.in:8443/logo/" + this.data.storeID + "/slide/slide5.jpg"

  metrics: any = {};
  rateslist: any = [];
  unsubscribeBackEvent: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public apiClient: WebClientProvider,
    public modalCtrl: ModalController, public data: DataProvider, private fcm: FCM, public plt: Platform,
    public alertCtrl: AlertController, public storage: Storage,) {
    //, private paytm: Paytm
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
            console.log(data.title);
            //console.log(this.pushes.title);


            if (data.wasTapped) {
              console.log("Received in background");
              this.pushes.push({
                body: data.desc,
                title: data.header
              })

            } else {
              console.log("Received in foreground");
              this.pushes.push({
                body: data.desc,
                title: data.header
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

    // this.plt.backButton.subscribe(() => {
    //   console.log('Back press handler!');
    //   console.log('Show Exit Alert!');
    //   this.showExitConfirm();
    //   //processNextHandler();
    //   //console.log(this._location.path);
    // });
  }
  subscription: any;
  ionViewDidEnter() {
    this.subscription = this.plt.backButton.subscribe(() => {
      // this.initializeBackButtonCustomHandler();
      console.log('Back press handler!');
      console.log('Show Exit Alert!');
      this.showExitConfirm();
    });
  }

  // initializeBackButtonCustomHandler(): void {
  //   this.unsubscribeBackEvent = this.plt.backButton.subscribe(999999,  () => {
  //     //  if(window.confirm('Do you want to exit the app?'))
  //     //  {
  //     //     navigator['app'].exitApp();
  //     //   }
  //     console.log('Back press handler!');
  //     console.log('Show Exit Alert!');
  //     this.showExitConfirm();
  //   });
  // }

  ionViewDidLeave() {
    this.subscription.unsubscribe();
  }


  ionViewDidLoad() {

  }
  ionViewWillEnter() {
    console.log('ionViewDidLoad DashboardPage');
    if (this.data.userLoginType != 'customer') {
      console.log(" this.data.agentID : " + this.data.agentID);
      this.apiClient.showLoader();
      this.apiClient.getDashboard(this.data.agentID).then(result => {
        console.log(result);
        this.metrics = result;
        //this.apiClient.dismissLoader();
      });
      try {
        this.apiClient.getRatelist().then(result => {
          console.log("rate")
          console.log(result);
          this.rateslist = result;

        });
      } catch (e) {

      }
      try {
        this.apiClient.dismissLoader();
      } catch (e) {

      }

    } else {
      this.apiClient.showLoader();
      this.apiClient.dismissLoader();
      console.log('ionViewDidLoad DashboardPage-2');

      this.apiClient.getRatelist().then(result => {
        console.log(result);
        this.rateslist = result;

      });
      try {
        this.apiClient.dismissLoader();
      } catch (e) {

      }

    }
  }
  messages() {
    console.log('messages');
    this.navCtrl.parent.select(3);
  }
  GoTOPaymentMode() {
    console.log('GoTOPaymentMode');
    this.navCtrl.push(ChitListPage);
  }
  goToSchemeDetail() {
    console.log('goToSchemeDetail');
    this.navCtrl.push(SchemeDetailPage);
  }
  reports() {
    this.navCtrl.parent.select(2);
  }
  goToLoginPage() {
    //window.location.reload();
  }
  goToMemberUpdate() {
    this.navCtrl.push(memberupdatePage);
  }
  payResponse = "";

  dojoinscheme() {
    this.navCtrl.push(ChitListPage);
  }
  goToMyChits() {
    this.navCtrl.push(SearchPage);
  }

  test() {
    let alert = this.alertCtrl.create({
      title: 'launching...',
      message: 'launching.. soon...',
      buttons: [
        {
          text: 'Ok',
          role: 'ok',
          handler: () => {

          }
        }
      ]
    });
    alert.present();
  }

  showExitConfirm() {
    let alert = this.alertCtrl.create({
      title: 'App termination',
      message: 'Do you want to close the app?',
      //backdropDismiss: false,
      buttons: [{
        text: 'Stay',
        role: 'cancel',
        handler: () => {
          console.log('Application exit prevented!');
        }
      }, {
        text: 'Log out',
        handler: () => {

          this.storage.clear();
          this.navCtrl.setRoot(LoginPage);
          //this.plt.backButton.unsubscribe();
        }
      }]
    });
    alert.present();
  }

}
