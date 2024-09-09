import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { WebClientProvider } from '../../providers/web-client/web-client';

/**
 * Generated class for the CustomerSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-search',
  templateUrl: 'customer-search.html',
})
export class CustomerSearchPage {
  ledger: any = [];
  searchTerm = "";
  constructor(public navCtrl: NavController, public data: DataProvider,
    public navParams: NavParams, public apiClient: WebClientProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerSearchPage');
  }
  subscription: any;

  ionViewWillEnter() {
    this.data.setSearchterm("");
    this.data.membsearchterm = "";
    console.log('ionViewWillEnter ChitListPage');
    

  }

  ionViewDidEnter(){
    // this.subscription = this.plt.backButton.subscribe(() => {
    //   console.log('Back press handler!');
    //   console.log('Show Exit Alert!');
    //   let Mypages: any = CustomerSearchPage;
    //   this.navCtrl.pop(Mypages);
    // });
  }

  ionViewDidLeave() {
    //this.subscription.unsubscribe();
  }

  searchByKeyword(e) {
    this.
      onSearch();
  }
  onSearch() {

    this.apiClient.showLoader();
    this.apiClient.userLedger(this.searchTerm, '').then(result => {
      this.ledger = result; this.apiClient.dismissLoader();
    });
  }
}
