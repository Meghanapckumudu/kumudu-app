import { DataProvider } from '../../providers/data/data';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { WebClientProvider } from '../../providers/web-client/web-client';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { RandomAPI } from './randomApi';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import 'rxjs/add/operator/map'
import { convertDataToISO } from 'ionic-angular/umd/util/datetime-util';

//import {pgHdfc} from 'cordova-plugin-PgHdfcVas';


/**
 * Generated class for the PrivacyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var RazorpayCheckout: any;
var inAppBrowserRef;
var posts: any;
declare var cordova: any;
interface Cordova {
  InAppBrowser: InAppBrowser
}



@IonicPage()
@Component({
  selector: 'page-testpay',
  templateUrl: 'testpay.html',
})

export class TestpayPage {
  private rz_pay_res_id: any;
  private rz_pay_res_ordid: any;
  private rz_pay_res_signid: any;
  //private scheme: any;
  private pgateway: any;
  private groupCode: any;
  private rozar_orderId: any;
  orderIdDet: any = [];
  pgResponse: any = []
  public disabled = false;

  constructor(public navCtrl: NavController, public navParams: NavParams
    , public data: DataProvider, public modalCtrl: ModalController,
    public apiClient: WebClientProvider, public iab: InAppBrowser, public http: HttpClient, ) {

    this.pgateway = {};


    this.groupCode = navParams.get('memberCode');

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

      console.log("razorpay_merchant_id :" + data.razorpay_merchant_id)
      console.log("razorpay_merchant_name :" + data.razorpay_merchant_name)
      console.log("razorpay_key_id :" + data.razorpay_key_id)
      console.log("razorpay_key_secret :" + data.razorpay_key_secret)
      console.log("razorpay_url :" + data.razorpay_url)
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad testpayPage');
  }

  razorpay1() {

  }

  razorpay() {
    let rp_obj = {
      rpay_okey: this.rozar_orderId,
      rpay_imgpath: "https://kumuduapps.in:8443/logo/" + this.data.storeID + "/favicon.png",
      rpay_transid: "215000083-4"
    };

    let pg_obj = {
      agent_id: this.data.agentID + "", scheme_id: 1 + "", group_id: 'A',
      tenure: "1", member_id: "215000083",
      amount_collected: "1000", mode: 'Card',
      grossWt: "1", goldRate: "4400", mcode: 'A',
      txDate: new Date().toISOString(), customerMobileNumber: '9731552442',
      name: 'Pallavi', chqNo: '123', storeID: this.data.storeID,
      branch: this.data.loggedInUserObj['branch'],
      order_Iid: "", pay_Iid: "", pay_sign: ""
    };

    console.log("calling Generic")

    this.payWithRazor(rp_obj, pg_obj).then(result => {
    })

  }

  payWithRazor(obj, pg_obj) {
    return new Promise((resolve, reject) => {
      console.log("RPay")
      var options = {
        description: "City Gold Fashion Jewellery", //this.scheme.store_name , //'Scheme App Payment',
        image: "https://s3.amazonaws.com/rzp-mobile/images/rzp.png", // "https://kumuduapps.in:8443/logo/21/favicon.png", // obj.rpay_imgpath ,//"http://jms.asterixtechnology.com/logo/" + pg_obj.storeID + "/favicon.png" ,// 'https://i.imgur.com/3g7nmJC.png',
        currency: "INR",
        key: this.data.razorpay_key_id,
        amount: (1000) * 100,
        order_id: "order_FHB0S5Dg75uoIC",//obj.rpay_okey,
        name: "HDFC VAS", //this.scheme.store_name,
        notes: {
          transaction_id: "215000083-4"//obj.rpay_transid 
        },
        prefill: {
          email: 'pallavi.s.shettigar@gmail.com',
          contact: '9731552442',
          name: 'pallavi'
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

        resolve(res)

      };

      var cancelCallback = function (error) {

        resolve("0");
        reject("0");
      };

      console.log("RazorPayCheckuot")
      // razorpay.open(options,successCallback,cancelCallback)
      RazorpayCheckout.on('payment.success', successCallback)
      RazorpayCheckout.on('payment.cancel', cancelCallback)
      RazorpayCheckout.open(options)

    });
  }

  payNew() {
    this.rozar_orderId = "";
    let rpay_obj = {
      rpay_amount: (1000 * 100) + "",
      rpay_currency: "INR",
      rpay_receipt: '215000083-4',
      rpay_MembId: '215000083',
      rpay_keyId: this.data.razorpay_key_id,
      rpay_KeySecret: this.data.razorpay_key_secret
    };
    this.rozar_orderId = "";

    this.apiClient.orderId_Generate(rpay_obj).then(result => {  //order id generate
      this.orderIdDet = result;
      let jsonOrd = JSON.parse(this.orderIdDet.OrderID)
      this.rozar_orderId = jsonOrd.id;
      console.log(jsonOrd.id);
      console.log(this.orderIdDet.OrderID);
      console.log("Len:" + (this.rozar_orderId).length);
      if ((this.rozar_orderId).length > 0) {
        var pageContent = "<form id='MyForm' method=\"POST\" action=\"https://api.razorpay.com/v1/checkout/embedded\">" +
          "<input type=\"hidden\" name=\"key_id\" value=\"" + this.data.razorpay_key_id + "\"> " +
          "<input type=\"hidden\" name=\"order_id\" value=\"" + this.rozar_orderId + "\">" +
          "<input type=\"hidden\" name=\"amount\" value=\"" + 1000 + "\">" +
          "<input type=\"hidden\" name=\"name\" value=\"HDFC VAS\">" +
          "<input type=\"hidden\" name=\"description\" value=\"Enter description\">" +
          "<input type=\"hidden\" name=\"prefill[email]\" value=\"pallavi.s.shettigar@gmail.com\"> " +
          "<input type=\"hidden\" name=\"prefill[contact]\" value=\"9731552442\">" +
          "<input type=\"hidden\" name=\"notes[transaction_id]\" value=\"215000083-4\">" +
          "<button>Submit</button> </form> "
        // "<script>submit();</script>"



        var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);





        var browserRef = this.iab.create(
          pageContentUrl,
          "_self",
          "hidden=no,location=no,clearsessioncache=yes,clearcache=yes"
        );
        // browserRef.executeScript({});


        // console.log("browserRef" + browserRef)
      }
    });

  }


  pay() {
    this.rozar_orderId = "";
    let rpay_obj = {
      rpay_amount: (1000 * 100) + "",
      rpay_currency: "INR",
      rpay_receipt: '215000083-4',
      rpay_MembId: '215000083',
      rpay_keyId: this.data.razorpay_key_id,
      rpay_KeySecret: this.data.razorpay_key_secret
    };
    this.rozar_orderId = "";

    this.apiClient.orderId_Generate(rpay_obj).then(result => {  //order id generate
      this.orderIdDet = result;
      let jsonOrd = JSON.parse(this.orderIdDet.OrderID)
      this.rozar_orderId = jsonOrd.id;
      console.log(jsonOrd.id);
      console.log(this.orderIdDet.OrderID);
      console.log("Len:" + (this.rozar_orderId).length);
      if ((this.rozar_orderId).length > 0) {
        var pageContent = ""
        console.log("this.data.razorpay_std  : " + this.data.razorpay_std)
        if (this.data.razorpay_std == "0") {
          console.log("INSIDE HDFC")
          pageContent = "<form id = 'MyForm' method=\"POST\" action=\"" + this.data.razorpay_posturl + "\">" +
            "<input type=\"hidden\" name=\"key_id\" value=\"" + this.data.razorpay_key_id + "\"> " +
            "<input type=\"hidden\" name=\"order_id\" value=\"" + this.rozar_orderId + "\">" +
            "<input type=\"hidden\" name=\"amount\" value=\"" + 1000 + "\">" +
            "<input type=\"hidden\" name=\"name\" value=\"HDFC VAS\">" +
            "<input type=\"hidden\" name=\"description\" value=\"Enter description\">" +
            "<input type=\"hidden\" name=\"prefill[email]\" value=\"pallavi.s.shettigar@gmail.com\"> " +
            "<input type=\"hidden\" name=\"prefill[contact]\" value=\"9731552442\">" +
            "<input type=\"hidden\" name=\"notes[transaction_id]\" value=\"215000083-4\">" +
            "<input type=\"hidden\" name=\"callback_url\" value=\"" + this.data.razorpay_callbackurl + "\">" +
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
        } else if (this.data.razorpay_std == "1") {
          //  pageContent = " <form id = 'MyForm' action=\"" + this.data.razorpay_callbackurl + "\" method=\"POST\"> " +
          //     " <script " +
          //     " src=\"" + this.data.razorpay_posturl + "\" " +
          //     " data-key=\"" + this.data.razorpay_key_id + "\" " +
          //     " data-amount=\" " + (1000 * 100) + " \"" +
          //     " data-currency=\"INR\" " +
          //     " data-order_id=\"" + this.rozar_orderId + "\" " +
          //     " data-buttontext=\"submit\" " +
          //     " data-name=\"" + this.data.storeID + "\ " +
          //     " data-description=\"Enter description\" " +
          //     " data-image=\"https://s3.amazonaws.com/rzp-mobile/images/rzp.png\" " +
          //     " data-prefill.name=\"pallavi\"" +
          //     " data-prefill.email=\"pallavi.s.shettigar@gmail.com\" " +
          //     " data-prefill.contact=\"9731552442\"" +
          //     " data-theme.color=\"#F37254\" " +
          //     " ></script> " +
          //     " <input type=\"hidden\" custom=\"Hidden Element\" name=\"hidden\"> " + ""
          //     " </form> "
             // " <script type=\"text/javascript\">document.getElementById(\"MyForm\").submit();</script> ";
         
          pageContent = "<button id=\"rzp-button1\">Pay</button> " +
            " <script type=\"text/javascript\" src=\"" + this.data.razorpay_posturl + "\"></script>" +
            " <script type=\"text/javascript\"> " +
            " var options = { " +
            " \"key\": \"" + this.data.razorpay_key_id + "\", " +
            " \"amount\": " + (1000 * 100) + ", " +
            " \"currency\": \"INR\"," +
            " \"name\": \"" + "City Gold" + "\", " +
            " \"description\": \"" + "Test Transaction" + "\", " +
            " \"image\": \"" + "https://s3.amazonaws.com/rzp-mobile/images/rzp.png" + "\", " +
            " \"order_id\": \"" + this.rozar_orderId + "\", " +
            " \"callback_url\": \"" + this.data.razorpay_callbackurl + "\", " +
            " \"prefill\": { " +
            " \"name\": \"" + "Pallavi" + "\", " +
            " \"email\": \"" + "pallavi.s.shettigar@gmail.com" + "\"," +
            " \"contact\": \"" + "9731552442" + "\", "
            " }, " +
            " \"notes\": { " + 
            " \"address\": \"" + "Razorpay Corporate Office" + "\"" +
            " },  \"theme\": { " + 
            " \"color\": \"" + "#F37254" + "\" } " + 
            "};" + 
            " var rzp1 = new Razorpay(options); " + 
            " document.getElementById('rzp-button1').onclick = function(e){ " + 
            " rzp1.open(); " +
            " e.preventDefault(); " +
            " } " + 
            //"document.getElementById(\"rzp-button1\").click();"
            //" document.getElementById('rzp-button1').submit(); " +
            //" document.getElementById(\"MyForm\").rzp-button1(); " +
            " </script> " + ""
            //" <script type=\"text/javascript\">document.getElementById('MyForm').submit();</script> ";


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
        } else {
          console.log("INSIDE GEN")
          console.log("this.data.razorpay_std Generic : " + this.data.razorpay_std)
          console.log("Generic here")
          var options = {
            description: "City Gold Fashion Jewellery", //this.scheme.store_name , //'Scheme App Payment',
            image: "https://s3.amazonaws.com/rzp-mobile/images/rzp.png", // obj.rpay_imgpath ,//"http://jms.asterixtechnology.com/logo/" + pg_obj.storeID + "/favicon.png" ,// 'https://i.imgur.com/3g7nmJC.png',
            currency: "INR",
            key: this.data.razorpay_key_id,
            amount: (1000 * 100),
            order_id: "order_FHBebicY8g9OKr",//obj.rpay_okey,
            name: "HDFC VAS", //this.scheme.store_name,
            notes: {
              transaction_id: "215000083-4"//obj.rpay_transid 
            },
            prefill: {
              email: 'pallavi.s.shettigar@gmail.com',
              contact: '9731552442',
              name: 'pallavi'
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
            console.log("Success: " + res)
            //resolve(res)

          };

          var cancelCallback = function (error) {
            console.log("Failure: 0")
            //resolve("0");
            //reject("0");
          };

          console.log("RazorPayCheckuot")
          // razorpay.open(options,successCallback,cancelCallback)
          RazorpayCheckout.on('payment.success', successCallback)
          RazorpayCheckout.on('payment.cancel', cancelCallback)
          RazorpayCheckout.open(options)

        }
      };
    });
  }

  pay_copy() {
    this.rozar_orderId = "";
    let rpay_obj = {
      rpay_amount: (1000 * 100) + "",
      rpay_currency: "INR",
      rpay_receipt: '215000083-4',
      rpay_MembId: '215000083',
      rpay_keyId: this.data.razorpay_key_id,
      rpay_KeySecret: this.data.razorpay_key_secret
    };
    this.rozar_orderId = "";

    this.apiClient.orderId_Generate(rpay_obj).then(result => {  //order id generate
      this.orderIdDet = result;
      let jsonOrd = JSON.parse(this.orderIdDet.OrderID)
      this.rozar_orderId = jsonOrd.id;
      console.log(jsonOrd.id);
      console.log(this.orderIdDet.OrderID);
      console.log("Len:" + (this.rozar_orderId).length);
      if ((this.rozar_orderId).length > 0) {
        var pageContent = "<form id = 'MyForm' method=\"POST\" action=\"https://api.razorpay.com/v1/checkout/embedded\">" +
          "<input type=\"hidden\" name=\"key_id\" value=\"" + this.data.razorpay_key_id + "\"> " +
          "<input type=\"hidden\" name=\"order_id\" value=\"" + this.rozar_orderId + "\">" +
          //"<input type=\"hidden\" name=\"payment_capture\" value=\"1\">" +
          "<input type=\"hidden\" name=\"amount\" value=\"" + 1000 + "\">" +
          "<input type=\"hidden\" name=\"name\" value=\"HDFC VAS\">" +
          "<input type=\"hidden\" name=\"description\" value=\"Enter description\">" +
          "<input type=\"hidden\" name=\"prefill[email]\" value=\"pallavi.s.shettigar@gmail.com\"> " +
          "<input type=\"hidden\" name=\"prefill[contact]\" value=\"9731552442\">" +
          "<input type=\"hidden\" name=\"notes[transaction_id]\" value=\"215000083-4\">" +
          "<input type=\"hidden\" name=\"callback_url\" value=\"https://kumuduapps.in:8443/\">" +
          "<button>Submit</button> </form> " +
          " <script type=\"text/javascript\">document.getElementById(\"MyForm\").submit();</script> "

        var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);
        let theOtherUrl = "https://kumuduapps.in:8443/"
        let browserRef: any = [];
        browserRef = this.iab.create(
          pageContentUrl,
          "_self",
          "hidden=no,location=no"
          //"EnableViewPortScale=yes,closebuttoncaption=Done"
        )
        browserRef.on('loadstop').subscribe((event) => {
          console.log(event.url);

        });

        browserRef.on('loadstart').subscribe((event) => {
          console.log(event.url);


          if (event.url.includes("authorized")) {
            browserRef.on("loadstop").subscribe((e) => {
              console.log("On Load Stop");
              console.log("On loadstop At authorize")
              console.log(e.url);
            });

          }

          if (event.url == theOtherUrl) {
            console.log("event.url" + event.url);
            browserRef.on("loadstop").subscribe((e) => {
              console.log("On Load Stop")

              console.log(e.url);


            });

            browserRef.close();
            browserRef.on("exit").subscribe((e) => {
              console.log("On Exit")
              console.log("On Exit" + e.url)
            });

          }
        });

        // var target = "_self";

        // var options = "location=yes,hidden=yes,beforeload=yes";

        // inAppBrowserRef = cordova.InAppBrowser.open(pageContentUrl, target, options);

        // inAppBrowserRef.addEventListener('loadstart', this.loadStartCallBack);

        // inAppBrowserRef.addEventListener('loadstop', this.loadStopCallBack);

        // inAppBrowserRef.addEventListener('loaderror', this.loadErrorCallBack);

        // inAppBrowserRef.addEventListener('beforeload', this.beforeloadCallBack);

        // inAppBrowserRef.addEventListener('message', this.messageCallBack);
      }
    });

  }

  PayNew1() {
    this.rozar_orderId = "";
    let rpay_obj = {
      rpay_amount: (1000 * 100) + "",
      rpay_currency: "INR",
      rpay_receipt: '215000083-4',
      rpay_MembId: '215000083',
      rpay_keyId: this.data.razorpay_key_id,
      rpay_KeySecret: this.data.razorpay_key_secret
    };
    this.rozar_orderId = "";

    this.apiClient.orderId_Generate(rpay_obj).then(result => {
      this.orderIdDet = result;
      let jsonOrd = JSON.parse(this.orderIdDet.OrderID)
      this.rozar_orderId = jsonOrd.id;
      console.log(jsonOrd.id);
      console.log(this.orderIdDet.OrderID);
      console.log("Len:" + (this.rozar_orderId).length);
      if ((this.rozar_orderId).length > 0) {


        var pageContent = ""


      }
    });

  }

  showHelp(url) {

    var target = "_blank";

    var options = "location=yes,hidden=yes,beforeload=yes";

    inAppBrowserRef = cordova.InAppBrowser.open(url, target, options);

    inAppBrowserRef.addEventListener('loadstart', this.loadStartCallBack);

    inAppBrowserRef.addEventListener('loadstop', this.loadStopCallBack);

    inAppBrowserRef.addEventListener('loaderror', this.loadErrorCallBack);

    inAppBrowserRef.addEventListener('beforeload', this.beforeloadCallBack);

    inAppBrowserRef.addEventListener('message', this.messageCallBack);
  }

  loadStartCallBack() {

    console.log("loading please wait ...");

  }

  loadStopCallBack() {

    if (inAppBrowserRef != undefined) {

      inAppBrowserRef.insertCSS({ code: "body{font-size: 25px;}" });

      inAppBrowserRef.executeScript({
        code: "\
            var message = 'this is the message';\
            var messageObj = {my_message: message};\
            var stringifiedMessageObj = JSON.stringify(messageObj);\
            webkit.messageHandlers.cordova_iab.postMessage(stringifiedMessageObj);"
      });

      console.log("Stop");

      inAppBrowserRef.show();
    }

  }

  loadErrorCallBack(params) {

    console.log("");

    var scriptErrorMesssage =
      "alert('Sorry we cannot open that page. Message from the server is : "
      + params.message + "');"

    inAppBrowserRef.executeScript({ code: scriptErrorMesssage }, this.executeScriptCallBack);

    inAppBrowserRef.close();

    inAppBrowserRef = undefined;

  }

  executeScriptCallBack(params) {

    if (params[0] == null) {

      console.log(
        "Sorry we couldn't open that page. Message from the server is : '"
        + params.message + "'");
    }

  }

  beforeloadCallBack(params, callback) {

    if (params.url.startsWith("http://www.example.com/")) {

      // Load this URL in the inAppBrowser.
      callback(params.url);
    } else {

      // The callback is not invoked, so the page will not be loaded.
      console.log("This browser only opens pages on http://www.example.com/");
    }

  }

  messageCallBack(params) {
    console.log("message received: " + params.data.my_message);
  }

}
