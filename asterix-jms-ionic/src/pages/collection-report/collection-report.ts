import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, Platform } from 'ionic-angular';
//import { CustomerProfilePage } from '../customer-profile/customer-profile';
//import { MyProfilePage } from '../my-profile/my-profile';
//import { SchemeDetailPage } from '../scheme-detail/scheme-detail';
import { SchemePayPage } from '../scheme-pay/scheme-pay';
//import { PaymentSuccessPage } from '../payment-success/payment-success';
import { WebClientProvider } from '../../providers/web-client/web-client';
import { PrinterListPage } from '../printer-list/printer-list';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the CollectionReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-collection-report',
  templateUrl: 'collection-report.html',
})
export class CollectionReportPage {
  ledger: any;
  amountCollected: any = 0;
  startDate: any;
  endDate: any;
  constructor(public navCtrl: NavController, private alertCtrl: AlertController
    , public navParams: NavParams, public apiClient: WebClientProvider, private plt: Platform,
    public data: DataProvider,
    public modalCtrl: ModalController) {
    this.apiClient.showLoader();
    this.startDate = navParams.get('s');
    this.endDate = navParams.get('e');
    this.apiClient.getMyLedger({
      "startDate": this.startDate, "endDate": this.endDate,
      "agentID": this.data.agentID + "",
      "storeID": this.data.storeID
    })
      .then(result => {
        this.ledger = result;
        for (let index in this.ledger) {
          this.amountCollected = this.amountCollected + result[index]['amount_collected'];
        } this.apiClient.dismissLoader();
      });

  }

  subscription: any;
  ionViewDidLoad() {
    console.log('ionViewDidLoad CollectionReportPage');

    this.subscription = this.plt.backButton.subscribe(() => {
      console.log('Back press handler!');
      console.log('Show Exit Alert!');
      let Mypages: any = CollectionReportPage;
      this.navCtrl.pop(Mypages);
    });

  }


  ionViewDidLeave() {
    this.subscription.unsubscribe();
  }

  goTo6() {
    this.navCtrl.push(SchemePayPage);
  }
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Print',
      message: 'printing slip in ZJ-5805 printer, please switch it on',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Print',
          handler: () => {
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }
 
  print(obj) {
    console.log(obj);
    // this.data.printMessage = this.data.paymentSuccessReportPrintMsg(obj);
    let profileModal = this.modalCtrl.create(PrinterListPage);
    profileModal.present();
  }
}
