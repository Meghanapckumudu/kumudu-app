import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
/**
 * Generated class for the GroupsdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-groupsdetails',
  templateUrl: 'groupsdetails.html',
})
export class GroupsdetailsPage {
  private groupCode: any;
  slide1: String;
  slide2: String;
  slide3: String;

  // slide4 = "https://kumuduapps.in:8443/logo/" + this.data.storeID + "/groups/" + this.groupCode + "/image4.jpg"
  // slide5 = "https://kumuduapps.in:8443/logo/" + this.data.storeID + "/groups/" + this.groupCode + "/image5.jpg"

  constructor(public navCtrl: NavController, private plt: Platform,
    public navParams: NavParams, public data: DataProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupsdetailsPage');
  }

  subscription: any;

  ionViewDidEnter() {
    this.groupCode = this.navParams.get('groupCode');
    console.log(this.groupCode);
    this.slide1 = "https://kumuduapps.in:8443/logo/" + this.data.storeID + "/groups/" + this.groupCode + "/image1.jpg"
    this.slide2 = "https://kumuduapps.in:8443/logo/" + this.data.storeID + "/groups/" + this.groupCode + "/image2.jpg"
    this.slide3 = "https://kumuduapps.in:8443/logo/" + this.data.storeID + "/groups/" + this.groupCode + "/image3.jpg"

    this.subscription = this.plt.backButton.subscribe(() => {
      console.log('Back press handler!');
      console.log('Show Exit Alert!');
      let Mypages: any = GroupsdetailsPage;
      this.navCtrl.pop(Mypages);
    });
  }

  ionViewDidLeave() {
    this.subscription.unsubscribe();
  }

}
