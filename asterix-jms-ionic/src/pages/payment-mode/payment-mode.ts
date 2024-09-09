import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { SchemePayPage } from '../scheme-pay/scheme-pay';
import { PaymentSuccessPage } from '../payment-success/payment-success';

/**
 * Generated class for the PaymentModePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-mode',
  templateUrl: 'payment-mode.html',
})
export class PaymentModePage {
 // private scheme: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  //  this.scheme = {
  //     name: "s1", "group": "g1", "title": "Shiva Ganesh", "pincode": "517501", "city": "Tirupati", "rate": 1000, "instalement": "20", "memberCode": "MEM123",
  //     "amount": 2000, weight: "20gm", "initial": "mr",
  //     "add1": "7-2-53", "add2": "R.E.Mada Street", "add3": "Besides Hayagreeva Apts",
  //     "phone": "08772227001", "mobile": "8886665590", "email": "shiva@astx.com", "dob": "1988-04-15",
  //     "anniversary": "2013-10-06"
  //   };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentModePage');
  }
  goToPaymentPage() {
    this.navCtrl.push(PaymentSuccessPage);
  }
}
