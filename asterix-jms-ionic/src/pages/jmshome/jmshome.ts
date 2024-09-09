import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController,Slides } from 'ionic-angular';
//import { MessagesPage } from '../messages/messages';
//import { PaymentModePage } from '../payment-mode/payment-mode';
import { SchemeDetailPage } from '../scheme-detail/scheme-detail';
import { LoginPage } from '../login/login';
import { JoinChitPage } from '../join-chit/join-chit';
import { ChitListPage } from '../chit-list/chit-list';
import { WebClientProvider } from '../../providers/web-client/web-client';
// import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { PrinterListPage } from '../printer-list/printer-list';
import { DataProvider } from '../../providers/data/data';
import { memberupdatePage } from '../member-update/member-update';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs-compat';
import { Location } from '@angular/common';
import { Storage } from '@ionic/storage';
import { SearchPage } from '../search/search';
import { OffersPage } from '../offers/offers';
import { BenifitsPage } from '../benifits/benifits';
//import { HowtousePage } from '../Howtouse/Howtouse';
import { FaqPage } from '../faq/faq';
import {HowtouseappPage} from '../howtouseapp/howtouseapp';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


/**
 * Generated class for the JmshomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-jmshome',
  templateUrl: 'jmshome.html',
})
export class JmshomePage {
  pushes: any = [];
  slide1 = "https://kumuduapps.in:8443/logo/" + this.data.storeID + "/slide/slide1.jpg"
  slide2 = "https://kumuduapps.in:8443/logo/" + this.data.storeID + "/slide/slide2.jpg"
  slide3 = "https://kumuduapps.in:8443/logo/" + this.data.storeID + "/slide/slide3.jpg"
  slide4 = "https://kumuduapps.in:8443/logo/" + this.data.storeID + "/slide/slide4.jpg"
  slide5 = "https://kumuduapps.in:8443/logo/" + this.data.storeID + "/slide/slide5.jpg"




  metrics: any = {};
  rateslist: any = [];
  unsubscribeBackEvent: any;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  
  myplan: SafeResourceUrl;
  plan: SafeResourceUrl;
  offer: SafeResourceUrl;
  faqs: SafeResourceUrl;
  guide: SafeResourceUrl;
  benifits: SafeResourceUrl;
  pay: SafeResourceUrl;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public apiClient: WebClientProvider, 
    public modalCtrl: ModalController, public data: DataProvider, private fcm: FCM, public plt: Platform,
    public alertCtrl: AlertController, public storage: Storage,
    public iab: InAppBrowser,  public youtube:YoutubeVideoPlayer,private sanitizer: DomSanitizer ) {

     

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

      console.log("Slide1" + this.slide1)

  }


  ngOnInit() {
    // Set the icon URL to the path of the downloaded SVG icon
    this.myplan = this.sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/business-plan.svg');
    this.plan = this.sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/add.svg');
    this.faqs = this.sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/faq.svg');
    this.pay = this.sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/pay.svg');
    this.benifits = this.sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/authenticity.svg');
    this.offer = this.sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/offer.svg');
    this.guide = this.sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/guide.svg');
    
  }

  subscription: any;
  ionViewDidEnter() {
    this.subscription = this.plt.backButton.subscribe(() => {
      console.log('Back press handler!');
      console.log('Show Exit Alert!');
      this.showExitConfirm();
    });
  }


  ionViewDidLeave() {
    this.subscription.unsubscribe();
    this.slide1 = "https://kumuduapps.in:8443/logo/" + this.data.storeID + "/slide/slide1.jpg"
    this.slide2 = "https://kumuduapps.in:8443/logo/" + this.data.storeID + "/slide/slide2.jpg"
    this.slide3 = "https://kumuduapps.in:8443/logo/" + this.data.storeID + "/slide/slide3.jpg"
    this.slide4 = "https://kumuduapps.in:8443/logo/" + this.data.storeID + "/slide/slide4.jpg"
    this.slide5 = "https://kumuduapps.in:8443/logo/" + this.data.storeID + "/slide/slide5.jpg"
  }

  ionViewWillEnter() {
    this.data.setSearchterm("");
    this.data.membsearchterm = "";
    console.log('ionViewDidLoad DashboardPage');
    console.log("Slide1 : " + this.slide1)
    
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
          console.log("purity rate",result);
          this.rateslist = result;

        });
      } catch (e) {

      }
      try {
       // this.apiClient.showLoader();
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
        // this.apiClient.showLoader();
        // this.apiClient.dismissLoader();
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad JmshomePage');
  }

  offerspage() {
    this.navCtrl.push(OffersPage);
  }

  Benifitspage() {
    this.navCtrl.push(BenifitsPage);
  }

  howtouse() {
    this.navCtrl.push(HowtouseappPage);
  }

  faq() {
    this.navCtrl.push(FaqPage);
  }
  
  fb() {
    this.apiClient.Get_fbpath().then(result => {
      let urlNew = "";
      console.log("fb res",result);
      
      console.log("Data: of fb" + (result["data"]))
      if (result["data"] != "" || result["data"] != null) {
        urlNew = result["data"] + "";
        if (urlNew.length > 0 ) {
          const browser = this.iab.create(urlNew, "_system");
          browser.show()
        }
      }
    });
  }

  twitter() {
    this.apiClient.get_twitterpath().then(result => {
      let urlNew = "";
      console.log("Data:'" + (result["data"]) + "'")
      if (result["data"] != "" || result["data"] != null || result["data"] != undefined ) {
        urlNew = result["data"] + "";
        if (urlNew.length > 0 ) {
          const browser = this.iab.create(urlNew, "_blank", "hidden=no,location=no");
          browser.show()
        }
       
      }
    });
  }

  yt()  {
    this.apiClient.get_getytubepath().then(result => {
      let urlNew = "";
      console.log("Data:" + (result["data"]))
      if (result["data"] != "" || result["data"] != null) {
        urlNew = result["data"] + "";
        if (urlNew.length > 0 ) {
           const browser = this.iab.create(urlNew, "_blank", "hidden=no,location=no");
           browser.show()
          //console.log("opne" + urlNew )
          //this.youtube.openVideo(urlNew)
        }
      }
    });
  }

  insta() {
    this.apiClient.get_getinstapath().then(result => {
      let urlNew = "";
      console.log("Data:" + (result["data"]))
      if (result["data"] != "" || result["data"] != null) {
        urlNew = result["data"] + "";
        if (urlNew.length > 0 ) {
          const browser = this.iab.create(urlNew, "_blank", "hidden=no,location=no");
          browser.show()
        }
      }
    });
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
