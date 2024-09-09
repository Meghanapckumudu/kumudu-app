import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
//import { PaymentSuccessPage } from '../payment-success/payment-success';
import { WebClientProvider } from '../../providers/web-client/web-client';
import { JoinChitSuccessPage } from '../join-chit-success/join-chit-success';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';
import { DataProvider } from '../../providers/data/data';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
//import moment from 'moment';


/**
 * Generated class for the JoinChitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


var is_validate_msg: string = ""
var is_Email_Valid: Boolean = false
var is_Pan_Valid: Boolean = false
//var termUrl: String = 'http://www.asterixtechnology.com/privacy-policy.html';
var termUrl: String =""
@Component({
  selector: 'page-join-chit',
  templateUrl: 'join-chit.html',
})
export class JoinChitPage {
  geoLatitude: number;
  geoLongitude: number;
  geoAccuracy: number;
  geo_address1: string;
  geo_address2: string;
  geo_address3: string;
  geo_place: string;
  geo_pin: string;
  geoAddress: string;

  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  private isAmtOrGold: any;

  private groupCode: any;
  private scheme: any = {
    name: '', address1: '', address2: '', address3: '', place: '', mobile: '', email: '',
    custAccept: false, gold_scheme: '0', goldconvyn: '0', metal_id: '0', gold_convyn: false,
    min_instal_amt: '0', max_instal_amt: '0', minstl_amt_fixed: '0', min_instal_amt_4validation: '0', max_instal_amt_4validation: '0', panno: ''
  };
  //By Pallavi - Join Chit - Allow Flexi Install Amount (Req By sharath-20.12.2019)
  isAmountReadOnly = true;
  //isAmountReadOnly = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,
    public alertCtrl: AlertController, public apiClient: WebClientProvider, public data: DataProvider, public iab: InAppBrowser,
    private geolocation: Geolocation, private plt: Platform,
    private nativeGeocoder: NativeGeocoder) {

    let url = 'http://www.asterixtechnology.com/privacy-policy.html';
    this.apiClient.Get_terms().then(result => {
      console.log("res : " + result["data"]);
      if (result["data"] != "" || result["data"] != null) {
        let urlNew = url
        urlNew = result["data"] + "";
        console.log("Get_terms -url :" + result["data"]);
        console.log(urlNew)
        termUrl = urlNew
        // const browser = this.iab.create(urlNew, "_self", "hidden=no,location=no");
        // browser.show()
      }
    });
    this.GetLocation_For_GeoCord();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JoinChitPage');
  }
  subscription: any;

  ionViewDidEnter() {
    this.data.setSearchterm("");
    this.data.membsearchterm = "";
    let res: any;
    this.apiClient.showLoader();
    this.groupCode = this.navParams.get('groupCode');
    console.log(this.groupCode);
    this.apiClient.getGroups().then(result => {
      res = result;
      for (let index in res) {
        if (result[index]['code'] + "" === this.groupCode + "") {
          this.scheme = result[index];
          console.log("this.scheme.type :" + this.scheme.type)
          console.log("this.scheme :" + this.scheme)
          console.log(" result[index] :" + result[index])
          if (this.scheme.gold_scheme == 1) {
            this.scheme.gold_convyn = true
            if (this.data.loggedInUserObj['branch'] == 'RHR') {
              this.scheme.metal_id =1
            }
          } else {
            this.scheme.gold_convyn = false
          }
          console.log("gold_convyn :" + this.scheme.gold_convyn)
          console.log("gold_scheme :" + this.scheme.gold_scheme)
          if (this.scheme.AMOUNT == 0 || this.scheme.minstl_amt_fixed == 0) {
            this.isAmountReadOnly = false;
          }
          else if (this.scheme.minstl_amt_fixed == 1) {
            this.isAmountReadOnly = true;
          }
          this.scheme.min_instal_amt_4validation = this.scheme.min_instal_amt
          if (this.scheme.min_instal_amt == 0) {
            this.scheme.min_instal_amt = this.scheme.AMOUNT
          }
          this.scheme.max_instal_amt_4validation = this.scheme.max_instal_amt
          if (this.scheme.max_instal_amt == 0) {
            this.scheme.max_instal_amt = this.scheme.AMOUNT
          }
          if (this.scheme.type == "G") {
            console.log("this.scheme.type :" + this.scheme.type);
            this.isAmtOrGold = "Installment Metal"
            this.scheme.gold_convyn = true
          } else {
            console.log("this.scheme.type :" + this.scheme.type);
            this.isAmtOrGold = "Installment Amount"
          }

          // min_instal_amt
        }
      }

      console.log(this.scheme);
      this.apiClient.dismissLoader();

      console.log('ionViewDidLoad ionViewDidEnter');
      if (this.data.userLoginType == 'customer') {
        this.storage.get('loggedInUserObj').then((val) => {
          this.scheme.name = val['name'];
          this.scheme.address1 = val['address1'];
          if (val['address2']) {
            this.scheme.address2 = val['address2'];
          }
          if (val['address3']) {
            this.scheme.address3 = val['address3'];
          }
          this.scheme.city = val['place'];
          this.scheme.mobile = val['mobile'];
          this.scheme.email = val['email'];
          this.scheme.pincode = val['pincode'];
        });
      }
    });

    this.subscription = this.plt.backButton.subscribe(() => {
      console.log('Back press handler!');
      console.log('Show Exit Alert!');
      let JoinChitPages: any = JoinChitPage;
      this.navCtrl.pop(JoinChitPages);
    });
  }

  ionViewDidLeave() {
    this.subscription.unsubscribe();
  }


  goToChitJoinSuccessPage(result) {
    console.log(result);
    if (result['note'] != "Already Member") {
      this.navCtrl.push(JoinChitSuccessPage, {
        memberCode: result.mgroup + "-" + result.memberNo
      });
    } else {
      let alert = this.alertCtrl.create({
        title: 'Already Member',
        message: 'You are already member of this Scheme, If you want to subscribe again. Call us.',
        buttons: [
          {
            text: 'Ok',
            role: 'ok',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      alert.present();
    }
  }

  GetLocation_Onlyccords() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude;
      this.geoAccuracy = resp.coords.accuracy;
    }).catch((error) => {

    });
  }

  joinChit() {
    this.apiClient.showLoader();
    console.log("Scheme Amt : " + this.scheme.AMOUNT)
    let obj = {
      mgroup: this.scheme.code, member_no: '1', name: this.scheme.name,
      address1: this.scheme.address1, address2: this.scheme.address2
      , address3: this.scheme.address3, place: this.scheme.city,
      phone: this.scheme.phone, mobile: this.scheme.mobile,
      scheme_amount: this.scheme.AMOUNT + "",
      storeID: this.data.storeID, branch: this.data.loggedInUserObj['branch'],
      pincode: this.scheme.pincode, email: this.scheme.email,
      dob: this.scheme.dob, anniversary: this.scheme.anniversary,
      latitude: this.geoLatitude + "", longitude: this.geoLongitude + "", accuracy: this.geoAccuracy,
      metal_id: this.scheme.metal_id, goldconvyn: '0', panno: this.scheme.panno + "",
    };
    if (this.validateJoinChitData()) {
      if (this.scheme.gold_convyn == true) {
        obj.goldconvyn = '1'
      } else {
        obj.goldconvyn = '0'
      }

      try {
        this.GetLocation_Onlyccords();
        obj.latitude = this.geoLatitude + "";
        obj.longitude = this.geoLongitude + "";
      } catch (e) {

      }

      this.apiClient.joinChit(obj).then(result => {

        this.apiClient.dismissLoader();

        this.goToChitJoinSuccessPage(result);
      });
    } else {

      let alert = this.alertCtrl.create({
        title: 'Data Missing',
        message: is_validate_msg,
        //'Name, Address 1 and Mobile(10 Digit), Metal (inCase Metal Conversion) data are required',
        buttons: [
          {
            text: 'Ok',
            role: 'ok',
            handler: () => {
              console.log('Cancel clicked');
              this.apiClient.dismissLoader();
            }
          }
        ]
      });
      alert.present();

    }
  }
  isReadonly() { return true; }

  validateJoinChitData() {
    is_validate_msg = "Kindly Check : ";
    let status = true;
    console.log(this.scheme);
    try {
      if (!this.scheme.code) {
        status = false
        is_validate_msg += " Group Code ";
        console.log("Failed: this.scheme.code")
      } if (!this.scheme.custAccept) {
        status = false
        is_validate_msg += " Accept Terms & Condition ";
        console.log("Failed: this.scheme.custAccept")
      } if (!this.scheme.name) {
        status = false
        is_validate_msg += " Member Name ";
        console.log("Failed: this.scheme.name")
      } if (!this.scheme.address1) {
        is_validate_msg += " Member Address1 ";
        status = false
        console.log("Failed:  this.scheme.address1")
      } if (!this.scheme.mobile) {
        is_validate_msg += " Member Mobile ";
        status = false
        console.log("Failed:  this.scheme.mobile")
      } if (this.scheme.mobile) {
        if (this.scheme.mobile.length != 10) {
          is_validate_msg += " Member Mobile No Should be Min 10 Degit ";
          status = false;
          console.log("Failed:  this.scheme.mobile.length")
        }
      } if (this.scheme.gold_convyn == true) {

        if (this.scheme.metal_id <= "0") {
          is_validate_msg += " Metal Conversion - Metal type ? ";
          status = false;
          console.log("Failed:  Select Metal")
        } else if (this.scheme.metal_id == undefined) {
          is_validate_msg += " Metal Conversion - Metal type ? ";
          status = false;
          console.log("Failed:  Select Metal")
        }
      } if (this.scheme.email == undefined) {
        // status = false;
        // console.log("Failed:  this.scheme.email undefined")
      } if (this.scheme.email != undefined) {
        // is_Email_Valid = false;
        // this.validate_Email().then(result => {
        // });
        // if (is_Email_Valid == false) {
        //   status = false;
        //   console.log("Failed:  this.scheme.email")
        // }
      } if (this.scheme.AMOUNT < this.scheme.min_instal_amt_4validation && this.scheme.min_instal_amt_4validation > 0) {
        status = false;
        is_validate_msg += " scheme Amount should be greater than Or Equal to" + this.scheme.min_instal_amt_4validation;
        console.log("Failed:  scheme Amount should be greater than Or Equal to" + this.scheme.min_instal_amt_4validation)
      } if (this.scheme.AMOUNT > this.scheme.max_instal_amt_4validation && this.scheme.max_instal_amt_4validation > 0) {
        status = false;
        is_validate_msg += " scheme Amount should be less than " + this.scheme.max_instal_amt_4validation
        console.log("Failed:  scheme Amount should be less than " + this.scheme.max_instal_amt_4validation)
      } if ((+this.scheme.AMOUNT * +this.scheme.no_inst) >= 200000) {
        is_Pan_Valid = false;
        this.validate_Pan().then(result => {
        });
        if (is_Pan_Valid == false) {
          status = false;
          is_validate_msg += " Valid Pan No "
          console.log("Failed:  this.scheme.pan")
        }
      }

    } catch (e) {
      console.log(e);
      status = false;
    }
    if (status != false) {
      status = true
    }
    console.log("status---" + status);
    return status;
  }

  validate_Pan() {
    return new Promise((resolve, reject) => {
      is_Pan_Valid = false
      if (this.scheme.panno != undefined) {
        const re = /^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/;
        is_Pan_Valid = re.test(this.scheme.panno);
        console.log("is_Pan_Valid :" + is_Pan_Valid)
        resolve(is_Pan_Valid);
      } else {
        resolve(false);
      }

    });
  }

  validate_Email() {

    return new Promise((resolve, reject) => {
      is_Email_Valid = false
      if (this.scheme.email != undefined) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        is_Email_Valid = re.test(this.scheme.email);
        resolve(is_Email_Valid);
      } else {
        resolve(false);
      }

    });
  }

  openPrivacyPolicyNew() {
    let url = 'http://www.asterixtechnology.com/privacy-policy.html';
    this.apiClient.Get_Privacy_policy().then(result => {

      if (result["data"] != "" || result["data"] != null) {
        let urlNew = url
        urlNew = result["data"] + "";
        const browser = this.iab.create(urlNew, "_blank", "hidden=no,location=no");
        browser.show()
      }
    });
  }

  openTermsNew() {
    let url = 'http://www.asterixtechnology.com/privacy-policy.html';
    this.apiClient.Get_terms().then(result => {
      console.log("res : " + result["data"]);
      if (result["data"] != "" || result["data"] != null) {
        let urlNew = url
        urlNew = result["data"] + "";
        console.log("Get_terms -url :" + result["data"]);
        console.log(urlNew)
        const browser = this.iab.create(urlNew, "_blank", "hidden=no,location=no");
        browser.show()
      }
    });

  }

  GetLocation_For_GeoCord() {

    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude;
      this.geoAccuracy = resp.coords.accuracy;

    }).catch((error) => {
      //alert('Error getting location' + JSON.stringify(error));
    });
  }

  GetLocation() {

    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude;
      this.geoAccuracy = resp.coords.accuracy;
      this.getGeoencoder(this.geoLatitude, this.geoLongitude);
    }).catch((error) => {
      alert('Error getting location' + JSON.stringify(error));
    });
  }

  getGeoencoder(latitude, longitude) {
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderReverseResult[]) => {
        this.generateAddress(result[0]);

      })
      .catch((error: any) => {
        alert('Error getting location' + JSON.stringify(error));
      });
  }

  //Return Comma saperated address
  generateAddress(addressObj) {
    let obj = [];
   // let address = "";
    for (let key in addressObj) {
      obj.push(addressObj[key]);
    }
    obj.reverse();
    this.geo_address1 = (obj[0] + " " + obj[1]).trim()
    this.geo_address2 = (obj[2] + " " + obj[3]).trim()
    this.geo_address3 = (obj[4] + " " + obj[5]).trim()
    this.geo_place = obj[6]
    this.geo_pin = obj[7]
    this.scheme.address1 = this.geo_address1
    this.scheme.address2 = this.geo_address2
    this.scheme.address3 = this.geo_address3
    this.scheme.city = this.geo_place
    this.scheme.pincode = this.geo_pin

    // for (let val in obj) {
    //     console.log('val :' + val)

    //     if (obj[val].length)
    //       address += obj[val] + ', ';
    //     console.log('obj[val] :' + obj[val])
    //   }
  }
  // for (let val in obj) {
  //   console.log('val :' + val)

  //   if (obj[val].length)
  //     address += obj[val] + ', ';
  //   console.log('obj[val] :' + obj[val])
  // }
  // return address.slice(0, -2);
  setFocus(nextElement) {
    nextElement.setFocus();
  }

  GetMemberAddressByMobile() {
    console.log("this.scheme.mobile.length " + this.scheme.mobile.length)
    if (this.scheme.mobile != "" && this.scheme.mobile != undefined && this.scheme.mobile.length >= 10) {
      if (this.scheme.name == "" || this.scheme.name == undefined) {
        this.apiClient.showLoader();
        this.apiClient.GetMemberAddress(this.scheme.mobile).then(result => {
          console.log(result);
          let data = result[0];
          try {
            this.scheme.name = data["name"];
            this.scheme.email = data["email"];
            this.scheme.address1 = data["address1"];
            this.scheme.address2 = data["address2"];
            this.scheme.address3 = data["address3"];
            this.scheme.city = data["place"];
            this.scheme.pincode = data["pin"];
            //let dobdt = (data["dob"].toISOString(true));
            console.log("data[dob]" + data["dob"]);
            if (data["dob"] == "1900-01-01" || data["dob"] == "01-01-1900" || data["dob"] == "Jan 1, 1900") {
            } else {
              let myDate: string = new Date(data["dob"] + " 13:01:00").toISOString();
              // let dob : DateTime = new Date(data["dob"]).getDate;
              // startchallenge: string = dob.yearValues() + '-' + dob.monthValues() + '-' + dob.dayValues();

              // console.log("startchallenge" + startchallenge);
              console.log("myDate" + myDate);
              this.scheme.dob = myDate;
            }
            console.log("myDate" + data["annvdate"]);
            if (data["annvdate"] == "1900-01-01" || data["annvdate"] == "01-01-1900" || data["annvdate"] == "Jan 1, 1900") {
            } else {
              let myDate: String = new Date(data["annvdate"] + " 13:01:00").toISOString();
              this.scheme.anniversary = myDate;
            }
          } catch (error) {

          }

          this.apiClient.dismissLoader();
        });
      }
    }
  }

  dtchng() {
    console.log("scheme.dob" + this.scheme.dob);
  }

}
