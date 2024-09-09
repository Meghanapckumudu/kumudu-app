import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { WebClientProvider } from '../../providers/web-client/web-client';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { DataProvider } from '../../providers/data/data';
//import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
/**
 * Generated class for the HowtouseappPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-howtouseapp',
  templateUrl: 'howtouseapp.html',
})
export class HowtouseappPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private plt: Platform,
    public apiClient: WebClientProvider, public youtube: YoutubeVideoPlayer,
    public data: DataProvider) {



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HowtouseappPage');
  }

  subscription: any;
  ionViewDidEnter() {
    this.subscription = this.plt.backButton.subscribe(() => {
      console.log('Back press handler!');
      console.log('Show Exit Alert!');
      let Mypages: any = HowtouseappPage;
      this.navCtrl.pop(Mypages);
    });

  }
  ionViewDidLeave() {
    this.subscription.unsubscribe();
  }


  watch() {
    this.youtube.openVideo("TcovfE8IsHs")
  }
  watchyoutubeHelp() {
    console.log("Inside Function")
    this.apiClient.get_getytubehelppath().then(result => {
      let urlNew = "";
      console.log("Data:" + (result["data"]))
      if (result["data"] != "" || result["data"] != null) {
        urlNew = result["data"] + "";
        if (urlNew.length > 0) {
          this.youtube.openVideo(urlNew)
        }
      }
    });
  }
}
