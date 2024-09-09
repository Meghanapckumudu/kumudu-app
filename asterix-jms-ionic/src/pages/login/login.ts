import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, QueryList, Input, ViewChild } from '@angular/core';
import { IonicPage, NavParams, AlertController, App, ModalController } from 'ionic-angular';
import { MenuPage } from '../menu/menu';
import { WebClientProvider } from '../../providers/web-client/web-client';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';
import { DataProvider } from '../../providers/data/data';
import { ReturnpolicyPage } from '../returnpolicy/returnpolicy';
import { TermsPage } from '../terms/terms';
import { PrivacyPage } from '../privacy/privacy';
import { ContactPage } from '../contact/contact';
//import { BrowserTab } from '@ionic-native/browser-tab/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { stringify } from '@angular/core/src/util';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs-compat';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Device } from '@ionic-native/device';
import { Location } from '@angular/common';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';;
declare var SMSReceive: any;

// import { SmsRetriever } from '@ionic-native/sms-retriever/ngx';

//var smsRetriever = window['cordova']['plugins']['smsRetriever'];

var is_Email_Valid: Boolean = false
@IonicPage()
@Component({
  selector: 'page-login', //'page-login-blue',
  templateUrl: 'login.html',
})
export class LoginPage {
  geoLatitude: number = 0;
  geoLongitude: number = 0;
  geoAccuracy: number;
  geo_address1: string;
  geo_address2: string;
  geo_address3: string;
  geo_place: string;
  geo_pin: string;
  geoAddress: string;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  subscription: any;
  appHashString: any;
  smsTextmessage: any;

  appHashString1: any;
  smsTextmessage1: any;
  isShown = false;

