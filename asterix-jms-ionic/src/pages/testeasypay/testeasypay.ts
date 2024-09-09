import { DataProvider } from '../../providers/data/data';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { WebClientProvider } from '../../providers/web-client/web-client';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import 'rxjs/add/operator/map'
import { convertDataToISO } from 'ionic-angular/umd/util/datetime-util';

/**
 * Generated class for the TesteasypayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-testeasypay',
  templateUrl: 'testeasypay.html',
})
export class TesteasypayPage {
  private epay: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController
    , public data: DataProvider, public modalCtrl: ModalController,
    public apiClient: WebClientProvider, public iab: InAppBrowser, public http: HttpClient,) {
    this.epay = {};
    this.epay.epay_ver = "1.0";
    this.epay.epay_chsmkey = "axis";
    this.epay.epay_cyn = "INR";
    this.epay.epay_type = "TEST";
    this.epay.epay_cid = "6249";
    this.epay.epay_rid = "11";
    this.epay.epay_crn = "11";
    this.epay.email = "pallavi@gmail.com";
    this.epay.contact = "9731552442";
    this.epay.order_id = "123";
    this.epay.name = "pallavi";
    this.epay.key_id = "1";
    this.epay.description = "test";
    this.epay.epay_amt = "1.0";
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad TesteasypayPage');
  }

  easypay() {

    let pg_obj = {
      epay_cid: this.epay.epay_cid + "",
      epay_rid: this.epay.epay_rid + "",
      epay_crn: this.epay.epay_crn + "",
      epay_amt: this.epay.epay_amt + "",
      epay_ver: "1.0",
      epay_chsmkey: "axis",
      epay_type: "TEST",
      epay_cyn: "INR",
      key_id: this.epay.key_id + "",
      order_id: this.epay.order_id + "",
      name: this.epay.name + "",
      description: this.epay.description + "",
      email: this.epay.email + "",
      contact: this.epay.contact + "",
      transaction_id: this.epay.transaction_id + ""
    };
    console.log(pg_obj);

    var getEpayEncrypt;
    this.apiClient.getEpayEncrypt(pg_obj).then(result => {
      console.log("calling Function");
      getEpayEncrypt = result;
      console.log("getEpayEncrypt : " + result);
      console.log("getEpayEncrypt : " + getEpayEncrypt);


      var pageContent = ""
      var encryptdatatopass = getEpayEncrypt;// "1qXjUu/q9OSiUTCTTH2i3V6blJal1lUYu/4tzwl+bBGjLvWceckkQpSfqs4uhLrrWiFjkulKxpgANing+ZWB1TGPIgpgqto6ucfNz5gYvJx6yNJ6Zwzzyf5nYd5ySR38BTJcN3/dCgcqcNbHEbrjg+WFmQbaMj8TSW8pkuHIj7fweVUgrGt/fSe+OiWIYbFFWcZ72B7yQVBs8smj9Avl8lWhyYKuDFHEzL+cafQHvqHBDPH4NL6MIoHY6ke7zeI70PhDhQsPIS1tBz/YY9UoiztKLhXqK1u2VYpYdQ0AkhyxvknSabp+HfRCVmdtqnP3SRU7W5Vzt0pEGAtldp64xyDXz5KrDK+3iCgFYNH2f3YU20NHJV1hEcVuKlqdBuvGBFRNo1E/M8Ob88RbNZQaWQ==";

      var payurl = "https://kumuduapps.in:8443/AxisEasyPayReDirect.jsp" // "https://uat-etendering.axisbank.co.in/easypay2.0/frontend/index.php/api/payment"
      console.log("INSIDE EasyPay")
      pageContent = "<form id = 'MyForm' method=\"POST\" action=\"" + payurl + "\">" +
        "<input type=\"hidden\" name=\"i\" value=\"" + encryptdatatopass + "\"> " +
        //"<input type=\"hidden\" name=\"callback_url\" value=\"" + this.data.razorpay_callbackurl + "\">" +
        "<button>Submit</button> </form> " +
        " <script type=\"text/javascript\">document.getElementById(\"MyForm\").submit();</script> ";

      var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);
      let theOtherUrl = "\'" + this.data.razorpay_callbackurl + "\'" // "http://wat.randr-it-solutions.com/test.php"
      let browserRef: any = [];
      browserRef = this.iab.create(
        pageContentUrl,
        "_self",
        "hidden=no,location=no"
      )

      browserRef.on('loadstart').subscribe((event) => {
        console.log(event.url);
        if (event.url.includes("paysuccess.jsp")) {
          console.log("paysuccess :" + event.url)
          let Myurl = event.url
          var regex = /[?&]([^=#]+)=([^&#]*)/g,
            url = Myurl,
            params: any = [],
            match;
          while (match = regex.exec(url)) {
            params[match[1]] = match[2];
          }
          console.log(params);
          console.log("axis_response:" + params.axis_response);
          var axis_response =  params.axis_response;
          if (axis_response != null || axis_response != "" || axis_response != undefined) {
            let pg_robj = {
              epay_resp:  axis_response + ""
            }
            this.apiClient.getEpayDecrypt(pg_robj).then(result => {
              console.log("Result :" + result)
              let res: any;
              res = result;
              let names = res.split("&");
              let BRN = names[0].replace("BRN=", "");
              let STC = names[1].replace("STC=", "");
              let RMK = names[2].replace("RMK=", "");
              let TRN = names[3].replace("TRN=", "");
              let TET = names[4].replace("TET=", "");
              let PMD = names[5].replace("PMD=", "");
              let RID = names[6].replace("RID=", "");
              let CID = names[7].replace("CID=", "");
              let CRN = names[8].replace("CRN=", "");
              let CNY = names[9].replace("CNY=", "");
              let AMT= names[10].replace("AMT=", "");
              let CKS = names[11].replace("CKS=", "");
              console.log("RMK :" + RMK)
              console.log("BRN :" + BRN)
              console.log("STC :" + STC)
              if (RMK == "success") {
                let alert = this.alertCtrl.create({
                  title: 'Payment Success',
                  message: 'Payment Success..',
                  buttons: [{
                    text: 'Ok',
                    role: 'ok',
                    handler: () => {
                      console.log('Cancel clicked'); this.apiClient.dismissLoader();
                    }
                  }]
                });
                alert.present();
              
              } else {
                let alert = this.alertCtrl.create({
                  title: 'Payment Failed',
                  message: 'Payment Failed..',
                  buttons: [{
                    text: 'Ok',
                    role: 'ok',
                    handler: () => {
                      console.log('Cancel clicked'); this.apiClient.dismissLoader();
                    }
                  }]
                });
                alert.present();
              }
            });
          } else {
            let alert = this.alertCtrl.create({
              title: 'Payment Failed',
              message: 'Payment Failed..',
              buttons: [{
                text: 'Ok',
                role: 'ok',
                handler: () => {
                  console.log('Cancel clicked'); this.apiClient.dismissLoader();
                }
              }]
            });
            alert.present();
          }
          browserRef.close();
        }
      });


      browserRef.on('loadstop').subscribe((event) => {
        console.log(event.url);
        //Check Wether Payment is Authorized!!
        if (event.url.includes("authorized")) {
          console.log("authorized")
        }

        if (event.url.includes("status=failed")) {
          console.log("failed")
          browserRef.close();
        }

        // Checking Wether current Loaded Url Is CallBack URL
        if (event.url == theOtherUrl) {
          console.log("Match");

        }
      });
    });
  }


  easypay1() {
    let pg_obj = {
      epay_cid: "2835",
      epay_rid: this.epay.epay_rid + "",
      epay_crn: this.epay.epay_crn + "",
      epay_amt: this.epay.epay_amt + "",
      epay_ver: "1.0",
      epay_chsmkey: "axis",
      epay_type: "TEST",
      epay_cyn: "INR",
      key_id: this.epay.key_id + "",
      order_id: this.epay.order_id + "",
      name: this.epay.name + "",
      description: this.epay.description + "",
      email: this.epay.email + "",
      contact: this.epay.contact + "",
      transaction_id: this.epay.transaction_id + ""
    };
    console.log(pg_obj);

    var getEpayEncrypt;

    var pageContent = ""
    var encryptdatatopass = ""
    this.apiClient.getEpayEncrypt_new(pg_obj).then(result => {
      console.log("calling Function");
      getEpayEncrypt = result;
      console.log("getEpayEncrypt : " + result);
      console.log("getEpayEncrypt : " + getEpayEncrypt);

      encryptdatatopass = getEpayEncrypt + "";
      //"2Xz4q2QUhPOEgItN3d8mR2K8sggqZvnQDnALPza+30k3KED1WwZ3NiUg3mT2F0D3WiFjkulKxpgANing+ZWB1UTrTxFDrlIKxFj32M+QN4GcLptG/bEhiwfPSj6c3Ia9199ql8yTls6PwAf0fGW7zt2efqy6Q2jDlGfGrdhz8N87Si4V6itbtlWKWHUNAJIcgnhHXZf+WYRnA2Ko0dJjEZg5O/WHQTNEuMKxyhuTy3Yt8o2DTn9sYKniy8c+mAcolLTvYQjOxWGzQzlLOdRORuQUJBsogWaj2zwbmprC9PU="
      // "1qXjUu/q9OSiUTCTTH2i3V6blJal1lUYu/4tzwl+bBGjLvWceckkQpSfqs4uhLrrWiFjkulKxpgANing+ZWB1Ylajs+PYhZcO/EkTE/JdPHKvCtCYMyC9X+I6f4e2UtfBTJcN3/dCgcqcNbHEbrjg+WFmQbaMj8TSW8pkuHIj7fweVUgrGt/fSe+OiWIYbFFWcZ72B7yQVBs8smj9Avl8lWhyYKuDFHEzL+cafQHvqHBDPH4NL6MIoHY6ke7zeI70PhDhQsPIS1tBz/YY9UoiztKLhXqK1u2VYpYdQ0AkhyxvknSabp+HfRCVmdtqnP3SRU7W5Vzt0pEGAtldp64xyDXz5KrDK+3iCgFYNH2f3YU20NHJV1hEcVuKlqdBuvGBFRNo1E/M8Ob88RbNZQaWQ==";

      var payurl = "https://uat-etendering.axisbank.co.in/easypay2.0/frontend/index.php/api/payment"
      console.log("INSIDE EasyPay")
      pageContent = "<form id = 'MyForm' method=\"POST\" action=\"" + payurl + "\">" +
        "<input type=\"hidden\" name=\"i\" value=\"" + encryptdatatopass + "\"> " +
        //"<input type=\"hidden\" name=\"callback_url\" value=\"" + this.data.razorpay_callbackurl + "\">" +
        "<button>Submit</button> </form> " +
        " <script type=\"text/javascript\">document.getElementById(\"MyForm\").submit();</script> ";

      var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);
      let theOtherUrl = "\'" + this.data.razorpay_callbackurl + "\'" // "http://wat.randr-it-solutions.com/test.php"
      let browserRef: any = [];
      browserRef = this.iab.create(
        pageContentUrl,
        "_self",
        "hidden=no,location=no"
      )

      browserRef.on('loadstart').subscribe((event) => {
        console.log(event.url);
        if (event.url.includes("paysuccess.jsp")) {
          console.log("paysuccess :" + event.url)
          let Myurl = event.url
          var regex = /[?&]([^=#]+)=([^&#]*)/g,
            url = Myurl,
            params: any = [],
            match;
          while (match = regex.exec(url)) {
            params[match[1]] = match[2];
          }
          console.log(params);
          console.log(params.razorpay_order_id);
          console.log(params.razorpay_signature);
          console.log(params.razorpay_payment_id);

          browserRef.close();
        }
      });


      browserRef.on('loadstop').subscribe((event) => {
        console.log(event.url);
        //Check Wether Payment is Authorized!!
        if (event.url.includes("authorized")) {
          console.log("authorized")
        }

        if (event.url.includes("status=failed")) {
          console.log("failed")
          browserRef.close();
        }

        // Checking Wether current Loaded Url Is CallBack URL
        if (event.url == theOtherUrl) {
          console.log("Match");

        }
      });
    });
  }


  easypay2() {
    var pageContent = ""
    var encryptdatatopass = "1qXjUu/q9OSiUTCTTH2i3V6blJal1lUYu/4tzwl+bBGjLvWceckkQpSfqs4uhLrrWiFjkulKxpgANing+ZWB1TGPIgpgqto6ucfNz5gYvJx6yNJ6Zwzzyf5nYd5ySR38BTJcN3/dCgcqcNbHEbrjg+WFmQbaMj8TSW8pkuHIj7fweVUgrGt/fSe+OiWIYbFFWcZ72B7yQVBs8smj9Avl8lWhyYKuDFHEzL+cafQHvqHBDPH4NL6MIoHY6ke7zeI70PhDhQsPIS1tBz/YY9UoiztKLhXqK1u2VYpYdQ0AkhyxvknSabp+HfRCVmdtqnP3SRU7W5Vzt0pEGAtldp64xyDXz5KrDK+3iCgFYNH2f3YU20NHJV1hEcVuKlqdBuvGBFRNo1E/M8Ob88RbNZQaWQ==";

    var payurl = "https://uat-etendering.axisbank.co.in/easypay2.0/frontend/index.php/api/payment"
    console.log("INSIDE EasyPay")
    pageContent = "<form id = 'MyForm' method=\"POST\" action=\"" + payurl + "\">" +
      "<input type=\"hidden\" name=\"i\" value=\"" + encryptdatatopass + "\"> " +
      //"<input type=\"hidden\" name=\"callback_url\" value=\"" + this.data.razorpay_callbackurl + "\">" +
      "<button>Submit</button> </form> " +
      " <script type=\"text/javascript\">document.getElementById(\"MyForm\").submit();</script> ";

    var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);
    let theOtherUrl = "\'" + this.data.razorpay_callbackurl + "\'" // "http://wat.randr-it-solutions.com/test.php"
    let browserRef: any = [];
    browserRef = this.iab.create(
      pageContentUrl,
      "_self",
      "hidden=no,location=no"
    )

    browserRef.on('loadstart').subscribe((event) => {
      console.log(event.url);
      if (event.url.includes("paysuccess.jsp")) {
        console.log("paysuccess :" + event.url)
        let Myurl = event.url
        var regex = /[?&]([^=#]+)=([^&#]*)/g,
          url = Myurl,
          params: any = [],
          match;
        while (match = regex.exec(url)) {
          params[match[1]] = match[2];
        }
        console.log(params);
        console.log(params.razorpay_order_id);
        console.log(params.razorpay_signature);
        console.log(params.razorpay_payment_id);

        browserRef.close();
      }
    });


    browserRef.on('loadstop').subscribe((event) => {
      console.log(event.url);
      //Check Wether Payment is Authorized!!
      if (event.url.includes("authorized")) {
        console.log("authorized")
      }

      if (event.url.includes("status=failed")) {
        console.log("failed")
        browserRef.close();
      }

      // Checking Wether current Loaded Url Is CallBack URL
      if (event.url == theOtherUrl) {
        console.log("Match");

      }
    });

  }

}
