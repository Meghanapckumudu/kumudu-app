import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { CollectionReportPage } from '../collection-report/collection-report';
import { CollectionSummaryPage } from '../collection-summary/collection-summary';

/**
 * Generated class for the MyProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {
  startDate: String = "";
  endDate: String = "";
  constructor(public navCtrl: NavController,  public data: DataProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    let dateD = new Date();
    this.startDate = dateD.toISOString();
    dateD.setDate(dateD.getDate() + 1);
    this.endDate = dateD.toISOString();
    console.log('ionViewDidLoad MyProfilePage');
  }
  ionViewDidEnter() {
    this.data.setSearchterm("");
    this.data.membsearchterm = "";
  }
  goToCollectionDetail() {
    this.navCtrl.push(CollectionReportPage, { "s": this.startDate, "e": this.endDate });
  }
  goToCollectionSummaryPage() {
    this.navCtrl.push(CollectionSummaryPage, { "s": this.startDate, "e": this.endDate });
  }
}
