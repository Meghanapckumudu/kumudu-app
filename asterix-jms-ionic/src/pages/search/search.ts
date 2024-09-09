import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SchemeDetailPage } from '../scheme-detail/scheme-detail';
import { WebClientProvider } from '../../providers/web-client/web-client';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  schemes: any;
  searchTerm: String = "";
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public apiClient: WebClientProvider, public data: DataProvider) {
    console.log("constructor");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad");
  }
  ionViewDidEnter() {
    this.searchTerm = this.data.getSearchTerM();
    console.log('ionViewDidLoad SearchPage');
    if (this.data.getUserLoginType() == 'customer') {
      this.searchTerm = this.data.getUser()['mobile'];
      this.
        onSearch();
    }
    else {
      console.log("this.data.membsearchterm" + this.data.getSearchTerM());
      this.searchTerm = this.data.getSearchTerM();
      if (this.data.environment == 'dev') {
        console.log("this.searchTerm :"+ this.searchTerm)
        //this.searchTerm = this.data.membsearchterm;
        //this.searchTerm = 'A-26';
        this.onSearch();
        // if (this.searchTerm != "" && this.searchTerm != undefined && this.searchTerm.length > 0) {
        //   this.onSearch();
        // }

      }

    }
  }
  ionViewDidLeave() {
    // console.log("PageLeave");
    // this.data.membsearchterm = "";
  }



  goToSchemeDetailPage(memberCode) {
    this.navCtrl.push(SchemeDetailPage, {
      memberCode: memberCode
    });
  }
  searchByKeyword(e) {
    console.log("pallavi")
    console.log(this.searchTerm)
    this.
      onSearch();
  }
  onSearch() {
    console.log(this.searchTerm)

    this.apiClient.showLoader();
    this.apiClient.schemeDetail(this.searchTerm).then(result => {
      this.schemes = result;
      this.data.setSearchterm(this.searchTerm);
      this.apiClient.dismissLoader();
    });
  }
}