  @ViewChild('a') myInput;

  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  devicesId: string = ""
  mode: string = "login";
  login: any = { "username": "", "password": "" };
  registerObj: any = {
    'email': '', 'mobile': '', 'address1': '', 'address2': '', 'address3': '', 'place': '',
    'password': '', 'store_id': this.data.storeID, 'name': '', 'pincode': '', 'latitude': '', 'longitude': '', device_id: '',
  };
  recoverObj: any = {
    'branch': '', 'mobile': '', 'store_id': this.data.storeID
  };
  branches: any = [];
  OTP: string = '';
  showOTPInput: boolean = false;
  OTPmessage: string = 'An OTP is sent to your number. You should receive it in 15 s'
  unsubscribeBackEvent: any;
  // @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  //device_id: String = "";
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public apiClient: WebClientProvider,
    public alertCtrl: AlertController,
    private storage: Storage, private app: App, public data: DataProvider,
    public modalCtrl: ModalController, public iab: InAppBrowser,
    private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder,
    private fcm: FCM, public plt: Platform, private uniqueDeviceID: UniqueDeviceID, private toastCtrl: ToastController,
    private device: Device, private _location: Location, public alertController: AlertController //,private smsRetriever: SmsRetriever
  ) {

    this.app.viewWillEnter.subscribe(viewCtrl => {
      try {
        let startTime = this.data.loggedInUserObj['store']['cutStartTime'];
        let endTime = this.data.loggedInUserObj['store']['cutEndTime'];
        var isCutOff = this.data.checkCutOff(startTime, endTime);
        // console.log(startTime);
        // console.log(endTime);
        // console.log(isCutOff);
        let logtype = "";
        this.storage.get('userLoginType').then((val) => {
          // console.log("subscribe");
          // console.log(val);
          logtype = val;
          // console.log(logtype);
        });

        if (!isCutOff && logtype == "agent") {
          this.storage.clear();
          this.navCtrl.insert(0, LoginPage);
          this.navCtrl.popToRoot();
          //this.navCtrl.setRoot(LoginPage);
        }
      } catch (e) {

      }
    });



    this.GetLocation_Onlyccords();

    this.plt.ready()
      .then(() => {
        try {
          // this.registerObj.device_id = this.device.uuid;
          // console.log("device id:" + this.device.uuid);

          this.fcm.getToken().then(token => {
            console.log("gettoken");
            console.log(token);
            this.registerObj.device_id = token
            this.devicesId = token
          });

        } catch (error) {
          console.log("error" + error);
        }

      });
    // this.plt.backButton.subscribe(() => {
    //   console.log('Back press handler!');
    //   this.plt.exitApp();
    // });

  }

  GetLocation_Onlyccords() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude;
      this.geoAccuracy = resp.coords.accuracy;
    }).catch((error) => {
      // alert('Error getting location' + JSON.stringify(error));
    });
  }

  ionViewLoaded() {

    setTimeout(() => {
      this.myInput.setFocus();
    }, 150);

  }

  ionViewDidEnter() {
    this.subscription = this.plt.backButton.subscribe(() => {
      //this.initializeBackButtonCustomHandler();
      this.plt.exitApp();
    });
  }
  // initializeBackButtonCustomHandler(): void {
  //   this.unsubscribeBackEvent = this.plt.backButton.subscribe(999999,  () => {
  //      if(window.confirm('Do you want to exit the app?'))
  //      {
  //         navigator['app'].exitApp();
  //       }
  //   });
  // }

  ionViewDidLeave() {
    this.subscription.unsubscribe();
  }

  ionViewDidLoad() {
    if (this.branches.length == 0) {
      this.apiClient.getBranches().then(result => {
        this.branches = result;
        console.log("branxhws ",this.branches);
        // this.recoverObj.branch = this.branches[0].branch_code;
        
        if(this.branches.length==1)
        {
          //this.recoverObj.branch = this.branches[0].Branch;
        }
      });

    }
    this.changeMode("login");
    //this.login.username.setfocus()
    this.myInput.setFocus();
    console.log('ionViewDidLoad LoginPage');
    //  this.storage.clear();
    if (this.data.environment == 'dev') {
       //this.login = { "username": "9845230929", "password": "123" };
      this.registerObj.branch = "SMLJ";
      this.recoverObj.branch = "SMLJ";
      // comment above two lines who have more than 1 branches
       //this.registerObj.branch = "TTD"; // DVG RHR
       //this.login = { "username": "", "password": "" }; //8886665590 password
    }
    this.storage.get('print_userobj').then((val) => {
      console.log("user_printObj:start");
      console.log(val);
      console.log("user_printObj:end");
      if (val == null || val == "") {

      } else {
        this.data.set_user_printObj(val);
        console.log("after set");
      }
    });
    this.storage.get('userLoginType').then((val) => {
      console.log(val);
      console.log(val === 'customer');
      if (val) {
        this.data.setUserLoginType(val);
        if (val === 'agent') {
          console.log("---I am here2" + this.data.environment);
          //this.rootPage = LoginPage;
          if (this.data.environment == 'dev') {
            console.log("---I am here");
         
            this.storage.get('loggedInUserObj').then((val) => {
              console.log("val" + val);
              if (val == null || val == "") {

              } else {
                this.data.setUser(val);
                this.data.agentID = val['agent_id'];
                this.data.setAgentID(val['agent_id']);
                this.navCtrl.push(MenuPage);
              }
            });


          }
        } else if (val === 'customer') {
          this.storage.get('loggedInUserObj').then((val) => {
            this.data.setUser(val);
            this.navCtrl.push(MenuPage);
          });
        }
      } else {

      }
    });


  }
  validateRecoverpwd() {
    if (this.recoverObj.mobile == "") {
      console.log("mobile error");
      return false;
    }
    if (this.recoverObj.branch == "") {


      console.log("branch error");
      return false;
    }
    return true;
  }
  validateRegistartion() {
    if (this.registerObj.name == "") {
      return false;
    }
    if (this.registerObj.mobile == "") {
      return false;
    }
    if (this.registerObj.mobile.length != 10) {
      return false;
    }
    if (this.registerObj.address1 == "") {
      return false;
    }
    if (this.registerObj.email == "") {
      //return false;
    }
    if (this.registerObj.address2 == "") {
      //return false;
    }
    if (this.registerObj.password == "") {
      return false;
    }
    if (this.registerObj.place == "") {
      return false;
    }
    if (this.registerObj.branch == "") {
      return false;
    }
    // is_Email_Valid = false;
    // this.validate_Email().then(result => {
    // });
    // if (is_Email_Valid == false) {
    //   return false;
    // }
    return true;
  }
  confirmedUser = {};

  register() {
    this.apiClient.showLoader();
    if (this.validateRegistartion()) {
      if (this.registerObj.password === this.registerObj.cpassword) {

        // here to check wether User Already Present Or Not !!
        this.apiClient.CheckUserAlreadyRegistered(this.registerObj).then(result => {
          console.log(result)
          if (result == 0 || result == null) {
            console.log("NEw User")
            try {
              this.GetLocation_Onlyccords();
            } catch (e) {

            }
            this.registerObj.latitude = this.geoLatitude + "";
            this.registerObj.longitude = this.geoLongitude + "";

            this.apiClient.customerRegister(this.registerObj).then(result => {
              this.apiClient.dismissLoader();
              console.log(result)
              if (result['userId'] > 0) {
                //this.registerObj.mobile = this.login.username;
                this.changeMode('reg-otp');
              } else {
                this.changeMode('login');
                let alert = this.alertCtrl.create({
                  title: 'User Already Exists',
                  subTitle: 'User already exists, for password goto Forget Password',
                  buttons: ['Dismiss']
                });
                alert.present();
              }
            });
          } else if (result == 1) {
            this.apiClient.dismissLoader();

            this.recoverObj.mobile = this.registerObj.mobile;
            this.changeMode('recover');
            let alert = this.alertCtrl.create({
              title: 'User Already Exists',
              subTitle: 'User already exists, for password goto Forget Password',
              buttons: ['Dismiss']
            });
            alert.present();
          } else if (result == 2) {
            this.apiClient.dismissLoader();
            //this.registerObj.mobile = this.login.username;
            this.changeMode('reg-otp');
            let alert = this.alertCtrl.create({
              title: 'User Already Exists',
              subTitle: 'User already exists, But OTP Not Verified',
              buttons: ['Dismiss']
            });
            alert.present();
          }
        });

      } else {
        this.apiClient.dismissLoader();
        let alert = this.alertCtrl.create({
          title: 'Password Do not Match',
          subTitle: 'Please check Credentials',
          buttons: ['Dismiss']
        });
        alert.present();
      }
    } else {
      this.apiClient.dismissLoader();
      let alert = this.alertCtrl.create({
        title: 'Data Missing!!',
        subTitle: 'Name, Mobile(10 Digit), Address 1, Address 2, Place, Branch and Password are Mandatory!!',
        buttons: ['Dismiss']
      });
      alert.present();
    }

    if (this.OTP != '') {
      this.presentToast('You are successfully registered', false, 'top', 1500);
    } else {
      this.presentToast('Your OTP is not valid', false, 'bottom', 1500);
    }
  }
  // togglePassword() {
  //   if (this.passwordshown) {
  //     this.passwordshown = false;
  //     this.passwordType = 'password';
  //   } else {
  //     this.passwordshown = true;
  //     this.passwordType = 'false';
  //   }
  // }
  doLogin2() {
    this.apiClient.showLoader();
    setTimeout(() => {
      let alert = this.alertCtrl.create({
        title: 'Server Not Responding',
        subTitle: 'Server is not responding as expected, please check after sometime',
        buttons: ['Dismiss']
      });
      this.apiClient.dismissLoader();
      alert.present();
    }, 60000);

  }
  doLogin3() {
    let cutOffReached = this.data.checkCutOff("01:00:00 AM", "02:23:00 PM");
  }

  doLogin() {
    console.log("LoginClicked");
    if ((this.login.username.indexOf('a') > -1) || (this.login.username.indexOf('A') > -1)) {
      this.login.username = this.login.username.substring(1);
      this.apiClient.showLoader();
      this.apiClient.agnetLogin({
        "username": this.login.username,
        "password": this.login.password,
        "storeID": this.data.storeID,
        "device_id": this.devicesId
      }).then(result => {
        console.log(result);
        if (result[0]) {
          let store = result[0]['store'];

          let startTime = store['cutStartTime'];
          let endTime = store['cutEndTime'];
          let cutOffReached = this.data.checkCutOff(startTime, endTime);
          if (cutOffReached) {
            this.data.set_user_printObj(result[0]);

            this.data.setUser(result[0]);
            if (result[0]['agent_id']) {
              this.data.setUserLoginType('agent');
              this.apiClient.sendOTP({
                "mobile": this.login.username,
                "storeID": this.data.storeID
              }).then(result => {
                this.apiClient.dismissLoader();
                this.changeMode("otp");
              });
              this.data.setUser([]);
            } else {
              this.changeMode("login");
              this.apiClient.dismissLoader();
              this.showLoginFailedAlert();
            }
            //this.getHashCode();
            this.ReadOtp();
            // this.getSMS();
          } else {
            this.changeMode("login");
            this.apiClient.dismissLoader();
            this.showLoginCutOffAlert();
          }

        } else {
          this.changeMode("login");
          this.apiClient.dismissLoader();
          this.showLoginFailedAlert();
        }
      });
    } else {
      this.apiClient.showLoader();
      this.apiClient.customerLogin({
        "username": this.login.username,
        "password": this.login.password,
        "storeID": this.data.storeID,
        "device_id": this.devicesId
      }).then(result => {
        console.log("res : " + result)
        if (result[0]) {
          if (result[0]['user_id']) {
            this.data.setUserLoginType('customer');
            this.data.set_user_printObj(result[0]);
            this.data.setUser(result[0]);
            this.apiClient.dismissLoader();
            console.log("calling Menu-1");
            this.changeMode("otp");
            this.navCtrl.push(MenuPage);
            console.log("calling Menua-fter");
          } else {
            this.changeMode("login");
            this.apiClient.dismissLoader();
            this.showLoginFailedAlert();
          }
        } else {
          //CheckUserAlreadyRegistered
          let obj = {
            "mobile": this.login.username,
            "store_id": this.data.storeID,
            "branch": "",
          }
          this.apiClient.CheckUserAlreadyRegistered(obj).then(result => {
            console.log(result);
            if (result == 0 || result == null) {
              this.changeMode("login");
              this.apiClient.dismissLoader();
              // this.showLoginFailedAlert();
              let alert = this.alertCtrl.create({
                title: 'User Not Found',
                subTitle: 'Kindly SignUp For Registration',
                buttons: ['Dismiss']
              });
              alert.present();
            } else if (result == 1) {
              this.apiClient.dismissLoader();

              this.recoverObj.mobile = this.login.mobile;
              //this.changeMode('recover');
              let alert = this.alertCtrl.create({
                title: 'PassWord MisMatch',
                subTitle: 'To Get password goto Forget Password',
                buttons: ['Dismiss']
              });
              alert.present();
            } else if (result == 2) {
              this.apiClient.dismissLoader();
              this.registerObj.mobile = this.login.username;
              this.changeMode('reg-otp');
              let alert = this.alertCtrl.create({
                title: 'OTP Not Verified',
                subTitle: 'User already exists, But OTP Not Verified',
                buttons: ['Dismiss']
              });
              alert.present();
            }
          });
          // this.changeMode("login");
          // this.apiClient.dismissLoader();
          // this.showLoginFailedAlert();
        }
      });
    }
  }
  showLoginFailedAlert() {

    let alert = this.alertCtrl.create({
      title: 'Login Failed!',
      subTitle: 'Please check Credentials',
      buttons: ['Dismiss']
    });
    alert.present();

  }

  showLoginCutOffAlert() {

    let alert = this.alertCtrl.create({
      title: 'Cut Off Time!',
      subTitle: 'You are not allowed login',
      buttons: ['Dismiss']
    });
    alert.present();

  }

  changeMode(mode) {
    this.mode = mode;
  }

  doOTPValidate() {
    try {
      SMSReceive.stopWatch(
        () => { console.log('watch stopped') },
        () => { console.log('watch stop failed') }
      )
    } catch (e) {
    }

    this.apiClient.showLoader();
    this.apiClient.validateOTP({
      "mobile": this.login.username, "otp": this.login.otp,
      "storeID": this.data.storeID
    }).then(result => {
      console.log(result);
      this.apiClient.dismissLoader();
      if (result['agent_id']) {

        this.data.setUser(result);
        this.data.setAgentID(result['agent_id']);
        this.data.setUserLoginType('agent');
        this.navCtrl.push(MenuPage);
      } else {
        this.changeMode("otp");
        let alert = this.alertCtrl.create({
          title: 'OTP Failed!',
          subTitle: 'OTP Validation Failed',
          buttons: ['Dismiss']
        });
        alert.present();
      }
    });
  }
  doCustomerOTPValidate() {
    this.apiClient.showLoader();

    this.apiClient.validateCustomerOTP({ "mobile": this.registerObj.mobile, "otp": this.login.otp, "branch": this.registerObj.branch, "storeId": this.data.storeID }).then(result => {
      console.log(result);
      this.apiClient.dismissLoader();
      if (result['user_id'] > 0) {
        let alert = this.alertCtrl.create({
          title: 'Success!',
          subTitle: 'Registartion Successful, please login to use App',
          buttons: [
            {
              text: 'Ok',
              role: 'ok',
              handler: () => {
                this.changeMode('login');
              }
            }]
        });
        alert.present();
      } else {
        let alert = this.alertCtrl.create({
          title: 'OTP Failed!',
          subTitle: 'OTP Validation Failed',
          buttons: ['Dismiss']
        });
        alert.present();
      }
    });
  }
  openReturnPolicy() {
    let profileModal = this.modalCtrl.create(ReturnpolicyPage, { userId: 8675309 });
    profileModal.present();
  }
  openTerms() {
    let profileModal = this.modalCtrl.create(TermsPage, { userId: 8675309 });
    profileModal.present();
  }
  openPrivacyPolicy() {
    let profileModal = this.modalCtrl.create(PrivacyPage, { userId: 8675309 });
    profileModal.present();
  }
  openContact() {
    let profileModal = this.modalCtrl.create(ContactPage, { userId: 8675309 });
    profileModal.present();
  }

  openContactNew() {
    /*this.browserTab.isAvailable()
    .then(isAvailable => {
      if (isAvailable) {
        this.browserTab.openUrl('http://www.asterixtechnology.com/privacy-policy.html');
      } else {
        let profileModal = this.modalCtrl.create(ContactPage, { userId: 8675309 });
        profileModal.present();
      }
    });*/
    let url = 'http://www.asterixtechnology.com/privacy-policy.html';
    this.apiClient.Get_Contact_us().then(result => {

      if (result["data"] != "" || result["data"] != null) {
        let urlNew = url
        urlNew = result["data"] + "";
        const browser = this.iab.create(urlNew, "_self", "hidden=no,location=no");
        browser.show()
      }
    });
  }

  //openPrivacyPolicyNew
  openPrivacyPolicyNew() {
    let url = 'http://www.asterixtechnology.com/privacy-policy.html';
    this.apiClient.Get_Privacy_policy().then(result => {

      if (result["data"] != "" || result["data"] != null) {
        let urlNew = url
        urlNew = result["data"] + "";
        const browser = this.iab.create(urlNew, "_self", "hidden=no,location=no");
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
        const browser = this.iab.create(urlNew, "_self", "hidden=no,location=no");
        browser.show()
      }
    });

  }

  openReturnPolicyNew() {
    let url = 'http://www.asterixtechnology.com/privacy-policy.html';
    this.apiClient.Get_Refundpolicy().then(result => {

      if (result["data"] != "" || result["data"] != null) {
        let urlNew = url
        urlNew = result["data"] + "";
        const browser = this.iab.create(urlNew, "_self", "hidden=no,location=no");
        browser.show()
      }
    });
  }

  RecoverPassword() {
    console.log("RecoverClicked");
    if (this.validateRecoverpwd()) {
      //
      console.log("RecoverClicked");

      console.log("barxnches list",this.recoverObj);
      
      console.log(this.recoverObj.branch);
      if ((this.recoverObj.mobile.indexOf('a') > -1) || (this.recoverObj.mobile.indexOf('A') > -1)) {
        this.recoverObj.mobile = this.recoverObj.mobile.substring(1);
        this.apiClient.showLoader();
        this.apiClient.recoverpass({
          "username": this.recoverObj.mobile,
          "branchID": this.recoverObj.branch,
          "storeID": this.data.storeID
        }).then(result => {
          this.apiClient.dismissLoader();
          console.log(result);
          let alert = this.alertCtrl.create({
            title: 'Password Sent',
            subTitle: 'Password Sent to Registered Mobile',
            buttons: [
              {
                text: 'Ok',
                role: 'ok',
                handler: () => {
                  this.changeMode('login');
                }
              }]
          });
          alert.present();
        });

      } else {

        this.apiClient.showLoader();
        this.apiClient.recoverpassuser({
          "username": this.recoverObj.mobile,
          "branchID": this.recoverObj.branch,
          "storeID": this.data.storeID
        }).then(result => {
          this.apiClient.dismissLoader();
          console.log(result);
          let alert = this.alertCtrl.create({
            title: 'Password Sent',
            subTitle: 'Password Sent to Registered Mobile',
            buttons: [
              {
                text: 'Ok',
                role: 'ok',
                handler: () => {
                  this.changeMode('login');
                }
              }]
          });
          alert.present();
        });

      }
    }

  }

  validate_Email() {

    return new Promise((resolve, reject) => {
      is_Email_Valid = false

      if (this.registerObj.email != undefined) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        is_Email_Valid = re.test(this.registerObj.email);
        resolve(is_Email_Valid);
      } else {
        resolve(false);
      }

    });
  }

  ResendOtp_Agent() {
    this.apiClient.showLoader();
    this.data.setUserLoginType('agent');
    this.apiClient.sendOTP({
      "mobile": this.login.username,
      "storeID": this.data.storeID
    }).then(result => {
      this.apiClient.dismissLoader();
      let alert = this.alertCtrl.create({
        title: 'Otp Sent',
        subTitle: 'Otp Sent to Registered Mobile',
        buttons: [
          {
            text: 'Ok',
            role: 'ok',
            handler: () => {
              this.changeMode('otp');
            }
          }]
      });
      alert.present();
      // this.getHashCode();
      this.ReadOtp();
      // this.getSMS();
    });
    this.apiClient.dismissLoader();
  }

  ResendOtp() {
    this.apiClient.showLoader();
    this.data.setUserLoginType('customer');
    this.apiClient.sendOTP({
      "mobile": this.registerObj.mobile,
      "storeID": this.data.storeID
    }).then(result => {
      this.apiClient.dismissLoader();
      let alert = this.alertCtrl.create({
        title: 'Otp Sent',
        subTitle: 'Otp Sent to Registered Mobile',
        buttons: [
          {
            text: 'Ok',
            role: 'ok',
            handler: () => {
              this.changeMode('otp');
            }
          }]
      });
      alert.present();
      //this.getHashCode();
      this.ReadOtp();
      // this.getSMS();
    });
    this.apiClient.dismissLoader();
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
    let address = "";
    for (let key in addressObj) {
      obj.push(addressObj[key]);
    }
    obj.reverse();
    this.geo_address1 = (obj[0] + " " + obj[1]).trim()
    this.geo_address2 = (obj[2] + " " + obj[3] + " " + obj[4]).trim()
    this.geo_place = obj[6]
    this.geo_pin = obj[7]
    this.registerObj.address1 = this.geo_address1
    this.registerObj.address2 = this.geo_address2
    this.registerObj.place = this.geo_place
    this.registerObj.pincode = this.geo_pin
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
  showExitConfirm() {
    let alert = this.alertController.create({
      title: 'App termination',
      message: 'Do you want to close the app?',
      //backdropDismiss: false,
      buttons: [{
        text: 'Stay',
        role: 'cancel',
        handler: () => {
          console.log('Application exit prevented!');
        }
      }, {
        text: 'Exit',
        handler: () => {
          // navigator['app'].exitApp();
          this.plt.exitApp();
        }
      }]
    });
    alert.present();
  }
  setFocus(nextElement) {
    nextElement.setFocus();
  }

  ReadOtp() {
    SMSReceive.startWatch(
      () => {
        document.addEventListener('onSMSArrive', (e: any) => {
          var IncomingSMS = e.data;

          //this.processSMS(IncomingSMS);
          const message = IncomingSMS.body;
          if (message && message.indexOf('OTP') != -1) {
            this.OTP = IncomingSMS.body.slice(0, 6);
            this.OTPmessage = 'OTP received. Proceed to register'
            console.log(this.OTPmessage)
            console.log(this.OTP);
            this.login.otp = this.OTP;
            this.stop();
          }

          console.log(IncomingSMS);
        });
      },
      () => { console.log('watch start failed') }
    )
  }

  stop() {
    SMSReceive.stopWatch(
      () => { console.log('watch stopped') },
      () => { console.log('watch stop failed') }
    )
    this.doOTPValidate4AutoVerify();
    try {
      this.apiClient.dismissLoader();
    } catch (e) {

    }
  }

  processSMS(data) {
    // Check SMS for a specific string sequence to identify it is you SMS
    // Design your SMS in a way so you can identify the OTP quickly i.e. first 6 letters
    // In this case, I am keeping the first 6 letters as OTP
    const message = data.body;
    if (message && message.indexOf('OTP') != -1) {
      this.OTP = data.body.slice(0, 6);
      this.OTPmessage = 'OTP received. Proceed to register'
      console.log(this.OTP);
      this.stop();
    }
  }

  async presentToast(message, show_button, position, duration) {
    const toast = await this.toastCtrl.create({
      message: message,
      showCloseButton: show_button,
      position: position,
      duration: duration
    });
    toast.present();
  }
  // register() {

  // }
  next() {
    //   this.showOTPInput = true;
    this.ReadOtp();
  }

  doOTPValidate4AutoVerify() {
    this.apiClient.showLoader();
    this.apiClient.validateOTP({
      "mobile": this.login.username, "otp": this.login.otp,
      "storeID": this.data.storeID
    }).then(result => {
      console.log(result);
      console.log(result[0]);
      console.log(result['agent_id']);
      this.apiClient.dismissLoader();
      if (result['agent_id'] > 0) {

        this.data.setUser(result);
        this.data.setAgentID(result['agent_id']);
        this.data.setUserLoginType('agent');
        this.navCtrl.push(MenuPage);
      } else {
        this.changeMode("otp");
        // let alert = this.alertCtrl.create({
        //   title: 'OTP Failed!',
        //   subTitle: 'OTP Validation Failed',
        //   buttons: ['Dismiss']
        // });
        // alert.present();
        this.ReadOtp();
      }
    });
  }

  GetMemberAddressByMobile() {
    console.log("this.registerObj.mobile.length " + this.registerObj.mobile.length)
    if (this.registerObj.mobile != "" && this.registerObj.mobile != undefined && this.registerObj.mobile.length >= 10) {
      if (this.registerObj.name == "" || this.registerObj.name == undefined) {
        this.apiClient.showLoader();
        this.apiClient.GetMemberAddress(this.registerObj.mobile).then(result => {
          console.log(result);
          let data = result[0];
          try {
            this.registerObj.name = data["name"];
            this.registerObj.email = data["email"];
            this.registerObj.address1 = data["address1"];
            this.registerObj.address2 = data["address2"];
            this.registerObj.address3 = data["address3"];
            this.registerObj.place = data["place"];
            this.registerObj.pincode = data["pin"];

          } catch (error) {

          }

          this.apiClient.dismissLoader();
        });
      }
    }
  }

  checkFocus() {
    this.isShown = true;
  }

  checkBlur() {
    this.isShown = false;
  }
}
