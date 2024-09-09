import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SearchPage } from '../search/search';
import { CollectionReportPage } from '../collection-report/collection-report';
import { SettingsPage } from '../settings/settings';
import { DashboardPage } from '../dashboard/dashboard';
import { MyProfilePage } from '../my-profile/my-profile';
import { MessagesPage } from '../messages/messages';
import { JoinChitPage } from '../join-chit/join-chit';
import { ChitListPage } from '../chit-list/chit-list';
import { WebClientProvider } from '../../providers/web-client/web-client';
import { DataProvider } from '../../providers/data/data';
import { UserLedgerPage } from '../user-ledger/user-ledger';
import { CustomerSearchPage } from '../customer-search/customer-search';
import { JmshomePage } from '../jmshome/jmshome';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  myIndex: number;
  homeRoot: any =JmshomePage; // DashboardPage;
  searchRoot: any = SearchPage;
  reportsRoot: any = MyProfilePage;
  settingsRoot: any = SettingsPage;
  messagesRoot: any = MessagesPage;
  joinChitRoot: any = ChitListPage;
  userLedgerRoot: any = UserLedgerPage;
  customerSearchRoot:any= CustomerSearchPage;
  loginType = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public data: DataProvider) {
    this.myIndex = navParams.data.tabIndex || 0;
    console.log("MyIndex : " + this.myIndex  )
    console.log(data.userLoginType);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
