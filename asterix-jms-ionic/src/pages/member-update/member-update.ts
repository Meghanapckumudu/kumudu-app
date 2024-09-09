import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, Platform } from 'ionic-angular';
import { WebClientProvider } from '../../providers/web-client/web-client';
// import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { DashboardPage } from '../dashboard/dashboard';

import { DataProvider } from '../../providers/data/data';
//import { Paytm } from '@ionic-native/paytm';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-member-update',
  templateUrl: 'member-update.html',
})
export class memberupdatePage {
  metrics: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    public apiClient: WebClientProvider,
    private plt: Platform,
    public modalCtrl: ModalController, public data: DataProvider) {
  }

  private Mupdate: any = {
    mgroup: '', memberNo: '', address2: '', address3: '', place: '', mobile: '', email: ' ', address1: '',
    phone: '', pincode: '', member_id: '', name: '', storeId: '', branch: '', agent_id: ''
  };


  ionViewDidLoad() {

  }

  subscription: any;
  ionViewDidEnter() {
    this.subscription = this.plt.backButton.subscribe(() => {
      console.log('Back press handler!');
      console.log('Show Exit Alert!');
      let Mypages: any = memberupdatePage;
      this.navCtrl.pop(Mypages);
    });

  }
  ionViewDidLeave() {
    this.subscription.unsubscribe();
  }
  ionViewWillEnter() {
    console.log('ionViewDidLoad memberupdatePage');
  }


  GetMembers() {
    console.log(this.Mupdate.mgroup);
    console.log(this.Mupdate.memberNo);
    this.apiClient.GetMDetForUpdate(this.Mupdate.mgroup, this.Mupdate.memberNo).then(result => {
      this.Mupdate = result[0];
      console.log(this.Mupdate);
    });
  }

  updateMembers() {
    this.Mupdate.agent_id = this.data.agentID + "";
    this.Mupdate.storeId = this.data.storeID + "";
    this.Mupdate.branch = this.data.loggedInUserObj['branch'];

    console.log(this.Mupdate);
    console.log(this.Mupdate.member_id);
    this.apiClient.Update_MDetails(this.Mupdate).then(result => {
      this.apiClient.dismissLoader();
      console.log(result);
      let alert = this.alertCtrl.create({
        title: 'Member Update',
        subTitle: 'Member Updated',
        buttons: [
          {
            text: 'Ok',
            role: 'ok',
            handler: () => {
              this.navCtrl.push(DashboardPage);
            }
          }]
      });
      alert.present();
    });
  }
}
