import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
@Injectable()
export class DataProvider {

  constructor(public http: HttpClient, private storage: Storage) {
  }

  public login_selector: string = "page-login-blue";

  public razorpay_merchant_id: string = '';
  public razorpay_merchant_name: string = '';
  public razorpay_key_id: string = '';
  public razorpay_key_secret: string = '';
  public razorpay_url: string = '';
  public razorpay_posturl: string = '';
  public razorpay_callbackurl: string = '';
  public razorpay_std: string = '1';

  public esypay_merchant_id: string = '';
  public esypay_ChecksumKey: string = '';
  public esypay_version: string = '';
  public esypay_url: string = '';
  public esypay_callback: string = '';
  public esypay_type: string = "";

  public userLoginType = '';
  public loggedInUserObj = {};
  public agentID = '';
  public printMessage = '';
  public environment = 'dev' ; // 'dev';
  public payTM = {
    'merchantID': 'ASTERI40411335158702', 'merchanyKey': 'Xc%kqVt!a7TV2f0F', 'industry': 'Retail',
    'channelID': 'WAP', 'merchantPanel': 'https://securegw-stage.paytm.in/theia/processTransaction',
    'username': 'Asterix', 'password': 'QtsiUVT'
  };


  /*
  //public url: string = "http://18.219.232.103/api/";
  //private url: string = "http://192.168.0.7:8080/asterix-jms-api/api/";
  //public url: string = "http://jms.asterixtechnology.com/api/";

  public url: string = "http://192.168.43.210:8080/asterix-jms-api/api/";
  public url: string = "https://kumuduapps.in:8443/api/";
  //public url: string = "http://jms.asterixtechnology.com/api/";
  
  public url: string = "http://148.72.208.43/api/";
*/
  public url: string = "https://kumuduapps.in:8443/api/";
  // public url: string = "http://192.168.0.121:8080/asterix-jms-api/api/";
  //public url: string = "http://192.168.191.1:8080/asterix-jms-api/api/";
  //public url: string = "http://192.168.1.5:8080/asterix-jms-api/api/";
 // public url: string = "http://192.168.29.112:8080/asterix-jms-api/api/";

  public storeID: string = "4";
  public customersCanRegister: boolean = true;
  public membsearchterm: "";
  public print_userobj = {};

  //ionic cordova plugin add https://github.com/isathyam/CordovaPayTM.git --variable GENERATE_URL=http://192.168.0.7:8080/asterix-jms-api/api/schemes/paytmcsum --variable VERIFY_URL=http://192.168.0.7:8080/asterix-jms-api/api/schemes/paytmcsumValidate --variable MERCHANT_ID=Asteri15527685228015 --variable INDUSTRY_TYPE_ID=Retail --variable WEBSITE=http://asterixtechnologies.com
  //cordova plugin add git@github.com:Kkiranandroid/Paytm-integration-in-ios-ionic2-and-ionic3.git --variable GENERATE_URL=http://localhost:8080/asterix-jms-api/api/schemes/paytmcsum --variable VERIFY_URL=http://localhost:8080/asterix-jms-api/api/schemes/paytmcsum --variable MERCHANT_ID=Asteri15527685228015 --variable INDUSTRY_TYPE_ID=Retail --variable WEBSITE=http://asterixtechnologies.com
  setUserLoginType(type) {
    this.storage.set('userLoginType', type);
    this.userLoginType = type;
  }
  getUserLoginType() {
    return this.userLoginType;
  }

  setSearchterm(search) {
    this.membsearchterm = search;
  }

  getSearchTerM() {
    return this.membsearchterm;
  }

  set_user_printObj(obj) {
    this.storage.set('print_userobj', obj);
    this.print_userobj = obj;
    console.log("this.print_userobj");
    console.log(this.print_userobj)

  }



