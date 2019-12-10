import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-scanner',
  templateUrl: 'scanner.html',
})
export class ScannerPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private qrScanner: QRScanner,public api: ApiProvider,) {
  }

  ionViewDidLoad() {
    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      if (status.authorized) {
        
        let scanSub = this.qrScanner.scan().subscribe((text: string) => {
          
          this.navParams.get('data').valChange(text.replace(/\s+/g, ''),this.navParams.get('index'));

          this.navParams.get('data').values[this.navParams.get('index')] = text.replace(/\s+/g, '');

          
          window.document.querySelector('ion-app').classList.remove('cameraView');
          this.navCtrl.pop();

          this.qrScanner.hide(); 
          scanSub.unsubscribe(); 
      });

      //this.showCamera();
      this.qrScanner.resumePreview();

      // show camera preview
      this.qrScanner.show()
          .then((data: QRScannerStatus) => {

          }, err => {
            alert('show error ' + err);
          });
      } 

      window.document.querySelector('ion-app').classList.add('cameraView');
    })
    .catch((e: any) => this.api.showAlert('Error is'+ e));
  }

  ionViewWillLeave(){

    window.document.querySelector('ion-app').classList.remove('cameraView');
  
  }

  dismiss() {
    this.navCtrl.pop();
  }

}
