import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
// import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { DataProvider } from '../data/data';
//import { Razorpay } from 'razorpay';
//
//declare var Razorpay :any ;
/*
  Generated class for the WebClientProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WebClientProvider {
  public loginType: string = "agent";
  private currentLoader: any;
  private loaderMessage: string = "Please wait...";
  public dataPvdr: DataProvider
  devices: any = [];
  constructor(public http: HttpClient, public loadingCtrl: LoadingController, public data: DataProvider) {
    console.log('Hello WebClientProvider Provider');

    this.initLoader();
  }

  initLoader() {
    this.currentLoader = this.loadingCtrl.create({
      content: this.loaderMessage
    });
  }
  showLoader() {
    this.initLoader();
    this.currentLoader.present();
  }
  dismissLoader() {
    try {
      this.currentLoader.dismiss();
    } catch (e) {
      console.log(e);
    }
  }

  public schemeDetail(searchTerm) {
    if (this.data.getUser()['branch'] == undefined) {

    }
    console.log("members/getMember/" + searchTerm + "/" + this.data.storeID + "/" + this.data.getUser()['branch'])
    let endPoint = this.data.url + "members/getMember/" + searchTerm + "/" + this.data.storeID + "/" + this.data.getUser()['branch'];

    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }
  public getMyLedger(obj) {
    let endPoint =
      this.data.url + "agents/myLedger";

    return new Promise((resolve, reject) => {
      this.http
        .post(endPoint, obj)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }
  public getMyLedgerSummary(obj) {
    let endPoint =
      this.data.url + "agents/myLedgerSummary";

    return new Promise((resolve, reject) => {
      this.http
        .post(endPoint, obj)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public getDashboard(agentID) {
    let endPoint =
      this.data.url + "agents/dashboard/" + agentID + "/" + this.data.storeID;

    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public getRatelist() {
    let endPoint =
      this.data.url + "agents/ratelist/" + this.data.storeID + "/" + this.data.getUser()['branch'];

    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public getGroups() {
    console.log(this.data.getUser());
    let endPoint =
      this.data.url + "schemes/getGroups/" + this.data.storeID + "/" + this.data.getUser()['branch'];

    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public userLedger(mobile, mcode) {
    console.log(mobile);
    console.log(mcode);
    let endPoint =
      this.data.url + "users/userLedger";

    return new Promise((resolve, reject) => {
      this.http
        .post(endPoint, { "mobile": mobile, "mcode": mcode, "storeID": this.data.storeID, "branchId": this.data.getUser()['branch'] })
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }
  public getBranches() {
    let endPoint =
      this.data.url + "jmsAdmin/store/branches/" + this.data.storeID + "";
    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }
  public joinChit(obj) {
    let endPoint =
      this.data.url + "schemes/joinScheme";

    return new Promise((resolve, reject) => {
      this.http
        .post(endPoint, obj)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public makePayment(obj) {
    let endPoint =
      this.data.url + "agents/payForScheme";

    return new Promise((resolve, reject) => {
      this.http
        .post(endPoint, obj)
        .subscribe(
          res => {
            try {
              let data = res;
              console.log(data)
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }
  //recoverpassuser

  public recoverpassuser(obj) {
    console.log("Calling")
    let endPoint =
      this.data.url + "users/recoverpass";
    console.log(endPoint)
    return new Promise((resolve, reject) => {
      this.http
        .post(endPoint, obj)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }


  public recoverpass(obj) {
    console.log("Calling")
    let endPoint =
      this.data.url + "agents/recoverpass";
    console.log(endPoint)
    return new Promise((resolve, reject) => {
      this.http
        .post(endPoint, obj)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public agnetLogin(obj) {
    let endPoint =
      this.data.url + "agents/login";

    return new Promise((resolve, reject) => {
      this.http
        .post(endPoint, obj)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public customerLogin(obj) {
    let endPoint =
      this.data.url + "users/login";

    return new Promise((resolve, reject) => {
      this.http
        .post(endPoint, obj)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public CheckUserAlreadyRegistered(obj) {
    let endPoint =
      this.data.url + "users/CheckUsers";

    return new Promise((resolve, reject) => {
      this.http
        .post(endPoint, obj)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public customerRegister(obj) {
    let endPoint =
      this.data.url + "users/register";

    return new Promise((resolve, reject) => {
      this.http
        .post(endPoint, obj)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public sendOTP(obj) {
    let endPoint =
      this.data.url + "agents/sentOTP";
    console.log(obj);
    return new Promise((resolve, reject) => {
      this.http
        .post(endPoint, obj)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public SendSmsToMember(obj) {
    let endPoint =
      this.data.url + "agents/SendSmsToMember";
    console.log(obj);
    return new Promise((resolve, reject) => {
      this.http
        .post(endPoint, obj)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public validateOTP(obj) {
    let endPoint =
      this.data.url + "agents/verifyOTP";

    return new Promise((resolve, reject) => {
      this.http
        .post(endPoint, obj)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }
  public validateCustomerOTP(obj) {
    let endPoint =
      this.data.url + "users/verifyOTP";

    return new Promise((resolve, reject) => {
      this.http
        .post(endPoint, obj)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }


  public verifySign(obj) {
    let endPoint =
      this.data.url + "agents/verifysignature/";

    return new Promise((resolve, reject) => {
      this.http
        .post(endPoint, obj)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }


  public InsertPaySignRecords(obj) {
    let endPoint =
      this.data.url + "agents/InsertPaySignRecords/";

    return new Promise((resolve, reject) => {
      this.http
        .post(endPoint, obj)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public getPaymentGatewayReference() {
    console.log(this.data.getUser());
    let endPoint =
      this.data.url + "schemes/getPaymentGatewayReference/";

    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }



  public getPaymentGatewayDetails() {
    console.log(this.data.getUser());
    let endPoint =
      this.data.url + "schemes/getPaymentGatewayDetails/" + this.data.storeID + "/" + this.data.getUser()['branch'];

    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public pg_order_track_insert(obj) {
    let orderid = obj.orderId;
    let MemberId = obj.MemberId;
    let amount = obj.Amount;
    let Receipt = obj.Receipt;
    //{storeID}/{branchID}/{orderId}/{Amount}/{MemberId}/{Receipt}
    let endPoint =
      this.data.url + "schemes/pg_order_track_insert/" + this.data.storeID + "/" + this.data.getUser()['branch']
      + "/" + orderid + "/" + amount + "/" + MemberId + "/" + Receipt;
    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
              //console.log(data)
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });

  }

  public pg_order_track_update(obj) {
    let vouchNo = obj.voucher;
    let orderid = obj.orderid;
    let payid = obj.paymentid;
    let MemberId = obj.MemberId;
    let pay_signature = obj.pay_signature;

    let endPoint =
      this.data.url + "schemes/pg_order_track_update/" + this.data.storeID + "/" + this.data.getUser()['branch']
      + "/" + vouchNo + "/" + orderid + "/" + payid + "/" + MemberId + "/" + pay_signature;
    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
              //console.log(data)
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });

  }


  public getEpayEncrypt(obj) {
    let endPoint =
      this.data.url + "agents/GetEncrypt_PgUrl_EasyPay/";

    return new Promise((resolve, reject) => {
      this.http
        .post(endPoint, obj)
        .subscribe(
          res => {
            try {
              let data = res["result"];
              console.log("res :" + data);
              resolve(data);
      
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            console.log(err);
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public getEpayDecrypt(obj) {
    let endPoint =
      this.data.url + "agents/GetDCrypt_PgUrl_EasyPay/";

    return new Promise((resolve, reject) => {
      this.http
        .post(endPoint, obj)
        .subscribe(
          res => {
            try {
              let data = res["result"];
              console.log("res :" + data);
              resolve(data);
      
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            console.log(err);
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public getEpayEncrypt_new(obj) {
    let endPoint =
      this.data.url + "agents/GetEncrypt_PgUrl_EasyPay/";

    return new Promise((resolve, reject) => {
      this.http
        .post(endPoint, obj)
        .subscribe(
          res => {
            try {
              let data = res["result1"];
              console.log("res :" + data);
              resolve(data);
      
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            console.log(err);
            resolve([]);
            reject(err);
          }
        );
    });
  }


  
  public getEpayEncrypt1(obj) {
    
    let endPoint =
    this.data.url + "agents/GetEncrypt_PgUrl_EasyPay/";

  return new Promise((resolve, reject) => {
    this.http
      .post(endPoint, obj)
      .subscribe(
        res => {
          try {
            let data = res;
            console.log("data : " + data)
            resolve(data);
          } catch (e) {
            console.log(e);
          }
        },
        err => {
          console.log(err);
          resolve([]);
          reject(err);
        }
      );
  });
  }


  public orderId_Generate(obj) {
    //Store_Id/BranchId/KeyId/KeySecreate/Amount/MemberId/
    //storeID/BranchId/Amount/Reciept/MemberId
    let Amt = obj.rpay_amount;
    let Recpt = obj.rpay_receipt;
    let MembId = obj.rpay_MembId;


    let endPoint =
      this.data.url + "schemes/GetRazorOrder_ID/" + this.data.storeID + "/" + this.data.getUser()['branch']
      + "/" + Amt + "/" + Recpt + "/" + MembId;
    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            try {
              let data = res;
              console.log("order id",data);
              
              resolve(data);
              console.log(data)
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public GetMDetForUpdate(Mgroup, MemberNo) {
    console.log("members/GetMDetForUpdate/" + Mgroup + "/" + MemberNo + "/" + this.data.storeID + "/" + this.data.getUser()['branch'])
    let endPoint = this.data.url + "members/GetMDetForUpdate/" + Mgroup + "/" + MemberNo + "/" + this.data.storeID + "/" + this.data.getUser()['branch'];

    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public getInstallCount(Mgroup, MemberNo) {
    console.log("members/GetInstallCount/" + Mgroup + "/" + MemberNo + "/" + this.data.storeID + "/" + this.data.getUser()['branch'])
    let endPoint = this.data.url + "members/GetInstallCount/" + Mgroup + "/" + MemberNo + "/" + this.data.storeID + "/" + this.data.getUser()['branch'];

    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }


  public Update_MDetails(obj) {
    let endPoint =
      this.data.url + "members/Update_MDetails";

    return new Promise((resolve, reject) => {
      this.http
        .post(endPoint, obj)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public Get_Privacy_policy() {

    let endPoint =
      this.data.url + "stores/getprivacypolicy/" + this.data.storeID;

    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public Get_Contact_us() {

    let endPoint =
      this.data.url + "stores/getcontact/" + this.data.storeID;

    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public Get_Refundpolicy() {

    let endPoint =
      this.data.url + "stores/getrefundpolicy/" + this.data.storeID;

    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public Get_terms() {

    let endPoint = this.data.url + "stores/getterms/" + this.data.storeID;
    console.log(endPoint)
    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            console.log("res")
            try {
              let data = res;
              console.log("res" + res)
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            console.log("err")
            console.log(err)
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public GetParam() {

    let endPoint = this.data.url + "schemes/doGet";
    console.log(endPoint)
    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            console.log("res")
            try {
              let data = res;
              console.log("res" + res)
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            console.log("err")
            console.log(err)
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public newpg() {
    let endPoint1 = "https://kumuduapps.in:8443/hdfcRpayResponse.jsp";
    // return new Promise((resolve, reject) => {
    return this.http.get(endPoint1).map((res: Response) => res.json())
    //})
  }

  public LastPg() {
    let dt: any
    let endPoint1 = "https://kumuduapps.in:8443/hdfcRpayResponse.jsp";
    return new Promise(resolve => {
      this.http.get(endPoint1).map((res: Response) => res.json())
        .subscribe(data => {
          dt = data;
          console.log(dt);
          resolve(dt);
        });
    });

  }

  public getPgResponse() {
    // let endPoint1 = "https://kumuduapps.in:8443/hdfcRpayResponse.jsp" ;
    // return this.http.get(endPoint1).map((res: Response) => res.json())



    let endPoint = "https://kumuduapps.in:8443/hdfcRpayResponse.jsp";
    console.log("endPoint :" + endPoint);
    return new Promise((resolve, reject) => {
      this.http.get(endPoint).subscribe(res => {
        console.log("res")
        try {
          console.log("res" + res)
        } catch (e) {
          console.log(e);
        }
      },
        err => {
          console.log("err")
          console.log(err)
          resolve([]);
          reject(err);
        }

      )
    })
  };

  public NewPgGetParam() {

    let endPoint = "https://kumuduapps.in:8443/hdfcRpayResponse.jsp";
    console.log(endPoint)
    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            console.log("res")
            try {
              let data = res;
              console.log("res" + res)
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            console.log("err")
            console.log(err)
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public Get_fbpath() {

    let endPoint = this.data.url + "stores/getfb/" + this.data.storeID;
    console.log(endPoint)
    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            console.log("res")
            try {
              let data = res;
              console.log("res" + res)
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            console.log("err")
            console.log(err)
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public get_twitterpath() {

    let endPoint = this.data.url + "stores/gettwitter/" + this.data.storeID;
    console.log(endPoint)
    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            console.log("res")
            try {
              let data = res;
              console.log("res" + res)
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            console.log("err")
            console.log(err)
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public get_getytubepath() {

    let endPoint = this.data.url + "stores/getytube/" + this.data.storeID;
    console.log(endPoint)
    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            console.log("res")
            try {
              let data = res;
              console.log("res" + res)
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            console.log("err")
            console.log(err)
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public get_getinstapath() {

    let endPoint = this.data.url + "stores/getinsta/" + this.data.storeID;
    console.log(endPoint)
    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            console.log("res")
            try {
              let data = res;
              console.log("res" + res)
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            console.log("err")
            console.log(err)
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public GetMemberAddress(mobile) {

    let endPoint = this.data.url + "stores/GetMemberAddress/" + this.data.storeID + "/" + mobile + "" ;
    console.log(endPoint)
    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            console.log("res")
            try {
              let data = res;
              console.log("res" + res)
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            console.log("err")
            console.log(err)
            resolve([]);
            reject(err);
          }
        );
    });
  }


  public get_getytubehelppath() {

    let endPoint = this.data.url + "stores/getythelplink/" + this.data.storeID;
    console.log(endPoint)
    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            console.log("res")
            try {
              let data = res;
              console.log("res" + res)
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            console.log("err")
            console.log(err)
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public getfaq() {
  
    let endPoint =
      this.data.url + "schemes/getfaq/" + this.data.storeID;
    console.log(endPoint);
    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }

  public getBankList() {
    let endPoint =
      this.data.url + "stores/GetBankList/" + this.data.storeID + "/" +  (this.data.getUser()['branch']) + '' ;
    return new Promise((resolve, reject) => {
      this.http
        .get(endPoint)
        .subscribe(
          res => {
            try {
              let data = res;
              resolve(data);
            } catch (e) {
              console.log(e);
            }
          },
          err => {
            resolve([]);
            reject(err);
          }
        );
    });
  }
  /*
  public getOrderIdGenerate() {
    let endPoint =
        this.data.url + "schemes/getPaymentGatewayOrderId/" + this.data.storeID + "/" + this.data.getUser()['branch'];
        return new Promise((resolve, reject) => {
          this.http
            .get(endPoint)
            .subscribe(
              res => {
                try {
                  let data = res;
                  resolve(data);
                } catch (e) {
                  console.log(e);
                }
              },
              err => {
                resolve([]);
                reject(err);
              }
            );
        });
  }
  
  public getOrderDetails(rpay_obj){
      console.log("rpay_obj.rpay_keyId : " + rpay_obj.rpay_keyId)
      console.log("rpay_obj.key_secret : " + rpay_obj.rpay_KeySecret)
      var instance = new Razorpay({
        key_id:rpay_obj.rpay_keyId,
        key_secret:rpay_obj.rpay_KeySecret
      })
      
      var options = {
        amount: rpay_obj.rpay_amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11",
        payment_capture: '1'
      };
      instance.orders.create(options, function(err, order) {
        console.log(order);
        console.log("pallavi_order");
      });
   
    }
  */

}
