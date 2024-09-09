import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { PaymentSuccessPage } from '../payment-success/payment-success';

/**
 * Generated class for the SchemePayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scheme-pay',
  templateUrl: 'scheme-pay.html',
})
export class SchemePayPage {

  constructor(public navCtrl: NavController,
    private plt: Platform,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchemePayPage');
  }
  subscription: any;
  ionViewDidEnter() {
    console.log('ionViewDidLoad SchemePayPage');
    this.subscription = this.plt.backButton.subscribe(() => {
      console.log('Back press handler!');
      console.log('Show Exit Alert!');
      let Mypages: any = SchemePayPage;
      this.navCtrl.pop(Mypages);
    });
  }

  ionViewDidLeave() {
    this.subscription.unsubscribe();
  }

  goToPaymentSuccessPage() {
    this.navCtrl.push(PaymentSuccessPage);

  }
}
