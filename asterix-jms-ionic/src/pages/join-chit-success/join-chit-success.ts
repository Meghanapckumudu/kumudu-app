import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { SchemeDetailPage } from '../scheme-detail/scheme-detail';

/**
 * Generated class for the JoinChitSuccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-join-chit-success',
  templateUrl: 'join-chit-success.html',
})
export class JoinChitSuccessPage {
  memberCode: any;
  constructor(public navCtrl: NavController, private plt: Platform,
    public navParams: NavParams) {
    this.memberCode = navParams.get('memberCode');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JoinChitSuccessPage');
  }

  subscription: any;
  ionViewDidEnter() {
    this.subscription = this.plt.backButton.subscribe(() => {
      console.log('Back press handler!');
      console.log('Show Exit Alert!');
      let Mypages: any = JoinChitSuccessPage;
      this.navCtrl.pop(Mypages);
    });
  }

  ionViewDidLeave() {
    this.subscription.unsubscribe();
  }

  goToSchemeDetailPage() {
    this.navCtrl.push(SchemeDetailPage, {
      memberCode: this.memberCode
    });
  }

}