  getUser() {
    return this.loggedInUserObj;
  }
  setUser(obj) {
    this.storage.set('loggedInUserObj', obj);
    this.loggedInUserObj = obj;

  }
  getAgentID() {
    return this.agentID;
  }
  setAgentID(agentID) {
    this.agentID = agentID;
    this.storage.set("agentID", agentID)
  }
  paymentSuccessPrintMsg(obj) {
    
    console.log(obj);
    let BILL = "";
    console.log( "this.set_user_printObj");
    console.log( this.print_userobj);

    console.log(this.loggedInUserObj)
    console.log(this.loggedInUserObj['branchdet']);
    console.log(this.loggedInUserObj['store']);
    console.log(this.loggedInUserObj['store']['storeName']);
    console.log(this.loggedInUserObj['store']['storeAddress']);
    console.log(this.loggedInUserObj['store']['storeCity']);
    console.log('branch store name');
    console.log(this.print_userobj['store']['branch_storename'])

      BILL =
      " " + this.loggedInUserObj['store']['storeName'] + "\n" +" "
      BILL =
      BILL +"" + this.loggedInUserObj['store']['storeAddress'] + ',  '+  "\n" +" "
      BILL =
      BILL + this.loggedInUserObj['store']['storeCity'] + " Mobile:" + this.loggedInUserObj['store']['storeMobile'] + "\n" +" "
      
    //BILL =
      //" " + this.print_userobj['store']['branch_storename'] + "\n" +" "
      // data is missing so when the data is come form backend enable this code
      
      //  + this.print_userobj['branchdet']['branch_address'] + "\n" +
      // " " + this.print_userobj['branchdet']['branch_city'] + "\n" +
      // " Ph No : " + this.print_userobj['branchdet']['branch_mobile'] + "\n" +
      // // " DATE: " + new Date().toLocaleDateString() + "\n";
      // " DATE: " + (obj['voucher_date']) + "\n";
      BILL =
      BILL + " DATE: " + (obj['voucher_date']) + "\n";
    BILL = BILL
      + "-------------------------\n";

    BILL = BILL + " Voucher No:";
    BILL = BILL + " " + obj['voucher'];
    BILL = BILL + "\n";
    BILL = BILL
      + "-------------------------";
    BILL = BILL + "\n Collector:" + obj['agent_name'];
    BILL = BILL + "\n Group Code:" + obj['mcode'];
    BILL = BILL + "\n Name:" + obj['name'];
    BILL = BILL + "\n Customer Mobile:" + obj['customerMobileNumber'];
    BILL = BILL + "\n Installment NO:" + obj['PaidIntall'];
    if (obj.gross_wt > 0) {
      BILL = BILL
        + "\n------------------------\n";
      if (obj['rate'] > 500) {
        BILL = BILL + "Gold Saved :" + "" + (+obj.gross_wt).toFixed(3) + "gms\n";
        BILL = BILL + "Gold Rate :" + "" + (+obj['rate']).toFixed(2) + "\n";
      } else {
        BILL = BILL + "Silver Saved :" + "" + (+obj.gross_wt).toFixed(3) + "gms\n";
        BILL = BILL + "Silver Rate :" + "" + (+obj['rate']).toFixed(2) + "\n";
      }

      BILL = BILL
        + "---------------------------\n";
    }
    BILL = BILL
      + "\n------------------------\n";
    BILL = BILL + "Payment Mode:" + "" + this.getPayMode(obj['pmode']) + "\n";
    BILL = BILL + "Amount Paid:" + "" + obj['amount_collected'] + "\n";
    if (this.storeID == "32") {

    } else {

      BILL = BILL + "Previous Bal:" + "" + (+obj['PrevBal']).toFixed(3) + "\n";
      console.log("obj['PrevGold']" + obj['PrevGold'])
      if (obj.gross_wt > 0 && obj['PrevGold'] != undefined) {
        if (obj['rate'] > 500) {
          BILL = BILL + "Previous Gold Bal:" + "" + (+obj['PrevGold']).toFixed(3) + "\n";
        } else {
          BILL = BILL + "Previous Silver Bal:" + "" + (+obj['PrevGold']).toFixed(3) + "\n";
        }

      }

      BILL = BILL + "Total Bal:" + "" + (+obj['CurrBal']).toFixed(3) + "\n";
      if (obj.gross_wt > 0 && obj['CurrGold'] != undefined) {
        if (obj['rate'] > 500) {
          BILL = BILL + "Total Gold Bal:" + "" + (+obj['CurrGold']).toFixed(3) + "gms\n";
        } else {
          BILL = BILL + "Total Silver Bal:" + "" + (+obj['CurrGold']).toFixed(3) + "gms\n";
        }

      } else if (obj.gross_wt > 0) {
        if (obj['rate'] > 500) {
          BILL = BILL + "Total Gold Bal:" + "" + (+obj.gross_wt).toFixed(3) + "gms\n";
        } else {
          BILL = BILL + "Total Silver Bal:" + "" + (+obj.gross_wt).toFixed(3) + "gms\n";
        }
      }
    }
    if (obj.location != undefined && obj.location != "") {
      BILL = BILL + " Place:" + obj.location + "\n";
    }

    BILL = BILL
      + "---------------------------\n";
    BILL = BILL + "\n\n ";
    return BILL;
  }

  getPayMode(Mode) {
    if (Mode == 0) {
      return "Cash";
    } else if (Mode == 1) {
      return "Cheque";
    } else if (Mode == 2) {
      return "Credit Card";
    } else if (Mode == 6) {
      return "Debit Card";
    }
  }

  checkCutOff(start, end) {
    let sTime = moment(start, 'hh:mm:ss A');
    let eTime = moment(end, 'hh:mm:ss A');
    let cTime = moment();
    // 
    // console.log(sTime);
    // console.log(cTime);
    // console.log(eTime);
    // console.log(cTime.isBefore(eTime));
    // console.log(sTime.isBefore(cTime));
    // console.log(cTime.isBefore(eTime) && sTime.isBefore(cTime));
    return (cTime.isBefore(eTime) && sTime.isBefore(cTime));
  }
}
