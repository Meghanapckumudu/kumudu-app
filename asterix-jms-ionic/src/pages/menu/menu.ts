import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, App, AlertController } from 'ionic-angular';
import { CollectionReportPage } from '../collection-report/collection-report';
import { SearchPage } from '../search/search';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';
import { SettingsPage } from '../settings/settings';
import { TestpayPage } from '../testpay/testpay';

import { Storage } from '@ionic/storage';
import { DashboardPage } from '../dashboard/dashboard';
import { JoinChitPage } from '../join-chit/join-chit';
import { ChitListPage } from '../chit-list/chit-list';
import { DataProvider } from '../../providers/data/data';
import { MyProfilePage } from '../my-profile/my-profile';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { geolocPage } from '../geoloc/geoloc';
import { memberupdatePage } from '../member-update/member-update';
import { membersendsmsPage } from '../member-sendsms/member-sendsms';
import { PushnotePage } from '../pushnote/pushnote';
import { TesteasypayPage } from '../testeasypay/testeasypay';
import { Platform } from 'ionic-angular';
import { Location } from '@angular/common';
import { JmshomePage } from '../jmshome/jmshome';
//import {InAppBrowser} from '@ionic-native/in-app-browser'
//import {Http, RequestOptions, ResponseContentType, URLSearchParams} from '@angular/http';



//import { Paytm } from '@ionic-native/paytm';

