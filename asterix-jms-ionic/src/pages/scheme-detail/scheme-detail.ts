import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, Platform } from 'ionic-angular';
import { PaymentSuccessPage } from '../payment-success/payment-success';
import { WebClientProvider } from '../../providers/web-client/web-client';
import { DataProvider } from '../../providers/data/data';
import { PrinterListPage } from '../printer-list/printer-list';
import { HttpClient } from '@angular/common/http';
import { resolveDefinition } from '@angular/core/src/view/util';
import { resolveReflectiveProviders } from '@angular/core/src/di/reflective_provider';
//import { empty } from 'rxjs/Observer';
import { stringify } from '@angular/core/src/util';
import { InAppBrowser, InAppBrowserObject, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';

import { DomSanitizer } from '@angular/platform-browser';
//import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';



declare var RazorpayCheckout: any;
//var inAppBrowserRef;
var is_Email_Valid: Boolean = false;

@IonicPage()
@Component({
  selector: 'page-scheme-detail',
  templateUrl: 'scheme-detail.html',
})
export class SchemeDetailPage {
  private last_recpt_dt: Date;
  private Todaysdate: Date;
  private scheme: any;
  private pgateway: any;
  private groupCode: any;
  private rozar_orderId: any;
  private isAuthorize: boolean = false;

  private rz_pay_res_id: any;
  private rz_pay_res_ordid: any;
  private rz_pay_res_signid: any;
  public disabled = false;
  private store_email_for_pg: string;
  private isflexigroup: Boolean = false;

  private geo_address1
  private geo_address2
  private geo_place

  private instlcnt: any = 0;
  private adjustedscheme: boolean = false;
  private GroupMemberNo="";
  private installmentdetails="";
  redirectUrl: any = '';
  iframeSrc: any='hi';

  geoLatitude: number;
  geoLongitude: number;
  geoAccuracy: number;
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  viewMode = 'Pay';

  ledger: any = [];
  orderIdDet: any = [];
  res_paydet: any = [];
  banklist: any = [];

  pay_res = {
    res_pay_id: "",
    res_ord_id: "",
    res_sign: "", secret: ""
  }


  constructor(public navCtrl: NavController, public navParams: NavParams, public http1: HttpClient,
    public alertCtrl: AlertController, public iab: InAppBrowser, private nativeGeocoder: NativeGeocoder,
    public data: DataProvider, public modalCtrl: ModalController, 
    private geolocation: Geolocation, private plt: Platform,
    public apiClient: WebClientProvider,private sanitizer: DomSanitizer) {
    this.scheme = {};
    this.pgateway = {};
    this.apiClient.showLoader();
    //this.Todaysdate= Date.now();//new Date.toISOString();

    this.groupCode = navParams.get('memberCode');
    this.apiClient.getBankList().then(res => {
      // let bank : any = res;
      // console.log("banklist");
      // console.log(res);
      this.banklist = res;
      // console.log(this.banklist);
    });
    this.apiClient.getPaymentGatewayDetails().then(result => {
      this.pgateway = result[0];
      data.razorpay_merchant_id = this.pgateway.merchant_id;
      data.razorpay_merchant_name = this.pgateway.merchant_name;
      data.razorpay_key_id = this.pgateway.key_id;
      data.razorpay_key_secret = this.pgateway.key_secret;
      data.razorpay_url = this.pgateway.url;
      data.razorpay_posturl = this.pgateway.posturl;
      data.razorpay_callbackurl = this.pgateway.callbackurl;
      data.razorpay_std = this.pgateway.standered;
      this.store_email_for_pg = this.pgateway.store_email;

      data.esypay_merchant_id = this.pgateway.merchant_id;
      data.esypay_ChecksumKey = this.pgateway.key_id;
      data.esypay_version = this.pgateway.key_secret;
      data.esypay_url = this.pgateway.url;
      data.esypay_callback = this.pgateway.callbackurl;
      data.esypay_type = this.pgateway.merchant_name;

      // data.razorpay_std : 0 then standerd 
      // data.razorpay_std : 1 then url call
      // data.razorpay_std : 2 then easypay

      console.log("razorpay_merchant_id :" + data.razorpay_merchant_id)
      console.log("razorpay_merchant_name :" + data.razorpay_merchant_name)
      console.log("razorpay_key_id :" + data.razorpay_key_id)
      console.log("razorpay_key_secret :" + data.razorpay_key_secret)
      console.log("razorpay_url :" + data.razorpay_url)
    });
    console.log("grc",this.groupCode);
    
    this.apiClient.schemeDetail(this.groupCode).then(result => {
      this.scheme.g_balance = 0;
      this.scheme = result[0];
      console.log("sche",result[0]);
      console.log(this.scheme);
      this.GroupMemberNo = this.scheme.mgroup + " - " + this.scheme.member_no;
    
      this.scheme.initial = "mr";
      this.scheme.mode = "";
      this.scheme.PayInstall = 1;
      this.scheme.ldgrCurrBal = 0;
      this.scheme.ldgrPaidInstall = 0;
      this.Todaysdate = this.scheme.todaydt
      if (this.scheme.isflexible == "Y") {
        this.isflexigroup = true
      } else {
        this.isflexigroup = false
      }
      /*  this.scheme.mode = "0"; 
      if (this.data.userLoginType == 'customer') {
        this.scheme.mode = "6";
      }*/
      this.scheme.chqNo = "";
      if (this.scheme.info == "A" || this.scheme.info == "a") {
        this.adjustedscheme = true;
      } else {
        this.adjustedscheme = false;
      }
      if (this.scheme.gold_scheme == "1") {
        console.log("scheme.scheme_amount :" + this.scheme.scheme_amount)
        console.log("scheme.scheme.AMOUNT :" + this.scheme.AMOUNT)
        console.log("scheme.schemeToPayAmount" + this.scheme.schemeToPayAmount)
        if (this.scheme.group_type == "G") {
          this.scheme.g_balance = this.scheme.scheme_amount;
          this.scheme.scheme_amount = (this.scheme.scheme_amount * this.scheme.store_gold_rate).toFixed(3);
        } else {
          this.scheme.g_balance = (this.scheme.scheme_amount / this.scheme.store_gold_rate).toFixed(3);
        }
      } else {
        this.scheme.g_balance = 0;
      }
      console.log("this.scheme.g_balance---" + this.scheme.g_balance);
      if (this.scheme.isflexible == "Y") {
         this.scheme.paidInsatllments = this.scheme.installCnt;
         this.scheme.currentInstalment = this.scheme.installCnt + 1;
         this.scheme.pendingInstalment = this.scheme.no_inst - this.scheme.installCnt;
      } else {
        this.scheme.paidInsatllments = this.scheme.amountPaid / this.scheme.scheme_amount;
        this.scheme.currentInstalment = this.scheme.paidInsatllments + 1;
        this.scheme.pendingInstalment = this.scheme.no_inst - this.scheme.paidInsatllments;
      } 

      this.scheme.schemeToPayAmount = this.scheme.scheme_amount;
      if (this.adjustedscheme == true) {
        this.scheme.pendingInstalment = 0;
        this.scheme.currentInstalment = 0;        this.scheme.schemeToPayAmount = 0;
      } else {

      }
      this.installmentdetails = this.scheme.no_inst  + " / " +  this.scheme.pendingInstalment  + " / " +  this.scheme.dueInstallNo +  " / " + this.scheme.currentInstalment;
      // this.installmentdetails = this.scheme.currentInstalment; // this line only for mehat's anand jewellers
      console.log("app_duecnt_block :" + this.scheme.app_duecnt_block )
      this.apiClient.dismissLoader();
    });
    console.log("calling ledger");
    this.apiClient.userLedger(this.scheme.mobile, this.groupCode).then(result => {
      this.amountCollected = 0;
      this.goldCollected = 0;
      console.log(result);
      this.ledger = result;
      var slno: number = 0;
      for (let eachLedgerItem of this.ledger) {
        console.log(eachLedgerItem);
        console.log(eachLedgerItem.longitude);
        console.log(eachLedgerItem.latitude);

        console.log("slno:", slno);
        if (slno == 0) {
          console.log("eachLedgerItem.voucher_date;" + eachLedgerItem.voucher_date + " : today :" + this.Todaysdate);
          this.last_recpt_dt = eachLedgerItem.voucher_date;

        }
        this.goldCollected = this.goldCollected + eachLedgerItem.gross_wt;
        this.amountCollected = this.amountCollected + eachLedgerItem.amount;
        slno = slno + 1;
        console.log(" this.goldCollected  :" + this.goldCollected);
        console.log(" this.amountCollected :" + this.amountCollected);
        // console.log("last_recpt_dt" + this.last_recpt_dt);
        if (this.adjustedscheme == true) {
          this.goldCollected = 0;
          this.amountCollected = 0;
        } else {

        }
      }
    });

    if ( this.data.userLoginType!='agent' ) {
      console.log("Online")
      this.scheme.mode="6";
    }
    this.GetLocation_Onlyccords();

  }
  


  ionViewDidLoad() {
    console.log('ionViewDidLoad SchemeDetailPage');
    this.apiClient.schemeDetail(this.groupCode).then(result => {
      this.scheme = result[0];
      console.log(this.scheme);
      this.scheme.initial = "mr";
      this.scheme.mode = "";
      this.Todaysdate = this.scheme.todaydt
      //this.scheme.mode = "0";
      if (this.data.userLoginType == 'customer') {
        this.scheme.mode = "6";
      }
      this.scheme.chqNo = "";
      if (this.scheme.info == "A" || this.scheme.info == "a") {
        this.adjustedscheme = true;
      } else {
        this.adjustedscheme = false;
      }
      if (this.scheme.gold_scheme == "1") {
        console.log("scheme.scheme_amount :" + this.scheme.scheme_amount)
        console.log("scheme.scheme.AMOUNT :" + this.scheme.AMOUNT)
        console.log("scheme.schemeToPayAmount" + this.scheme.schemeToPayAmount)
        // this.scheme.g_balance = (this.scheme.scheme_amount / this.scheme.store_gold_rate).toFixed(3);
        if (this.scheme.group_type == "G") {
          this.scheme.g_balance = this.scheme.scheme_amount;
          this.scheme.scheme_amount = (this.scheme.scheme_amount * this.scheme.store_gold_rate).toFixed(3);
        } else {
          this.scheme.g_balance = (this.scheme.scheme_amount / this.scheme.store_gold_rate).toFixed(3);
        }
      } else {
        this.scheme.g_balance = 0;
      }
      console.log("this.scheme.g_balance---" + this.scheme.g_balance);
      if (this.scheme.isflexible == "Y") {
        this.scheme.paidInsatllments = this.scheme.installCnt;
        this.scheme.currentInstalment = this.scheme.installCnt + 1;
        this.scheme.pendingInstalment = this.scheme.no_inst - this.scheme.installCnt;
      } else {
        this.scheme.paidInsatllments = this.scheme.amountPaid / this.scheme.scheme_amount;
        this.scheme.currentInstalment = this.scheme.paidInsatllments + 1;
        this.scheme.pendingInstalment = this.scheme.no_inst - this.scheme.paidInsatllments;
      }
      // this.scheme.paidInsatllments = this.scheme.amountPaid / this.scheme.scheme_amount;
      // this.scheme.currentInstalment = this.scheme.paidInsatllments + 1;
      // this.scheme.pendingInstalment = this.scheme.no_inst - this.scheme.paidInsatllments;
      this.scheme.schemeToPayAmount = this.scheme.scheme_amount;

      if (this.adjustedscheme == true) {
        this.scheme.pendingInstalment = 0;
        this.scheme.currentInstalment = 0;
      } else {

      }
      //this.installmentdetails = this.scheme.no_inst  + " / " +  this.scheme.pendingInstalment  + " / " +  this.scheme.dueInstallNo +  " / " + this.scheme.currentInstalment;
      this.installmentdetails = this.scheme.currentInstalment;  // this line only for mehat's anand jewellers
    
      if ( this.data.userLoginType!='agent' ) {
        console.log("Online")
        this.scheme.mode="6";
      }
      // this.apiClient.dismissLoader();
    });
  }
  openInAppBrowser(url: string,epay_obj) {

    const browser = this.iab.create(url, '_self', {
      location: 'yes', // show address bar
      toolbar: 'yes' // show toolbar
    });
    
    const transactionId = epay_obj.transaction_id;
    const url1: string = "https://us-central1-kumuduapi-f76e4.cloudfunctions.net/app/phonepe-callback-details";

    const requestBody = { transactionId: transactionId }; // Prepare the request body    
    let attempts = 0;
    const maxAttempts: number = 20;
    const timeout: number = 4000;
    console.log("reqbody",requestBody);
    
    const checkApiResponse = () => {
      attempts++;

      this.http1.post(url1, requestBody).subscribe(
        (response: any) => {
          console.log('API Response:', response);
          if (response && response.length > 0 && response[0].code === 'PAYMENT_SUCCESS') {
            console.log('Successful response. Closing the browser.');
            console.log('cloud res', response[0]);
            const { amount, transactionId, providerReferenceId, code } = response[0];
            const filteredResponse = { amount, transactionId, providerReferenceId, code };
            const voucherNoJSON = JSON.stringify(filteredResponse);

            console.log("amount",amount);
            

           // this.navCtrl.push(PaymentSuccessPage, { 'voucherNo': voucherNoJSON });
            browser.close();
          } else if (attempts >= maxAttempts) {
            console.log('Max attempts reached. Closing the browser.');
            browser.close();
          } else {
            // Retry after the specified timeout
            setTimeout(checkApiResponse, timeout);
          }
        },
        (error) => {
          console.error('API Error:', error);

          // If maximum attempts reached, close the browser
          if (attempts >= maxAttempts) {
            console.log('Max attempts reached. Closing the browser.');
            browser.close();
          } else {
            // Retry after the specified timeout
            setTimeout(checkApiResponse, timeout);
          }
        }
      );
    };

    checkApiResponse();
   
  }

  goldCollected = 0;
  amountCollected = 0;


  subscription: any;

  ionViewDidEnter() {
    console.log('ionViewDidLoad UserLedgerPage');
    console.log(this.scheme);

    // this.apiClient.getBankList().then(res=>{
    //   // let bank : any = res;
    //   console.log("banklist");
    //   console.log(res);
    //   this.banklist = res;
    //   console.log(this.banklist);
    // });

    try {
      this.apiClient.userLedger(this.scheme.mobile, this.groupCode).then(result => {
        console.log(result);
        this.ledger = result;
        this.goldCollected = 0;
        this.amountCollected = 0;
        var slno: number = 0;
        for (let eachLedgerItem of this.ledger) {
          console.log(eachLedgerItem);
          this.goldCollected = this.goldCollected + eachLedgerItem.gross_wt;
          this.amountCollected = this.amountCollected + eachLedgerItem.amount;
          if (slno == 0) {
            console.log("eachLedgerItem.voucher_date;" + eachLedgerItem.voucher_date + " : today :" + this.Todaysdate);
            this.last_recpt_dt = eachLedgerItem.voucher_date;

          }
          slno = slno + 1;
        }
        if (this.adjustedscheme == true) {
          this.goldCollected = 0;
          this.amountCollected = 0;
        } else {

        }

      });
    } catch (e) {

    }

    this.subscription = this.plt.backButton.subscribe(() => {
      console.log('Back press handler!');
      console.log('Show Exit Alert!');
      let MyPage: any = SchemeDetailPage;
      this.navCtrl.pop(MyPage);
    });
  }


  ionViewDidLeave() {
    this.subscription.unsubscribe();
  }

  GetLocation_Onlyccords() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude;
      this.geoAccuracy = resp.coords.accuracy;
    }).catch((error) => {

    });
  }

  goToPaymentPage() {
    // console.log("Pallavi")
    // console.log(this.scheme);

    this.disabled = !this.disabled;
    let obj = {
      agent_id: this.data.agentID + "", scheme_id: this.scheme.Scheme_id + "", group_id: this.scheme.mgroup,
      tenure: this.scheme.No_of_draw + "", member_id: this.scheme.member_id + "",
      amount_collected: this.scheme.schemeToPayAmount + "", mode: this.scheme.mode,
      grossWt: this.scheme.g_balance + "", goldRate: this.scheme.store_gold_rate + "", mcode: this.groupCode,
      txDate: new Date().toISOString(), customerMobileNumber: this.scheme.mobile,
      name: this.scheme.name, chqNo: this.scheme.chqNo, storeID: this.data.storeID,
      branch: this.data.loggedInUserObj['branch'],
      order_Iid: "", pay_Iid: "", pay_sign: "",
      MaturityDate: this.scheme.MaturityDate + "", dueInstallNo: this.scheme.dueInstallNo + "",
      latitude: this.geoLatitude + "", longitude: this.geoLongitude + "", location: "",
      epay_brn: "", epay_trn: "", epay_cid: "", epay_rid: "", epay_type: "", epay_crn: "", epay_chksumkey: "", epay_ver: "",
      epay_stc: "", epay_pmd: "", cardchq: "", extracash: "", chequedt: "", bank: "",
    };

    if (this.scheme.extracash == undefined || this.scheme.extracash == "") {
      obj.extracash = "0";
    } else {
      obj.extracash = this.scheme.extracash + "";
    }
    if (this.scheme.cardchq == undefined || this.scheme.cardchq == "") {
      obj.cardchq = "0";
    } else {
      obj.cardchq = this.scheme.cardchq;
    }
    if (this.scheme.chequedt == undefined) {
      obj.chequedt = ""
    } else {
      obj.chequedt = this.scheme.chequedt;
    }

    if (this.scheme.bank == undefined || this.scheme.bank == "") {
      obj.bank = "0"
    } else {
      obj.bank = this.scheme.bank;
    }
    // console.log("111");
    // console.log(obj.bank);
    // console.log(this.scheme.bank);
    // console.log("111");

    let pg_obj = {
      agent_id: this.data.agentID + "", scheme_id: this.scheme.Scheme_id + "", group_id: this.scheme.mgroup,
      tenure: this.scheme.No_of_draw + "", member_id: this.scheme.member_id + "",
      amount_collected: this.scheme.schemeToPayAmount + "", mode: this.scheme.mode,
      grossWt: this.scheme.g_balance + "", goldRate: this.scheme.store_gold_rate + "", mcode: this.groupCode,
      txDate: new Date().toISOString(), customerMobileNumber: this.scheme.mobile,
      name: this.scheme.name, chqNo: this.scheme.chqNo, storeID: this.data.storeID,
      branch: this.data.loggedInUserObj['branch'],
      order_Iid: "", pay_Iid: "", pay_sign: ""
    };


    //Check Installment Restrict Per Month
    if (this.scheme.instal_limit_permonth > 0) {
      this.apiClient.getInstallCount(this.scheme.mgroup, this.scheme.member_no).then(result => {
        this.instlcnt = result;
        console.log(this.instlcnt);
        if (this.instlcnt >= this.scheme.instal_limit_permonth && this.scheme.instal_limit_permonth > 0) {

        } else {

        }
      });
    }

    is_Email_Valid = false;
    this.validate_Email().then(result => {
    });

    if (is_Email_Valid == false) {
      this.scheme.email = this.store_email_for_pg;
      this.validate_Email().then(result => {
      });
    }

    try {
      this.GetLocation_Onlyccords();
      obj.latitude = this.geoLatitude + "";
      obj.longitude = this.geoLongitude + "";
    } catch (e) {

    }

    console.log(this.scheme.mode == "1");
    console.log(this.scheme.chqNo.length == 0);
    if (this.scheme.mode == "1" && this.scheme.chqNo.length == 0) {
      let alert = this.alertCtrl.create({
        title: 'Data Missing',
        message: 'Cheque Number Missing',
        buttons: [
          {
            text: 'Ok',
            role: 'ok',
            handler: () => {
              console.log('Cancel clicked'); this.apiClient.dismissLoader();
            }
          }
        ]
      });
      alert.present();
      this.disabled = !this.disabled;
    } else if (this.instlcnt >= this.scheme.instal_limit_permonth && this.scheme.instal_limit_permonth > 0) {
      let alert = this.alertCtrl.create({
        title: 'Install Payment Limit For Month Exceed',
        message: "Install Payment Limit : " + this.scheme.instal_limit_permonth + " Exceeded For Current Month",
        buttons: [
          {
            text: 'Ok',
            role: 'ok',
            handler: () => {
              console.log('Cancel clicked'); this.apiClient.dismissLoader();
            }
          }
        ]
      });
      alert.present();
      this.disabled = !this.disabled;
    } else if ((this.scheme.mode == "6" || this.scheme.mode == "2") && (this.scheme.email == undefined)) {
      let alert = this.alertCtrl.create({
        title: 'Email Missing',
        message: 'Email Address Missing',
        buttons: [
          {
            text: 'Ok',
            role: 'ok',
            handler: () => {
              console.log('Cancel clicked'); this.apiClient.dismissLoader();
            }
          }
        ]
      });
      alert.present();
      this.disabled = !this.disabled;
    } else if ((this.scheme.mode == "6" || this.scheme.mode == "2") && is_Email_Valid == false) {
      let alert = this.alertCtrl.create({
        title: 'Email Missing',
        message: 'Email Address Not Valid, Specify Valid Email',
        buttons: [
          {
            text: 'Ok',
            role: 'ok',
            handler: () => {
              console.log('Cancel clicked'); this.apiClient.dismissLoader();
            }
          }
        ]
      });
      alert.present();
      this.disabled = !this.disabled;
    } else if (this.scheme.pendingInstalment <= 0) {
      let alert = this.alertCtrl.create({
        title: 'No Pending Installment',
        message: 'Already All Installments Paid',
        buttons: [
          {
            text: 'Ok',
            role: 'ok',
            handler: () => {
              console.log('Cancel clicked'); this.apiClient.dismissLoader();
            }
          }
        ]
      });
      alert.present();
      this.disabled = !this.disabled;
    }  else if (this.scheme.app_duecnt_block > 0 && this.scheme.dueInstallNo > this.scheme.app_duecnt_block ) {
      let alert = this.alertCtrl.create({
        title: 'Due Install Exceeds Limit',
        message: 'Contact Shop to Pay Installments..',
        buttons: [
          {
            text: 'Ok',
            role: 'ok',
            handler: () => {
              console.log('Cancel clicked'); this.apiClient.dismissLoader();
            }
          }
        ]
      });
      alert.present();
      this.disabled = !this.disabled;
    } else if (this.scheme.mode == "") {
      let alert = this.alertCtrl.create({
        title: 'Data Missing',
        message: 'Select Proper Paymode',
        buttons: [
          {
            text: 'Ok',
            role: 'ok',
            handler: () => {
              console.log('Cancel clicked'); this.apiClient.dismissLoader();
            }
          }
        ]
      });
      alert.present();
      this.disabled = !this.disabled;
    } else {
      if (this.scheme.gold_scheme == "1") {
        this.scheme.g_balance = (this.scheme.schemeToPayAmount / this.scheme.store_gold_rate).toFixed(3);
      } else {
        this.scheme.g_balance = 0.000
      }
      if (this.isflexigroup == true || (this.scheme.schemeToPayAmount % this.scheme.scheme_amount == 0)) { // check for muliple of scheme amount
        if ((this.scheme.mode == "6")) {   // check for card pay//|| this.scheme.mode == "2"
          if (this.data.razorpay_std == "2") {
            // Easy Pay Flow
            // step - 1 : Generate Unique Number
            // step - 2 : Create Encrypt And Call URL 
            // step - 3 : Catch Encrypted Response
            // step - 4 : As per Response Payment Entry

            //===============================================================================================
            // step - 1 : Generate Unique Number
            this.apiClient.getPaymentGatewayReference().then(result => {  //order id generate
              let epayRefId = result;
              console.log("epayRefId :" + epayRefId)

              if (epayRefId != "" || epayRefId != undefined) {
                let epay_obj = {
                  epay_cid: this.data.esypay_merchant_id + "",
                  epay_rid: epayRefId + "",
                  epay_crn: epayRefId + "",
                  epay_amt: this.scheme.schemeToPayAmount + "",
                  epay_ver: this.data.esypay_version + "",
                  epay_chsmkey: this.data.esypay_ChecksumKey + "",
                  epay_type: this.data.esypay_type + "",
                  epay_cyn: "INR",
                  key_id: this.scheme.member_id + "",
                  order_id: this.scheme.mgroup + "-" + this.scheme.member_no + "",
                  name: this.scheme.name + "",
                  description: this.scheme.currentInstalment + "",
                  email: this.scheme.email + "",
                  contact: this.scheme.mobile + "",
                  transaction_id: this.scheme.member_id + "-" + this.scheme.currentInstalment + "",
                  store_id: this.data.storeID + "",
                  branch: this.scheme.branch + "",
                  epay_memId: this.scheme.member_id + "",
                  epay_currInstl: this.scheme.currentInstalment + ""
                }
                console.log(epay_obj);
                console.log(epay_obj.branch);
                console.log(epay_obj.store_id);
                console.log(epay_obj.epay_memId);
                var getEpayEncrypt;
                // step - 2 : Create Encrypt And Call URL 
                this.apiClient.getEpayEncrypt(epay_obj).then(result => {
                  console.log("calling Function");
                  getEpayEncrypt = result;
                  //call url to open easypay gateway
                  this.Easypay_Axis(epay_obj, getEpayEncrypt).then(result => { // payment gateway call
                    this.disabled = !this.disabled;
                    let rpaySign: any
                    let res: any
                    // step - 3 : Catch Encrypted Response
                    res = result;
                    if (res == "0") {
                      console.log("Failed Receipt");
                      let alert = this.alertCtrl.create({
                        title: 'Online Payment Failed..',
                        message: 'Online Payment Failed ' + this.scheme.scheme_amount,
                        buttons: [{
                          text: 'Ok',
                          role: 'ok',
                          handler: () => {
                            console.log('Cancel clicked'); this.apiClient.dismissLoader();
                          }
                        }]
                      });
                      alert.present();
                      this.scheme.schemeToPayAmount = this.scheme.scheme_amount;

                    } else {
                      let names = res.split("&");
                      let BRN = names[0].replace("BRN=", "");
                      let STC = names[1].replace("STC=", "");
                      let RMK = names[2].replace("RMK=", "");
                      let TRN = names[3].replace("TRN=", "");
                      let TET = names[4].replace("TET=", "");
                      let PMD = names[5].replace("PMD=", "");
                      let RID = names[6].replace("RID=", "");
                      let VER = names[7].replace("VER=", "");
                      let CID = names[8].replace("CID=", "");
                      let TYP = names[9].replace("TYP=", "");
                      let CRN = names[10].replace("CRN=", "");
                      let CNY = names[11].replace("CNY=", "");
                      let AMT = names[12].replace("AMT=", "");
                      let CKS = names[13].replace("CKS=", "");
                      console.log("RMK :" + RMK)
                      console.log("BRN :" + BRN)
                      console.log("STC :" + STC)
                      console.log("CRN :" + CRN)
                      if (RMK == "success") {
                        obj.epay_brn = BRN;
                        obj.epay_trn = TRN;
                        obj.epay_cid = this.data.esypay_merchant_id;
                        obj.epay_rid = RID;
                        obj.epay_type = this.data.esypay_type;
                        obj.epay_crn = epayRefId + "";
                        obj.epay_chksumkey = this.data.esypay_ChecksumKey;
                        obj.epay_ver = this.data.esypay_version + "";
                        obj.epay_pmd = PMD + "";
                        obj.epay_stc = STC + "";

                        this.apiClient.showLoader();
                        this.apiClient.makePayment(obj).then(result => { // insert member_ledger api call
                          if (result != "" || result != null || result != null) { // check for voucher number len > 0
                            obj['voucher'] = result;
                            console.log("voucherno :" + result);

                            obj['agent_name'] = this.data.loggedInUserObj['agent_name'];
                            obj['pmode'] = obj['mode'];
                            obj['gross_wt'] = obj['grossWt'];
                            obj['rate'] = obj['goldRate'];
                            if (this.scheme.PayInstall > 1) {
                              obj['PaidIntall'] = (this.scheme.currentInstalment) + " - " + (this.scheme.currentInstalment + (this.scheme.PayInstall - 1));
                            } else {
                              obj['PaidIntall'] = this.scheme.currentInstalment;
                            }
                            obj['PrevBal'] = this.amountCollected;
                            obj['PrevGold'] = this.goldCollected;
                            obj['CurrBal'] = this.amountCollected + this.scheme.schemeToPayAmount;
                            obj['CurrGold'] = this.goldCollected + this.scheme.g_balance;
                            obj['voucher_date'] = new Date().toLocaleDateString();
                            console.log("Print OBJ :" + obj)
                            //here need to pass - update pg_order_track
                            // let ord_track = {
                            //   'voucher': result,
                            //   'orderid': this.rozar_orderId,
                            //   'paymentid': pay_newId,
                            //   'MemberId': this.scheme.member_id,
                            //   'pay_signature': rpaySign
                            // };
                            // this.apiClient.pg_order_track_update(ord_track).then(result => { //if member_ledger insert success then
                            //   console.log("order track updated")
                            // });
                            try {
                              this.GetLocation_Onlyccords();
                              obj.latitude = this.geoLatitude + "";
                              obj.longitude = this.geoLongitude + "";
                            } catch (e) {

                            }
                            try {
                              this.geo_address2 = "";
                              console.log("GeoAddress:" + obj.latitude + " - " + obj.longitude)
                              //this.getGeoencoder(obj.latitude, obj.longitude)
                              this.getGeoencoder(obj.latitude, obj.longitude).then(result => {
                                console.log("geoadd:" + this.geo_address1)
                                console.log("geoadd2:" + this.geo_address2)
                                console.log("geoplace:" + this.geo_place)

                                obj.location = this.geo_address2 + "";
                              });
                            } catch (e) {

                            }
                            console.log("GeoAddress:" + this.geo_address2)
                            obj['location'] = this.geo_address2

                            this.apiClient.dismissLoader();
                            this.data.printMessage = this.data.paymentSuccessPrintMsg(obj);
                            let displayData = " " + result + "\n "
                              + "Bank Reference Id : " + BRN + "\n "
                              + "Transaction Id : " + TRN + "\n "
                              + "Amount : " + this.scheme.schemeToPayAmount + "\n "
                              + "Member : " + this.scheme.mgroup + "-" + this.scheme.member_no + ""
                            this.navCtrl.push(PaymentSuccessPage, { 'voucherNo': displayData });
                          } else { //if voucher number empty then alert msg
                            let alert = this.alertCtrl.create({
                              title: 'Save Failed.. Contact Shop..',
                              message: 'Save Failed ' + this.scheme.scheme_amount,
                              buttons: [{
                                text: 'Ok',
                                role: 'ok',
                                handler: () => {
                                  console.log('Cancel clicked'); this.apiClient.dismissLoader();
                                }
                              }]
                            });
                            alert.present();
                            this.scheme.schemeToPayAmount = this.scheme.scheme_amount;
                          } // check for voucher number length > o
                        });
                      } else {
                        console.log("Failed Receipt");
                        let alert = this.alertCtrl.create({
                          title: 'Save Failed.. Contact Shop..',
                          message: 'Save Failed ' + this.scheme.scheme_amount,
                          buttons: [{
                            text: 'Ok',
                            role: 'ok',
                            handler: () => {
                              console.log('Cancel clicked'); this.apiClient.dismissLoader();
                            }
                          }]
                        });
                        alert.present();
                        this.scheme.schemeToPayAmount = this.scheme.scheme_amount;
                      }
                    }
                  });
                });
              }
            });
          }
          //phone pe pg 
          else if(this.data.razorpay_std == "3") {
           console.log("standard 3");
           
           let rpay_obj = {
            rpay_amount: (this.scheme.schemeToPayAmount) * 100 + "", //15-07-2020 removed 100 Multiplies because hdfc uses direct amount
            rpay_currency: "INR",
            rpay_receipt: this.scheme.member_id + "-" + this.scheme.currentInstalment,
            rpay_MembId: this.scheme.member_id,
            rpay_keyId: this.data.razorpay_key_id,
            rpay_KeySecret: this.data.razorpay_key_secret
          };
          console.log("rpay_obj",rpay_obj);
          
          this.apiClient.orderId_Generate(rpay_obj).then(result => {  //order id generate
            // this.orderIdDet = result;
            console.log("Order_Id_Created",result);
          });
          this.rozar_orderId = "";
          const uniqueId = Date.now();
            this.apiClient.getPaymentGatewayReference().then(result => {  //order id generate
              let epayRefId = result;
              console.log("epayRefId :" + epayRefId)
        
              if (epayRefId != "" || epayRefId != undefined) {
                let epay_obj = {
                  epay_cid: this.data.esypay_merchant_id + "",
                  epay_rid: epayRefId + "",
                  epay_crn: epayRefId + "",
                  epay_amt: this.scheme.schemeToPayAmount + "",
                  epay_ver: this.data.esypay_version + "",
                  epay_chsmkey: this.data.esypay_ChecksumKey + "",
                  epay_type: this.data.esypay_type + "",
                  epay_cyn: "INR",
                  key_id: this.scheme.member_id + "",
                  order_id: this.scheme.mgroup + "-" + this.scheme.member_no + "",
                  name: this.scheme.name + "",
                  description: this.scheme.currentInstalment + "",
                  email: this.scheme.email + "",
                  contact: this.scheme.mobile + "",
                  transaction_id: this.scheme.member_id + "-" + this.scheme.currentInstalment + "-"+uniqueId,
                  store_id: this.data.storeID + "",
                  branch: this.scheme.branch + "",
                  epay_memId: this.scheme.member_id + "",
                  epay_currInstl: this.scheme.currentInstalment + ""
                }
                console.log(epay_obj);
                console.log(epay_obj.branch);
                console.log(epay_obj.store_id);
                console.log(epay_obj.epay_memId);
                var getEpayEncrypt;
                // step - 2 : Create Encrypt And Call URL 
                this.apiClient.getEpayEncrypt(epay_obj).then(result => {
                  console.log("calling Function");
                  getEpayEncrypt = result;
                 
                    //const url = 'http://127.0.0.1:5001/kumuduapi-f76e4/us-central1/app/phonepe-new-payment'; // Replace with your actual server address
                    
                    const url = 'https://us-central1-kumuduapi-f76e4.cloudfunctions.net/app/phonepe-new-payment'; // Replace with your actual server address
                    
                    this.http1.post(url,epay_obj).subscribe(
                      (response: any) => {


                      console.log('Data sent successfully:!!', response);
                      this.redirectUrl = (response as any).url;
                     //  this.openInAppBrowser(this.redirectUrl,epay_obj);
                      console.log("url!",this.redirectUrl);
                        if(this.redirectUrl){
                            const browser = this.iab.create(this.redirectUrl, '_self', {
                              location: 'yes', // show address bar
                              toolbar: 'yes' // show toolbar
                            });
                            
                            const transactionId = epay_obj.transaction_id;
                            const url1: string = "https://us-central1-kumuduapi-f76e4.cloudfunctions.net/app/phonepe-callback-details";
                        
                            const requestBody = { transactionId: transactionId }; // Prepare the request body    
                            let attempts = 0;
                            const maxAttempts: number = 30;
                            const timeout: number = 4000;
                            console.log("reqbody",requestBody);
                            
                            const checkApiResponse = () => {
                              attempts++;
                        
                              this.http1.post(url1, requestBody).subscribe(
                                (response: any) => {
                                  console.log('API Response:', response);
                                  if (response && response.length > 0 && response[0].code === 'PAYMENT_SUCCESS') {
                                    console.log('Successful response. Closing the browser.');
                                    console.log('cloud res', response[0]);
                                    const { amount, checksum, transactionId, providerReferenceId, code } = response[0];
                                    const filteredResponse = { amount, transactionId, providerReferenceId, code };
                                    const voucherNoJSON = JSON.stringify(filteredResponse);
                        
                                    console.log("amount",amount);
                                    obj.pay_sign = checksum;
                                    obj.order_Iid = this.rozar_orderId;
                                    obj.pay_Iid = providerReferenceId;

                                    this.apiClient.makePayment(obj).then(result => {
                                      if (result != "" || result != null || result != null) {
                                        obj['voucher'] = result;
                                        obj['agent_name'] = this.data.loggedInUserObj['agent_name'];
                                        obj['pmode'] = obj['mode'];
                                        obj['gross_wt'] = obj['grossWt'];
                                        obj['rate'] = obj['goldRate'];
                                        if (this.scheme.PayInstall > 1) {
                                          obj['PaidIntall'] = (this.scheme.currentInstalment) + " - " + (this.scheme.currentInstalment + (this.scheme.PayInstall - 1));
                                        } else {
                                          obj['PaidIntall'] = this.scheme.currentInstalment;
                                        }
                                        obj['PrevBal'] = this.amountCollected;
                                        obj['PrevGold'] = this.goldCollected;
                                        obj['CurrBal'] = this.amountCollected + this.scheme.schemeToPayAmount;
                                        obj['CurrGold'] = this.goldCollected + this.scheme.g_balance;
                                        obj['voucher_date'] = new Date().toLocaleDateString();
                                        console.log("Print OBJ :" + obj)
                                        try {
                                          this.GetLocation_Onlyccords();
                                          obj.latitude = this.geoLatitude + "";
                                          obj.longitude = this.geoLongitude + "";
                                        } catch (e) {
                          
                                        }
                                        try {
                                          this.geo_address2 = "";
                                          console.log("GeoAddress:" + obj.latitude + " - " + obj.longitude)
                                          //this.getGeoencoder(obj.latitude, obj.longitude)
                                          this.getGeoencoder(obj.latitude, obj.longitude).then(result => {
                                            console.log("geoadd:" + this.geo_address1)
                                            console.log("geoadd2:" + this.geo_address2)
                                            console.log("geoplace:" + this.geo_place)
                          
                                            obj.location = this.geo_address2 + "";
                                          });
                                          //this.getGeoencoder(obj.latitude, obj.longitude)
                                        } catch (e) {
                          
                                        }
                                        console.log("GeoAddress:" + this.geo_address2)
                                        obj['location'] = this.geo_address2
                                        this.apiClient.dismissLoader();
                                        this.data.printMessage = this.data.paymentSuccessPrintMsg(obj);
                                        this.navCtrl.push(PaymentSuccessPage, { 'voucherNo': result });
                                      } else {
                                        let alert = this.alertCtrl.create({
                                          title: 'Save Failed.. Contact Shop..',
                                          message: 'Save Failed ' + this.scheme.scheme_amount,
                                          buttons: [{
                                            text: 'Ok',
                                            role: 'ok',
                                            handler: () => {
                                              console.log('Cancel clicked'); this.apiClient.dismissLoader();
                                            }
                                          }]
                                        });
                                        alert.present();
                                        this.scheme.schemeToPayAmount = this.scheme.scheme_amount;
                                      }
                                    });

                                    
                                   // this.navCtrl.push(PaymentSuccessPage, { 'voucherNo': voucherNoJSON });
                                    browser.close();
                                  } else if (attempts >= maxAttempts) {
                                    console.log('Max attempts reached. Closing the browser.');
                                    browser.close();
                                  } else {
                                    // Retry after the specified timeout
                                    setTimeout(checkApiResponse, timeout);
                                  }
                                },
                                (error) => {
                                  console.error('API Error:', error);
                        
                                  // If maximum attempts reached, close the browser
                                  if (attempts >= maxAttempts) {
                                    console.log('Max attempts reached. Closing the browser.');
                                    browser.close();
                                  } else {
                                    // Retry after the specified timeout
                                    setTimeout(checkApiResponse, timeout);
                                  }
                                }
                              );
                            };
                        
                            checkApiResponse();
                           
                          

                        }


                   
                    },
                      (error) => {
                        console.error('Error sending data:', error);
                      }
                    );
                });
              }
            });
          }
          else {
            // Razor Pay - Flow
            let rpay_obj = {
              rpay_amount: (this.scheme.schemeToPayAmount) * 100 + "", //15-07-2020 removed 100 Multiplies because hdfc uses direct amount
              rpay_currency: "INR",
              rpay_receipt: this.scheme.member_id + "-" + this.scheme.currentInstalment,
              rpay_MembId: this.scheme.member_id,
              rpay_keyId: this.data.razorpay_key_id,
              rpay_KeySecret: this.data.razorpay_key_secret
            };
            this.rozar_orderId = "";
            console.log("Calling Order Id");
            this.apiClient.orderId_Generate(rpay_obj).then(result => {  //order id generate
              this.orderIdDet = result;
              console.log("Order_Id_Created");
              let jsonOrd = JSON.parse(this.orderIdDet.OrderID)
              this.rozar_orderId = jsonOrd.id;
              //console.log(jsonOrd.id);
              //console.log(this.orderIdDet.OrderID);
              //console.log("Len:" + (this.rozar_orderId).length);
              if ((this.rozar_orderId).length > 0) { // check for order id length
                let rp_obj = {
                  rpay_okey: this.rozar_orderId,
                  rpay_imgpath: "https://kumuduapps.in:8443/logo/" + this.data.storeID + "/favicon.png",
                  rpay_transid: this.scheme.member_id + "-" + this.scheme.currentInstalment,
                  rpay_storeId: this.data.storeID,
                  rpay_branch: this.scheme.branch,
                  rpay_memId: this.scheme.MemberId
                };
                //console.log("rpay_imgpath : " + rp_obj.rpay_imgpath)
                let pg_ord_Ins = {
                  "orderId": this.rozar_orderId,
                  "MemberId": this.scheme.member_id,
                  "Amount": this.scheme.schemeToPayAmount,
                  "Receipt": this.scheme.member_id + "-" + this.scheme.currentInstalment
                };
                //this.apiClient.pg_order_track_insert(pg_ord_Ins).then(result => { // order id insert call
                //  console.log("order track inserted")
                this.isAuthorize = false;
                //this.payWithRazor_hdfc  [Before this was used]
                this.RazorPay_WithOptions(rp_obj, pg_obj).then(result => { // payment gateway call
                  this.disabled = !this.disabled;
                  let rpaySign: any
                  let res: any
                  res = result
                  let names = res.split("|");
                  let det = {
                    res_pay_id: names[0],
                    res_sign: names[1],
                    res_ord_id: this.rozar_orderId,
                    secret: this.data.razorpay_key_secret
                  }
                  rpaySign = names[1];
                  obj.pay_sign = rpaySign;
                  let pay_newId: any // = det.res_pay_id
                  let pay_res1 = {
                    res_pay_id: det.res_pay_id,
                    res_ord_id: det.res_ord_id,
                    res_sign: det.res_sign,
                    res_storeId: obj.storeID,
                    res_branch: obj.branch,
                    res_memid: obj.member_id
                  }
                  if (this.data.razorpay_std == "1") {
                    this.apiClient.InsertPaySignRecords(pay_res1).then(result => {
                      console.log("RecUpdated :" + result)
                    });
                  }
                  this.apiClient.verifySign(det).then(result => { // verify sign
                    let res = result;
                    //alert("Verification :" + res)
                    if (res == "" || res == null || res == "0" || res == undefined) { //check for is verify -false then
                      pay_newId = null;
                      //alert("Verification failed.. Payment Failed")

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
                    } else {  // verification of signature true
                      pay_newId = det.res_pay_id

                      //verifySign         
                      if (pay_newId == null || pay_newId == "" || pay_newId == 0 || pay_newId == "0" || pay_newId == " ") { //check for payment id length
                        console.log("unsuccessfull");
                        console.log("payy_newId : " + pay_newId);
                      } else {
                        obj.order_Iid = this.rozar_orderId;
                        obj.pay_Iid = pay_newId;

                        console.log("successfull");
                        console.log("payy_newId on sucess : " + pay_newId);
                        this.apiClient.showLoader();
                        this.apiClient.makePayment(obj).then(result => { // insert member_ledger api call
                          if (result != "" || result != null || result != null) { // check for voucher number len > 0


                            obj['voucher'] = result;
                            console.log("voucherno :" + result);

                            obj['agent_name'] = this.data.loggedInUserObj['agent_name'];
                            obj['pmode'] = obj['mode'];
                            obj['gross_wt'] = obj['grossWt'];
                            obj['rate'] = obj['goldRate'];
                            if (this.scheme.PayInstall > 1) {
                              obj['PaidIntall'] = (this.scheme.currentInstalment) + " - " + (this.scheme.currentInstalment + (this.scheme.PayInstall - 1));
                            } else {
                              obj['PaidIntall'] = this.scheme.currentInstalment;
                            }
                            obj['PrevBal'] = this.amountCollected;
                            obj['PrevGold'] = this.goldCollected;
                            obj['CurrBal'] = this.amountCollected + this.scheme.schemeToPayAmount;
                            obj['CurrGold'] = this.goldCollected + this.scheme.g_balance;
                            obj['voucher_date'] = new Date().toLocaleDateString();
                            console.log("Print OBJ :" + obj)
                            //here need to pass - update pg_order_track
                            let ord_track = {
                              'voucher': result,
                              'orderid': this.rozar_orderId,
                              'paymentid': pay_newId,
                              'MemberId': this.scheme.member_id,
                              'pay_signature': rpaySign
                            };
                            this.apiClient.pg_order_track_update(ord_track).then(result => { //if member_ledger insert success then
                              console.log("order track updated")
                            });
                            try {
                              this.GetLocation_Onlyccords();
                              obj.latitude = this.geoLatitude + "";
                              obj.longitude = this.geoLongitude + "";
                            } catch (e) {

                            }
                            try {
                              this.geo_address2 = "";
                              console.log("GeoAddress:" + obj.latitude + " - " + obj.longitude)
                              //this.getGeoencoder(obj.latitude, obj.longitude)
                              this.getGeoencoder(obj.latitude, obj.longitude).then(result => {
                                console.log("geoadd:" + this.geo_address1)
                                console.log("geoadd2:" + this.geo_address2)
                                console.log("geoplace:" + this.geo_place)

                                obj.location = this.geo_address2 + "";
                              });
                            } catch (e) {

                            }
                            console.log("GeoAddress:" + this.geo_address2)
                            obj['location'] = this.geo_address2

                            this.apiClient.dismissLoader();
                            this.data.printMessage = this.data.paymentSuccessPrintMsg(obj);
                            let displayData = " " + result + "\n "
                              + "Order Id : " + this.rozar_orderId + "\n "
                              + "Payment Id : " + pay_newId + "\n "
                              + "Amount : " + this.scheme.schemeToPayAmount + "\n "
                              + "Member : " + this.scheme.mgroup + "-" + this.scheme.member_no + ""
                            this.navCtrl.push(PaymentSuccessPage, { 'voucherNo': displayData });
                          } else { //if voucher number empty then alert msg
                            let alert = this.alertCtrl.create({
                              title: 'Save Failed.. Contact Shop..',
                              message: 'Save Failed ' + this.scheme.scheme_amount,
                              buttons: [{
                                text: 'Ok',
                                role: 'ok',
                                handler: () => {
                                  console.log('Cancel clicked'); this.apiClient.dismissLoader();
                                }
                              }]
                            });
                            alert.present();
                            this.scheme.schemeToPayAmount = this.scheme.scheme_amount;
                          } // check for voucher number length > o
                        }); // insert member ledger api call ends
                      }  // check for payment id length ends
                    } // order - pay signature verification ends
                  }); // verify sign api call ends
                }); // payment gateway api call ends
                // }); // order id insert api call ends
              }  // order id len check ends
            }); // order id generate ends
          } // Payment Gateway
        } else {  // pay with cash
          if (obj["extracash"] == undefined) {
            obj["extracash"] = "0";
          }
          if (obj["cardchq"] == undefined) {
            obj["cardchq"] = "0";
          }

          console.log("without online payment");
          this.apiClient.showLoader();
          console.log("obj");
          console.log(obj);
          this.apiClient.makePayment(obj).then(result => {
            if (result != "" || result != null || result != null) {
              obj['voucher'] = result;
              obj['agent_name'] = this.data.loggedInUserObj['agent_name'];
              obj['pmode'] = obj['mode'];
              obj['gross_wt'] = obj['grossWt'];
              obj['rate'] = obj['goldRate'];
              if (this.scheme.PayInstall > 1) {
                obj['PaidIntall'] = (this.scheme.currentInstalment) + " - " + (this.scheme.currentInstalment + (this.scheme.PayInstall - 1));
              } else {
                obj['PaidIntall'] = this.scheme.currentInstalment;
              }
              obj['PrevBal'] = this.amountCollected;
              obj['PrevGold'] = this.goldCollected;
              obj['CurrBal'] = this.amountCollected + this.scheme.schemeToPayAmount;
              obj['CurrGold'] = this.goldCollected + this.scheme.g_balance;
              obj['voucher_date'] = new Date().toLocaleDateString();
              console.log("Print OBJ :" + obj)
              try {
                this.GetLocation_Onlyccords();
                obj.latitude = this.geoLatitude + "";
                obj.longitude = this.geoLongitude + "";
              } catch (e) {

              }
              try {
                this.geo_address2 = "";
                console.log("GeoAddress:" + obj.latitude + " - " + obj.longitude)
                //this.getGeoencoder(obj.latitude, obj.longitude)
                this.getGeoencoder(obj.latitude, obj.longitude).then(result => {
                  console.log("geoadd:" + this.geo_address1)
                  console.log("geoadd2:" + this.geo_address2)
                  console.log("geoplace:" + this.geo_place)

                  obj.location = this.geo_address2 + "";
                });
                //this.getGeoencoder(obj.latitude, obj.longitude)
              } catch (e) {

              }
              console.log("GeoAddress:" + this.geo_address2)
              obj['location'] = this.geo_address2
              this.apiClient.dismissLoader();
              this.data.printMessage = this.data.paymentSuccessPrintMsg(obj);
              this.navCtrl.push(PaymentSuccessPage, { 'voucherNo': result });
            } else {
              let alert = this.alertCtrl.create({
                title: 'Save Failed.. Contact Shop..',
                message: 'Save Failed ' + this.scheme.scheme_amount,
                buttons: [{
                  text: 'Ok',
                  role: 'ok',
                  handler: () => {
                    console.log('Cancel clicked'); this.apiClient.dismissLoader();
                  }
                }]
              });
              alert.present();
              this.scheme.schemeToPayAmount = this.scheme.scheme_amount;
            }
          });
        }
      } else {  //Multiples scheme amt else
        console.log("this.isflexigroup :" + this.isflexigroup)
        let alert = this.alertCtrl.create({
          title: 'Amount Not Accepted',
          message: 'Amount can only be multiples of ' + this.scheme.scheme_amount,
          buttons: [{
            text: 'Ok',
            role: 'ok',
            handler: () => {
              console.log('Cancel clicked'); this.apiClient.dismissLoader();
            }
          }]
        });
        alert.present();
        this.scheme.schemeToPayAmount = this.scheme.scheme_amount;
        this.disabled = !this.disabled;
      } // Multiples scheme amt check ends
    } // validation Check ends
  } //goto payment page

  /*
  onAmountChange() {
    //  console.log("scheme.schemeToPayAmount :" + this.scheme.schemeToPayAmount)
    //  console.log("scheme.scheme.AMOUNT :" + this.scheme.AMOUNT)
    this.scheme.g_balance = (this.scheme.schemeToPayAmount / this.scheme.store_gold_rate).toFixed(3);

  }
  old code, blindly calculating gold balance
*/
onAmountChange() {
  //  console.log("scheme.schemeToPayAmount :" + this.scheme.schemeToPayAmount)
  //  console.log("scheme.scheme.AMOUNT :" + this.scheme.AMOUNT)

  if (this.scheme.gold_scheme == "1") {
    this.scheme.g_balance = (this.scheme.schemeToPayAmount / this.scheme.store_gold_rate).toFixed(3);
  } else {
    this.scheme.g_balance = 0;
  }


}

  PayInstall() {

  }
  incrementQty() {
    console.log(this.scheme.PayInstall + 1);
    if ((this.scheme.PayInstall + 1) > this.scheme.instal_limit_permonth && this.scheme.instal_limit_permonth > 0) {
      let alert = this.alertCtrl.create({
        title: 'Monthly Install Limit Exceeds',
        message: 'Only ' + this.scheme.instal_limit_permonth + " Installments allowed Per Month",
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
      this.scheme.PayInstall = this.scheme.PayInstall + 1;
      this.scheme.schemeToPayAmount = this.scheme.scheme_amount * this.scheme.PayInstall;
      //this.scheme.g_balance = (this.scheme.schemeToPayAmount / this.scheme.store_gold_rate).toFixed(3);
      if (this.scheme.gold_scheme == "1") {
        this.scheme.g_balance = (this.scheme.schemeToPayAmount / this.scheme.store_gold_rate).toFixed(3);
      } else {
        this.scheme.g_balance = 0;
      }
    
    }
  }

  decrementQty() {
    if (this.scheme.PayInstall - 1 < 1) {
      this.scheme.PayInstall = 1
      console.log("1->" + this.scheme.PayInstall);
    } else {
      this.scheme.PayInstall -= 1;
      console.log("2->" + this.scheme.PayInstall);
      //this.scheme.PayInstall = this.scheme.PayInstall-1;

    }
    this.scheme.schemeToPayAmount = this.scheme.scheme_amount * this.scheme.PayInstall;
    //this.scheme.g_balance = (this.scheme.schemeToPayAmount / this.scheme.store_gold_rate).toFixed(3);
    if (this.scheme.gold_scheme == "1") {
      this.scheme.g_balance = (this.scheme.schemeToPayAmount / this.scheme.store_gold_rate).toFixed(3);
    } else {
      this.scheme.g_balance = 0;
    }
  
  }

  print(obj) {
    console.log(obj);
    obj.voucher = obj.voucher_no;
    obj.amount_collected = obj.amount;
    obj.group_id = obj.mcode;
    obj.agentName = obj.ent_by;
    obj.customerMobileNumber = obj.mobile;
    obj.mcode = obj.mgroup + "-" + obj.member_no;
    obj.agent_name = obj.ent_by;
    obj.PrevBal = obj.CurInstlAmt - obj.amount;
    obj.PrevGold = obj.CurInstlGrs - obj.gross_wt;

    obj.CurrBal = obj.CurInstlAmt;
    obj.CurrGold = obj.CurInstlGrs;
    obj.pmode = obj.pmode;

    obj.PaidIntall = obj.CurInstlCnt

    console.log("obj.latitude:" + obj.usrlatitude)
    console.log("obj.longitude:" + obj.usrlongitude)
    if (obj.usrlatitude != undefined && obj.usrlongitude != undefined) {
      try {
        //this.getGeoencoder(obj.latitude, obj.longitude)
        this.geo_address2 = "";
        console.log("GeoAddress:" + obj.usrlatitude + " - " + obj.usrlongitude)
        // try {
        this.getGeoencoder(obj.usrlatitude, obj.usrlongitude).then(result => {
          // this.generateAddress(result[0]).then(result => {
          console.log("geoadd:" + this.geo_address1)
          console.log("geoadd2:" + this.geo_address2)
          console.log("geoplace:" + this.geo_place)
          obj.location = this.geo_address2 + "";
          console.log("With Location");
          console.log(obj);
          this.data.printMessage = this.data.paymentSuccessPrintMsg(obj) ; //+ "\n         "
          console.log(this.data.printMessage);
          let profileModal = this.modalCtrl.create(PrinterListPage);
          profileModal.present();
          // })
        });
        // } catch (e) {
        //   console.log("With  Err");
        // }
      } catch (e) {
        console.log("With out Location - catch eee");
        console.log(obj);
        this.data.printMessage = this.data.paymentSuccessPrintMsg(obj) ; //+ "\n         "
        console.log(this.data.printMessage);
        let profileModal = this.modalCtrl.create(PrinterListPage);
        profileModal.present();
      }
    } else {

      obj.location = ""
      console.log("With out Location");
      console.log(obj);
      this.data.printMessage = this.data.paymentSuccessPrintMsg(obj) ; //+ "\n         "
      console.log(this.data.printMessage);
      let profileModal = this.modalCtrl.create(PrinterListPage);
      profileModal.present();
    }
    //obj.location = "test location"

  }

  payWithRazor_hdfc(obj, pg_obj) {
    return new Promise((resolve, reject) => {
      if (this.scheme.email == undefined) {
        this.scheme.email = this.store_email_for_pg
      }

      if (this.scheme.mobile == undefined) {
        this.scheme.mobile = "0"
      }

      var isBackPress: Boolean = true
      this.isAuthorize = false;
      var pageContent = "<form id = 'MyForm' method=\"POST\" action=\"https://api.razorpay.com/v1/checkout/embedded\">" +
        "<input type=\"hidden\" name=\"key_id\" value=\"" + this.data.razorpay_key_id + "\"> " +
        "<input type=\"hidden\" name=\"order_id\" value=\"" + obj.rpay_okey + "\">" +
        "<input type=\"hidden\" name=\"amount\" value=\"" + (this.scheme.schemeToPayAmount * 100) + "\">" +
        "<input type=\"hidden\" name=\"name\" value=\"" + (this.scheme.name + "") + "\">" +
        "<input type=\"hidden\" name=\"description\" value=\"" + this.scheme.store_name + " Gold Advance Purchase Payment " + "\">" +
        "<input type=\"hidden\" name=\"prefill[email]\" value=\"" + this.scheme.email + "\"> " +
        "<input type=\"hidden\" name=\"prefill[contact]\" value=\"" + this.scheme.mobile + "\">" +
        "<input type=\"hidden\" name=\"notes[transaction_id]\" value=\"" + obj.rpay_transid + "\">" +
        "<input type=\"hidden\" name=\"callback_url\" value=\"https://kumuduapps.in:8443/hdfcRpayResponse.jsp\">" +
        "<button>Submit</button> </form> " +
        " <script type=\"text/javascript\">document.getElementById(\"MyForm\").submit();</script> "

      var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);
      let theOtherUrl = "https://kumuduapps.in:8443/hdfcRpayResponse.jsp" // "http://wat.randr-it-solutions.com/test.php"
      let browserRef: any = [];
      browserRef = this.iab.create(
        pageContentUrl,
        "_self",
        "hidden=no,location=no"
      )

      browserRef.on('loadstart').subscribe((event) => {
        //console.log(event.url);
        if (event.url.includes("paysuccess.jsp")) {
          // console.log("paysuccess :" + event.url)
          let Myurl = event.url
          var regex = /[?&]([^=#]+)=([^&#]*)/g,
            url = Myurl,
            params: any = [],
            match;
          while (match = regex.exec(url)) {
            params[match[1]] = match[2];
          }
          //console.log(params);
          //console.log(params.razorpay_order_id);
          //console.log(params.razorpay_signature);
          //console.log(params.razorpay_payment_id);

          var pay_iid: any = params.razorpay_payment_id
          var order_iid: any = params.razorpay_order_id
          var signature: any = params.razorpay_signature
          this.rz_pay_res_id = params.razorpay_payment_id
          this.rz_pay_res_ordid = params.razorpay_order_id
          this.rz_pay_res_signid = params.razorpay_signature
          let pay_res1 = {
            res_pay_id: params.razorpay_payment_id,
            res_ord_id: params.razorpay_order_id,
            res_sign: params.razorpay_signature
          }
          let res: string = params.razorpay_payment_id + "|" + params.razorpay_signature
          browserRef.close();
          resolve(res)
        }



      });

      browserRef.on('loadstop').subscribe((event) => {
        //console.log(event.url);
        //Check Wether Payment is Authorized!!
        if (event.url.includes("authorized")) {
          this.isAuthorize = true;
          isBackPress = false;
          console.log("authorized")
        }

        if (event.url.includes("status=failed")) {
          this.isAuthorize = false;
          isBackPress = false;
          console.log("failed")
          browserRef.close();
          resolve("0");
          reject("0");
        }

        // Checking Wether current Loaded Url Is CallBack URL
        if (event.url == theOtherUrl) {
          console.log("Match");
        }
        browserRef.on("exit").subscribe((e) => {
          if (isBackPress == true) {
            console.log("Browser Closed");
            resolve("0");
            reject("0");
          }
        });
      });




    })
  };

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

  payWithRazor(obj, pg_obj) {
    return new Promise((resolve, reject) => {
      var options = {
        description: "City Gold Fashion Jewellery", //this.scheme.store_name , //'Scheme App Payment',
        // image: obj.rpay_imgpath ,//"http://jms.asterixtechnology.com/logo/" + pg_obj.storeID + "/favicon.png" ,// 'https://i.imgur.com/3g7nmJC.png',
        currency: "INR",
        key: this.data.razorpay_key_id,
        amount: (this.scheme.schemeToPayAmount * 100),
        order_id: obj.rpay_okey,
        name: "HDFC VAS", //this.scheme.store_name,
        notes: {
          transaction_id: obj.rpay_transid
        },
        prefill: {
          email: this.scheme.email,
          contact: this.scheme.mobile,
          name: this.scheme.name
        },
        theme: {
          color: '#F37254'
        },
        modal: {
          ondismiss: function () {
            alert('dismissed')
          }
        }
      };

      var successCallback = function (success) {
        //alert('payment_id: ' + success.razorpay_payment_id)
        var pay_iid: any = success.razorpay_payment_id
        var order_iid: any = success.razorpay_order_id
        var signature: any = success.razorpay_signature
        this.rz_pay_res_id = success.razorpay_payment_id
        this.rz_pay_res_ordid = success.razorpay_order_id
        this.rz_pay_res_signid = success.razorpay_signature
        let pay_res1 = {
          res_pay_id: success.razorpay_payment_id,
          res_ord_id: success.razorpay_order_id,
          res_sign: success.razorpay_signature
        }
        let res: string = success.razorpay_payment_id + "|" + success.razorpay_signature
        /*
        alert("rz_pay_res_id : " + pay_res1.res_pay_id)
        this.apiClient.verifySign(pay_res1).then(result => {
          let res = result;
          alert("Verification :" + res)
          resolve(success.razorpay_payment_id);
        })
        */
        //alert(res)
        resolve(res)
        //return  new Promise((resolve, reject)
        //alert('signature: ' + success.razorpay_signature)

        //console.log("On SucessCall :" + pg_obj.agent_id);
        // resolve(payment_id);
      };

      var cancelCallback = function (error) {
        //alert(error.description + ' (Error ' + error.code + ')');
        resolve("0");
        reject("0");
      };

      console.log("RazorPayCheckuot")
      // RazorpayCheckout.open(options,successCallback,cancelCallback)
      RazorpayCheckout.on('payment.success', successCallback)
      RazorpayCheckout.on('payment.cancel', cancelCallback)
      RazorpayCheckout.open(options)

    });
  }

  //Easypay_Axis
  Easypay_Axis(obj, encrypt_str) {
    return new Promise((resolve, reject) => {
      if (this.data.razorpay_std == "2") {
        if (this.scheme.email == undefined) {
          this.scheme.email = this.store_email_for_pg
        }
        if (this.scheme.mobile == undefined) {
          this.scheme.mobile = "0"
        }
        var isBackPress: Boolean = true
        this.isAuthorize = false;

        console.log("getEpayEncrypt : " + encrypt_str);

        var pageContent = ""
        var encryptdatatopass = encrypt_str; // "1qXjUu/q9OSiUTCTTH2i3V6blJal1lUYu/4tzwl+bBGjLvWceckkQpSfqs4uhLrrWiFjkulKxpgANing+ZWB1TGPIgpgqto6ucfNz5gYvJx6yNJ6Zwzzyf5nYd5ySR38BTJcN3/dCgcqcNbHEbrjg+WFmQbaMj8TSW8pkuHIj7fweVUgrGt/fSe+OiWIYbFFWcZ72B7yQVBs8smj9Avl8lWhyYKuDFHEzL+cafQHvqHBDPH4NL6MIoHY6ke7zeI70PhDhQsPIS1tBz/YY9UoiztKLhXqK1u2VYpYdQ0AkhyxvknSabp+HfRCVmdtqnP3SRU7W5Vzt0pEGAtldp64xyDXz5KrDK+3iCgFYNH2f3YU20NHJV1hEcVuKlqdBuvGBFRNo1E/M8Ob88RbNZQaWQ==";
        var payurl = this.data.esypay_url; //this.pgateway.esypay_url; // "https://kumuduapps.in:8443/AxisEasyPayReDirect.jsp" // "https://uat-etendering.axisbank.co.in/easypay2.0/frontend/index.php/api/payment"
        console.log("payur : " + payurl)
        console.log("INSIDE EasyPay")

        pageContent = "<form id = 'MyForm' method=\"POST\" action=\"" + payurl + "\">" +
          "<input type=\"hidden\" name=\"i\" value=\"" + encryptdatatopass + "\"> " +
          "<button>Submit</button> </form> " +
          " <script type=\"text/javascript\">document.getElementById(\"MyForm\").submit();</script> ";

        var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);
        let theOtherUrl = "\'" + this.data.razorpay_callbackurl + "\'"
        let browserRef: any = [];
        browserRef = this.iab.create(
          pageContentUrl,
          "_self",
          "hidden=no,location=no"
        )

        browserRef.on('loadstart').subscribe((event) => {
          console.log('event.url');
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
            var axis_response = params.axis_response;
            if (axis_response != null || axis_response != "" || axis_response != undefined) {
              let pg_robj = {
                epay_resp: axis_response + ""
              }
              this.apiClient.getEpayDecrypt(pg_robj).then(result => {
                console.log("Result :" + result)
                let res: any;
                res = result;
                browserRef.close();
                resolve(res)
              });
            } else {
              resolve("0");
            }
          }
        });

        browserRef.on('loadstop').subscribe((event) => {
          console.log('event.url');
          console.log(event.url);
          console.log("loadstop");
          if (event.url.includes("authorized")) {
            this.isAuthorize = true;
            isBackPress = false;
            console.log("authorized")
          }

          if (event.url.includes("status=failed")) {
            console.log('event.url');
            console.log(event.url);
            this.isAuthorize = false;
            isBackPress = false;
            console.log("failed")
            browserRef.close();
            resolve("0");
            reject("0");
          }

          // Checking Wether current Loaded Url Is CallBack URL
          if (event.url == theOtherUrl) {
            console.log("Match");
          }
          browserRef.on("exit").subscribe((e) => {
            if (isBackPress == true) {
              console.log("Browser Closed");
              resolve("0");
              reject("0");
            }
          });
        });

      }


    });
  };

  RazorPay_WithOptions(obj, pg_obj) {
    return new Promise((resolve, reject) => {
      //Here to Check the Integration type




      if (this.data.razorpay_std == "0") {
        console.log("o razor pay if");
      
        if (this.scheme.email === undefined) {
          this.scheme.email = this.store_email_for_pg;
        }
        if (this.scheme.mobile === undefined) {
          this.scheme.mobile = "0";
        }
      
        let isBackPress: Boolean = true;
        this.isAuthorize = false;
      
        const pageContent = `
        <form id="MyForm" method="POST" action="https://api.razorpay.com/v1/checkout/embedded">
          <input type="hidden" name="key_id" value="${this.data.razorpay_key_id}">
          <input type="hidden" name="order_id" value="${obj.rpay_okey}">
          <input type="hidden" name="amount" value="${this.scheme.schemeToPayAmount * 100}">
          <input type="hidden" name="name" value="${this.scheme.name}">
          <input type="hidden" name="description" value="${this.scheme.store_name} Gold Advance Purchase Payment">
          <input type="hidden" name="prefill[email]" value="${this.scheme.email}">
          <input type="hidden" name="prefill[contact]" value="${this.scheme.mobile}">
          <input type="hidden" name="notes[transaction_id]" value="${obj.rpay_transid}">
          <input type="hidden" name="callback_url" value="https://kumuduapps.in:8443/hdfcRpayResponse.jsp">
          <button>Submit</button>
        </form>
        <script type="text/javascript">
          document.getElementById("MyForm").submit();
        </script>`;
      
      const pageContentEncoded = encodeURIComponent(pageContent);
      const pageContentUrl = `data:text/html;charset=utf-8,${pageContentEncoded}`;
      const theOtherUrl = "https://kumuduapps.in:8443/hdfcRpayResponse.jsp";
        let browserRef: any = this.iab.create(pageContentUrl, "_self", "hidden=no,location=no");
      
        browserRef.on('loadstart').subscribe((event) => {
          console.log("Load Start: " + event.url);
      
          // Log the URL to understand what is being loaded
          console.log("Event URL: " + event.url);
      
          if (event.url.includes("paysuccess.jsp")) {
            console.log("Payment Success URL Detected: " + event.url);
      
            let Myurl = event.url;
            let regex = /[?&]([^=#]+)=([^&#]*)/g, url = Myurl, params: any = {}, match;
            while (match = regex.exec(url)) {
              params[match[1]] = match[2];
            }
      
            console.log("Payment ID: " + params.razorpay_payment_id);
            console.log("Order ID: " + params.razorpay_order_id);
            console.log("Signature: " + params.razorpay_signature);
      
            this.rz_pay_res_id = params.razorpay_payment_id;
            this.rz_pay_res_ordid = params.razorpay_order_id;
            this.rz_pay_res_signid = params.razorpay_signature;
      
            const pay_res1 = {
              res_pay_id: params.razorpay_payment_id,
              res_ord_id: params.razorpay_order_id,
              res_sign: params.razorpay_signature
            };
      
            const res: string = params.razorpay_payment_id + "|" + params.razorpay_signature;
            browserRef.close();
            resolve(res);
      
          } else {
            console.warn("Unexpected URL: " + event.url);
            // alert("Unexpected URL detected during payment processing. Please check the console for details."+ event.url);
          }
        }, (error) => {
          console.error("Error during loadstart: ", error);
          // alert("An error occurred while processing the payment: " + error.message);
          browserRef.close();
          reject("0");
        });
      
        browserRef.on('loadstop').subscribe((event) => {
          console.log("Load Stop: " + event.url);
      
          if (event.url.includes("authorized")) {
            this.isAuthorize = true;
            isBackPress = false;
            console.log("Payment Authorized");
      
          } else if (event.url.includes("status=failed")) {
            this.isAuthorize = false;
            isBackPress = false;
            console.log("Payment Failed");
            alert("Payment failed. Please try again.");
            browserRef.close();
            resolve("0");
            reject("0");
      
          } else if (event.url === theOtherUrl) {
            console.log("Callback URL matched: " + event.url);
          }
        }, (error) => {
          console.error("Error during loadstop: ", error);
          // alert("An error occurred after the payment was processed: " + error.message);
          browserRef.close();
          reject("0");
        });
      
        browserRef.on("exit").subscribe((e) => {
          if (isBackPress) {
            console.log("Browser Closed by User");
            // alert("Payment process was canceled. Please try again.");
            resolve("0");
            reject("0");
          }
        }, (error) => {
          console.error("Error during browser exit: ", error);
          // alert("An error occurred when closing the browser: " + error.message);
          reject("0");
        });
      }
      
      
      
      
      else {


        console.log("o razor pay else");
        //Here Starts the RazorPay Standered Integration
        var options = {
          description: this.scheme.store_name, // "City Gold Fashion Jewellery", //this.scheme.store_name , //'Scheme App Payment',
          image: obj.rpay_imgpath, //"http://jms.asterixtechnology.com/logo/" + pg_obj.storeID + "/favicon.png" ,// 'https://i.imgur.com/3g7nmJC.png',
          currency: "INR",
          key: this.data.razorpay_key_id,
          amount: (this.scheme.schemeToPayAmount * 100),
          order_id: obj.rpay_okey,
          name: this.scheme.store_name, // "HDFC VAS", //this.scheme.store_name,
          notes: {
            transaction_id: obj.rpay_transid
          },
          prefill: {
            email: this.scheme.email,
            contact: this.scheme.mobile,
            name: this.scheme.name
          },
          theme: {
            color: '#F37254'
          },
          modal: {
            ondismiss: function () {
              alert('dismissed')
            }
          }
        };

        var successCallback = function (success) {
          //alert('payment_id: ' + success.razorpay_payment_id)
          var pay_iid: any = success.razorpay_payment_id
          var order_iid: any = success.razorpay_order_id
          var signature: any = success.razorpay_signature
          this.rz_pay_res_id = success.razorpay_payment_id
          this.rz_pay_res_ordid = success.razorpay_order_id
          this.rz_pay_res_signid = success.razorpay_signature
          let pay_res1 = {
            res_pay_id: success.razorpay_payment_id,
            res_ord_id: success.razorpay_order_id,
            res_sign: success.razorpay_signature,
            res_storeId: obj.rpay_storeId,
            res_branch: obj.rpay_branch,
            res_memid: obj.rpay_memId
          }
          let res: string = success.razorpay_payment_id + "|" + success.razorpay_signature
          //Here to pass razor order Id , payment id And Signature to server by post method
          //this.apiClient.InsertPaySignRecords(pay_res1).then(result => {
          resolve(res)
          //});

        };

        var cancelCallback = function (error) {
          //alert(error.description + ' (Error ' + error.code + ')');
          resolve("0");
          reject("0");
        };

        console.log("RazorPayCheckuot")
        RazorpayCheckout.on('payment.success', successCallback)
        RazorpayCheckout.on('payment.cancel', cancelCallback)
        RazorpayCheckout.open(options)
      } //If condition Closes


      
    });
  }

  getGeoencoder(latitude, longitude) {
    return new Promise((resolve, reject) => {
      console.log("inside address1")
      this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
        .then((result: NativeGeocoderReverseResult[]) => {
          console.log("latitude : " + latitude + "-" + longitude)
          // this.generateAddress(result[0]).then(result => {
          //   resolve("1");
          // })

          let addressObj = result[0];
          console.log("inside address2")
          let obj = [];
          let address = "";
          for (let key in addressObj) {
            obj.push(addressObj[key]);
          }
          obj.reverse();
          this.geo_address1 = (obj[0] + " " + obj[1]).trim()
          this.geo_address2 = (obj[2] + " " + obj[3] + " " + obj[4]).trim()
          this.geo_place = obj[6]
          console.log("geo_address1 : " + this.geo_address1)
          console.log("geo_address2 : " + this.geo_address2)
          console.log("geo_place : " + this.geo_place)
          resolve("1");
        })
        .catch((error: any) => {
          alert('Error getting location' + JSON.stringify(error));
        });
    });
  }

  //Return Comma saperated address
  generateAddress(addressObj) {
    return new Promise((resolve, reject) => {
      console.log("inside address2")
      let obj = [];
      let address = "";
      for (let key in addressObj) {
        obj.push(addressObj[key]);
      }
      obj.reverse();
      this.geo_address1 = (obj[0] + " " + obj[1]).trim()
      this.geo_address2 = (obj[2] + " " + obj[3] + " " + obj[4]).trim()
      this.geo_place = obj[6]
      console.log("geo_address1 : " + this.geo_address1)
      console.log("geo_address2 : " + this.geo_address2)
      console.log("geo_place : " + this.geo_place)
      resolve("1");
      //   this.geo_pin = obj[7]
      //    this.registerObj.address1 = this.geo_address1
      //  this.registerObj.address2 = this.geo_address2
      //    this.registerObj.place = this.geo_place
      //    this.registerObj.pincode = this.geo_pin
    });
  }

  setFocus(nextElement) {
    nextElement.setFocus();
  }

  CaclCardChqAmt() {
    if (+this.scheme.extracash <= +this.scheme.schemeToPayAmount) {
      let crdchq = +this.scheme.schemeToPayAmount - (+this.scheme.extracash)
      this.scheme.cardchq = crdchq;
    } else {
      let alert = this.alertCtrl.create({
        title: 'Cash Amt Exceeds',
        message: 'Enter Cash Amount Less than Credit Card / Neft / Cheque Amt',
        buttons: [{
          text: 'Ok',
          role: 'ok',
          handler: () => {
            console.log('Cancel clicked'); this.apiClient.dismissLoader();
          }
        }]
      });
      alert.present();
      this.scheme.extracash = 0;
    }

  }

}
