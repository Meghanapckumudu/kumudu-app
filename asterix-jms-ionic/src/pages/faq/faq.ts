import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { WebClientProvider } from '../../providers/web-client/web-client';

/**
 * Generated class for the FaqPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {
  index = 0;
  clicked: any;
  public hidden: boolean[] = [];
  faq: any;
  isCardCollapse = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public data: DataProvider, private plt: Platform,
    public apiClient: WebClientProvider) {
    console.log("Constructor")
    this.faq = [];
    this.apiClient.showLoader();
    this.apiClient.getfaq().then(result => {
      this.faq = result;
      console.log(" this.faq :" + this.faq)
      this.apiClient.dismissLoader();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FaqPage');
  }
  subscription: any;
  ionViewDidEnter() {
    this.subscription = this.plt.backButton.subscribe(() => {
      console.log('Back press handler!');
      console.log('Show Exit Alert!');
      let Mypages: any = FaqPage;
      this.navCtrl.pop(Mypages);
    });
  }

  ionViewDidLeave() {
    this.subscription.unsubscribe();
  }

  toggleSection(i: number) {
    this.hidden[i] = !this.hidden[i];
  }
}
