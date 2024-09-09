import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
//import { WebClientProvider } from '../../providers/web-client/web-client';


/**
 * Generated class for the OffersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-offers',
  templateUrl: 'offers.html',
})
export class OffersPage {
  offers = "https://kumuduapps.in:8443/logo/" + this.data.storeID + "/offers/offers.jpg"

  constructor(public navCtrl: NavController, public navParams: NavParams, public data: DataProvider, ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OffersPage');
  }

}