/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
}

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  // Basic root for our content view
  rootPage = TabsPage;

  // Reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  pages: PageInterface[] = [
    { title: 'Home', pageName: 'TabsPage', tabComponent: 'CollectionReportPage', index: 0, icon: 'home' },
    { title: 'Search', pageName: 'TabsPage', tabComponent: 'SearchPage', index: 1, icon: 'contacts' },
    { title: 'Reports', pageName: 'TabsPage', tabComponent: 'SearchPage', index: 2, icon: 'pie' },
    { title: 'Messages', pageName: 'TabsPage', tabComponent: 'SearchPage', index: 3, icon: 'mail' }

  ];

  subscription: any;
  menuStoreId: any;
  constructor(public navCtrl: NavController, public storage: Storage,
    public data: DataProvider, public app: App, public http: HttpClient,
    public plt: Platform, private _location: Location, public alertController: AlertController) {
    //public paytm: Paytm,
    //, public iab: InAppBrowser
    // this.subscription =   this.plt.backButton.subscribe(() => {
    //   console.log('Back press handler!');
    //   console.log(this._location.path);
    //   let Mypages: any = MenuPage;
    //   this.navCtrl.pop(Mypages);

    // });
    // this.plt.backButton.subscribe(10, (processNextHandler) => {
    //   console.log('Back press handler!');
    //   console.log(this._location.path)
    //   if (this._location.isCurrentPathEqualTo('/home')) {

    //     // Show Exit Alert!
    //     console.log('Show Exit Alert!');
    //     this.showExitConfirm();
    //     processNextHandler();
    //   } else {

    //     // Navigate to back page
    //     console.log('Navigate to back page');
    //     this._location.back();

    //   }

    // });
    this.menuStoreId = this.data.storeID

  }
  ionViewDidLeave() {
    //this.subscription.unsubscribe();
  }


  openPage(page: PageInterface) {
    let params = {};

    // The index is equal to the order of our tabs inside tabs.ts
    if (page.index) {
      console.log("tabIndex: page.index" + page.index)
      params = { tabIndex: page.index };
    }
    console.log("page.pageName")
    // The active child nav is our Tabs Navigation
    if (this.nav.getActiveChildNav() && page.index != undefined) {
      console.log("page.pageName -1 " + page.pageName)
      this.nav.getActiveChildNav().select(page.index);

    } else {
      // Tabs are not active, so reset the root page 
      // In this case: moving to or from SpecialPage
      console.log("page.pageName -2 " + page.pageName)
      this.nav.setRoot(page.pageName, params);

    }
  }

  isActive(page: PageInterface) {
    // Again the Tabs Navigation
    let childNav = this.nav.getActiveChildNav();
    console.log("Active ")
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    // Fallback needed when there is no active childnav (tabs not active)
    if (this.nav.getActive() && this.nav.getActive().name === page.pageName) {
      //console.log("primary-out " )
      return 'primary';
    }
    return;
  }
  logoutClass() {
    //console.log("logoutClass-out " )
    return '';
  }
  logoutIconClass() {
    //console.log("log-out " )
    return 'log-out';
  }
  goToLoginPage() {
    this.storage.clear();
    this.navCtrl.setRoot(LoginPage);
  }
  goToSettingPage() {
    this.navCtrl.push(SettingsPage);
  }
  goToHome() {
    this.navCtrl.push(JmshomePage);
  }
  goToJoinChit() {
    this.navCtrl.push(ChitListPage);
  }
  goToMyChits() {
    this.navCtrl.push(SearchPage);
  }
  goToReport() {
    this.navCtrl.push(MyProfilePage);
  }
  payResponse = "";

  gotoPayTest() {
    this.navCtrl.push(TestpayPage);
  }

  goToGeoLocation() {
    this.navCtrl.push(geolocPage);
  }

  gotoPushNote() {
    this.navCtrl.push(PushnotePage);
  }


  gototsteasypay() {
    this.navCtrl.push(TesteasypayPage);
  }

  pay_check() {
    console.log("pay_check called")
    var options = {
      description: 'Scheme Payment',
      image: 'https://kumuduapps.in:8443/logo/21//favicon.png',//'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_test_yMJKzjz8mTggSd',
      order_id: 'order_F1yhyhROyAn9UR',
      amount: '5000',
      name: 'city Gold',
      prefill: {
        email: 'aparna.rajkumar+053@razorpay.com',
        contact: '8879524924',
        name: 'Pranav Gupta'
      },
      theme: {
        color: '#F37254'
      },
      modal: {
        ondismiss: function () {
          alert('dismissed')
        }
      }
    };
    let endPoint = "https://api.razorpay.com/v1/checkout/embedded";

    return new Promise((resolve, reject) => {
      this.http
        .post(endPoint, options)
        .subscribe(
          res => {
            try {
              let data = res;
              console.log("data :" + res)
              resolve(data);
            } catch (e) {
              console.log(e);
              console.log("catch :" + res)
            }
          },
          err => {
            resolve([]);
            reject(err);
            console.log("error :" + err)
          }
        );
    });

  }

  goToUpdateMember() {
    this.navCtrl.push(memberupdatePage);
  }

  goToSendSmsToMember() {
    this.navCtrl.push(membersendsmsPage);
  }

  showExitConfirm() {
    let alert = this.alertController.create({
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
        text: 'Exit',
        handler: () => {
          navigator['app'].exitApp();
        }
      }]
    });
    alert.present();
  }

  /*
  pay_paytm() {
    this.paytm.startPayment("ORDER00011", "CUST00011", "test@gmail.com", "9999999999", "1.00", "staging")
      .then((res: any) => {
        console.log(res);
        this.payResponse = JSON.stringify(res);
      })
      .catch((error: any) => {
        console.error(error);
        this.payResponse = JSON.stringify(error);
      });
  }?

  
  orderId(){
    var url = "https://api.razorpay.com/v1/orders";
    var data = {
            "amount":5000,
            "currency":"INR",
            "payment_capture":1
    }
    let head = {headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization':'rzp_test_yMJKzjz8mTggSd:QUnwF3gijdJTCIRVu55gVbA7',// 'Basic cnpwX3Rlc3RfeU1KS3pqejhtVGdnU2Q6UVVud0YzZ2lqZEpUQ0lSVnU1NWdWYkE3',//
      'Access-Control-Allow-Origin': 'localhost:8100', 
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type'
    }};

    this.http.post(url, data, head).subscribe(
      res => {
        console.log('res: ', res);
        
      },
      err => {
        console.log('ERROR: ', err);
       
      }
    );
    

}

public orderId_servercall() {
  let endPoint =
      this.data.url + "schemes/GetRazorOrder_ID/";
      return new Promise((resolve, reject) => {
        this.http
          .get(endPoint)
          .subscribe(
            res => {
              try {
                let data = res;
                resolve(data);
                console.log(data)
              } catch (e) {
                console.log(e);
              }
            },
            err => {
              resolve([]);
              reject(err);
            }
          );
      });
}

public checkout(){
  /*
  var pageContent = '<html><head></head><body><form id="loginForm" action="YourPostURL" method="post">' +
'<input type="hidden" name="key1" value="' + YourValue1 + '">' +
'<input type="hidden" name="key" value="' + YourValue2 + '">' +
'</form> <script type="text/javascript">document.getElementById("loginForm").submit();</script></body></html>';

var pageContent1 = '<form method=”POST” action=”https://api.razorpay.com/v1/checkout/embedded”>'
'<input type=”hidden” name=”key_id” value=”rzp_test_yMJKzjz8mTggSd”>'
'<input type=”hidden” name=”order_id” value=”order_EAEQMMvdw8tktl”>'
'<input type=”hidden” name=”amount” value=”50000”>'
'<input type=”hidden” name=”name” value=”HDFC VAS”>'
'<input type=”hidden” name=”description” value=”CityGold”>'
'<input type=”hidden” name=”prefill[email]”'
'value=”gaurav.kumar@example.com”>'
'<input type=”hidden” name=”prefill[contact]” value=”9999999999”>'
'<input type=”hidden” name=”notes[transaction_id]” value=”transaction_1234”>'
'<input type=”hidden” name=”callback_url” value=”http://jms.asterixtechnology.com/api/”>'
'<button>Submit</button>'
'</form>'

var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent1);

var browserRef =this.iab.create(
    pageContentUrl ,
    "_blank",
    "hidden=no,location=no,clearsessioncache=yes,clearcache=yes"
);

}
*/
  tt() {
    //let params: any = [];
    let Myurl = "https://kumuduapps.in:8443/paysuccess.jsp?razorpay_order_id=order_FEK45J4ACE4N0I&razorpay_payment_id=pay_FEK4AGTlYO3Fkb&razorpay_signature=53fb38debe3340c333e1372d7ae069b6f8eaf40363b497f4375beb7338c5c740"
    var regex = /[?&]([^=#]+)=([^&#]*)/g,
      url = Myurl,
      params: any = [],
      match;
    while (match = regex.exec(url)) {
      params[match[1]] = match[2];
    }
    console.log(params);
    console.log(params.razorpay_order_id);
    console.log(params.razorpay_signature);
    console.log(params.razorpay_payment_id);

  };

}
