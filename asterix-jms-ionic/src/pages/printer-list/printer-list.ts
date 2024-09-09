import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, Navbar } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';
//import { ChitListPage } from '../chit-list/chit-list';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
declare var cordova;


@IonicPage()
@Component({
  selector: 'page-printer-list',
  templateUrl: 'printer-list.html',
})
// pls test this in a real android device
export class PrinterListPage implements OnInit {
  @ViewChild('navbar') navBar: Navbar;
  devices: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform,
    public bluetoothSerial: BluetoothSerial, public data: DataProvider, public viewCtrl: ViewController) {
      
    }
    // try this
    ngOnInit(): void {
      this.platform.ready().then(() => { 
        console.log(this.bluetoothSerial, "Loading App")
        //this.bluetoothSerial.enable(); R comment
      });
    }

  
  ionViewDidLoad_r() {
    console.log('I-ionViewDidLoad PrinterListPage');
    console.log(this.data.printMessage);
      alert("started");
      this.platform.ready().then(() => {
        cordova.plugins.permissions.requestPermission(cordova.plugins.permissions["BLUETOOTH"], async function (status) {
          if (!status.hasPermission) {
              // Permission denied, handle this case
          } else {
             alert("permission granted");
             console.log("asdjfhj");
             try{
              //debugger;
              //setTimeout(() => this.enableBluetooth(), 1000);
              //this.platform.ready().then(() => {
                // Initialize the bluetoothSerial object
                //this.bluetoothSerial.isEnabled().then(
                 // () => console.log('Bluetooth is enabled'),
                 // () => {console.log('Bluetooth is not enabled');
                //}
               // );
              //});
              this.BluetoothSerial.list().then((devices) => {
                //this.bluetoothSerial.list().then(devices => {
                alert("djhaf");
                console.log(devices);
                this.devices = devices;
                alert(this.devices.length);
                devices.forEach(function (device) {
                  console.log(device.id);
                });
              })
            } catch(err){
              alert("2");
              alert(JSON.stringify(err));
            }
            this.bluetoothSerial.list().then(dev => {
              alert("test");
              console.log(dev);
            });
          }
      }, function (e) {
        alert("3");
        alert(JSON.stringify(e));
          // Permission request error, handle this case
      });
      })

      
    
      
    
   
  }
  enableBluetooth(){    
    this.bluetoothSerial.enable().then(function(enabled) {
      setTimeout(function() {
        alert({
          title: "Did the user allow enabling Bluetooth by our app?",
            message: enabled ? "Yes" : "No",
            okButtonText: "OK, nice!"
        });
      }, 500);
    }); 
  }


  selectPrinter(device) {
    console.log(JSON.stringify(device));
    this.bluetoothSerial.connect(device['id']).subscribe(response => {
      console.log("38--" + JSON.stringify(response));
      let messages = this.data.printMessage;

      if (response === "OK") {


        this.bluetoothSerial.write(messages).then(obj => {
          console.log("42--" + JSON.stringify(obj));
        }, err => {
          console.log("44--" + JSON.stringify(err));
        });
      }
    });
  }
  dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }
  ionViewDidLoad() {
    console.log('R-ionViewDidLoad PrinterListPage this was the old code');
    console.log(this.data.printMessage);
    //debugger;
    this.platform.ready().then(() => {
      // Initialize the bluetoothSerial object
      this.bluetoothSerial.isEnabled().then(
        () => console.log('Bluetooth is enabled'),
        () => console.log('Bluetooth is not enabled')
      );
    });
    this.bluetoothSerial.list().then(devices => {
      console.log(devices);
      this.devices = devices;
      devices.forEach(function (device) {
        console.log(device.id);
      })
    });
  }


}
