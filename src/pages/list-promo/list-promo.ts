import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@IonicPage()
@Component({
  selector: 'page-list-promo',
  templateUrl: 'list-promo.html',
})
export class ListPromoPage {

  param:any;
  registrationId: any;
  profile=[];
  arr_bulan = new Array("Januari","Februari","Maret","April", "Mei","Juni","Juli","Agustus","September","Oktober","November","Desember");
  arrList:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    private screenOrientation: ScreenOrientation,
    private iab: InAppBrowser,
    private storage: Storage,) {
    storage.get('login').then(getData => {
      if (getData) {
        this.profile = getData;
      }
    });
    this.storage.get('registrationId').then(data => {
      this.registrationId = data;
    });
  }

  

  ionViewDidLoad() {
    this.load_pertama();
  }

  load_pertama(){
    this.param = {
      params: {
        ws: 'promo_new',
      }
    };
    this.api.getApi(this.param).then(data => 
    {
      this.arrList = data;
      for(var k = 0; k < this.arrList.length; k++){
        this.arrList[k]['image'] = this.api.baseUrl() + this.arrList[k]['image'];
      }
    });
  }

  zoomin(src){
    //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    this.screenOrientation.unlock();
    const option: InAppBrowserOptions = {
      hideurlbar: 'yes',
      toolbar: 'no',
      hardwareback: 'yes',
      useWideViewPort: 'yes',
      location: 'no',
      hidenavigationbuttons: 'yes'
    }
    const browser = this.iab.create(src,'_blank', option);
    browser.on('exit').subscribe(event => {
      this.screenOrientation.lock("portrait");
    })
  
  }

}
