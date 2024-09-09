import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, Platform } from 'ionic-angular';
import { WebClientProvider } from '../../providers/web-client/web-client';
// import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { DashboardPage } from '../dashboard/dashboard';
import { DataProvider } from '../../providers/data/data';
import { Geolocation } from '@ionic-native/geolocation';
//import { Paytm } from '@ionic-native/paytm';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-member-sendsms',
  templateUrl: 'member-sendsms.html',
})
export class membersendsmsPage {
  geoLatitude: number;
  geoLongitude: number;
  geoAccuracy: number;
  visability: boolean = false;

  metrics: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    public apiClient: WebClientProvider, private plt: Platform,

    public modalCtrl: ModalController, public data: DataProvider, private geolocation: Geolocation,) {
    this.GetLocation_Onlyccords();
  }

  private Mupdate: any = {
    mgroup: '', memberNo: '', address2: '', address3: '', place: '', mobile: '', email: ' ', address1: '',
    phone: '', pincode: '', member_id: '', Name: '', storeId: '', branch: '', agent_id: '', smstype: '',
    latitude: '', longitude: '', nextdate: '',
  };


  ionViewDidLoad() {

  }
  ionViewWillEnter() {
    console.log('ionViewDidLoad membersendsmsPage');
  }


  subscription: any;
  ionViewDidEnter() {
    this.subscription = this.plt.backButton.subscribe(() => {
      console.log('Back press handler!');
      console.log('Show Exit Alert!');
      let Mypages: any = membersendsmsPage;
      this.navCtrl.pop(Mypages);
    });

  }
  ionViewDidLeave() {
    this.subscription.unsubscribe();
  }


  onChange_MNA() {
    this.visability = false
  }

  onChange() {
    this.visability = true
  }

  GetLocation_Onlyccords() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude;
      this.geoAccuracy = resp.coords.accuracy;
    }).catch((error) => {

    });
  }

  GetMembers() {
    console.log(this.Mupdate.mgroup);
    console.log(this.Mupdate.memberNo);
    this.apiClient.GetMDetForUpdate(this.Mupdate.mgroup, this.Mupdate.memberNo).then(result => {
      this.Mupdate = result[0];
      console.log(this.Mupdate);
    });
  }

  sendsms() {
    this.Mupdate.agent_id = this.data.agentID + "";
    this.Mupdate.storeId = this.data.storeID + "";
    this.Mupdate.branch = this.data.loggedInUserObj['branch'];
    try {
      this.GetLocation_Onlyccords();
      this.Mupdate.latitude = this.geoLatitude + "";
      this.Mupdate.longitude = this.geoLongitude + "";
      console.log("logitude :" + this.Mupdate.longitude);
    } catch (e) {
      console.log("err" + this.Mupdate.longitude);
    }
    console.log(this.Mupdate);
    console.log(this.Mupdate.member_id);
    this.apiClient.SendSmsToMember(this.Mupdate).then(result => {
      this.apiClient.dismissLoader();
      console.log(result);
      let alert = this.alertCtrl.create({
        title: 'SMS - Member',
        subTitle: 'SMS Sent',
        buttons: [
          {
            text: 'Ok',
            role: 'ok',
            handler: () => {
              // this.navCtrl.push(DashboardPage);
            }
          }]
      });
      alert.present();
    });
  }
}
