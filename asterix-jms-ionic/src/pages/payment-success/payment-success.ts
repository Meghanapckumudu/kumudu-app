import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ModalController, Platform, Navbar } from 'ionic-angular';
import { PrinterListPage } from '../printer-list/printer-list';
import { DataProvider } from '../../providers/data/data';
import { SearchPage } from '../search/search';
//import { DashboardPage } from '../dashboard/dashboard';
import { MenuPage } from '../menu/menu';

@IonicPage()
@Component({
  selector: 'page-payment-success',
  templateUrl: 'payment-success.html',
})
export class PaymentSuccessPage {
  @ViewChild('navbar') navBar: Navbar;
 
  //private tabIndex: number = 0;
  voucherNo: any = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform,
    public app: App,
    public modalCtrl: ModalController, public data: DataProvider) {
    this.voucherNo = navParams.get('voucherNo');
    this.platform.registerBackButtonAction(() => this.backButtonClick, 2)
  }

  backButtonClick() {
    console.log('// dos omething');
    this.navCtrl.push(SearchPage);
  }

  ionViewDidEnter() {
    this.navBar.backButtonClick = this.backButtonClick;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentSuccessPage');
    if (this.data.userLoginType == 'agent') {
      this.print();
    }
  }
  backToHome() {
    /*this.navCtrl.parent.select(this.tabIndex);
    this.navCtrl.popToRoot()*/
    //this.navCtrl.push(DashboardPage);
    this.navCtrl.push(MenuPage)
  }
  print() {
    let profileModal = this.modalCtrl.create(PrinterListPage);
    profileModal.present();
  }
}
