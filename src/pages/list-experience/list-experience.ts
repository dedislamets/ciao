import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { DetailExperiencePage } from '../detail-experience/detail-experience';
import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-list-experience',
  templateUrl: 'list-experience.html',
})
export class ListExperiencePage {

  param:any;
  registrationId: any;
  profile=[];
  arr_bulan = new Array("Januari","Februari","Maret","April", "Mei","Juni","Juli","Agustus","September","Oktober","November","Desember");
  arrList:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public api: ApiProvider,
    private storage: Storage,
    private iab: InAppBrowser,) {
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
        ws: 'cooking_class_new',
      }
    };
    this.api.getApi(this.param).then(data => 
    {
      this.arrList = data['cooking_class'];
      for(var k = 0; k < this.arrList.length; k++){
        this.arrList[k]['image'] = this.api.getUrlCulinariaImage(this.arrList[k]['image_url']);
        this.arrList[k]['pa_awal'] = moment(this.arrList[k]['program_awal']).format("DD-MM-YYYY");
        this.arrList[k]['pa_akhir'] = (this.arrList[k]['program_akhir']== null ? "" : moment(this.arrList[k]['program_akhir']).format("DD-MM-YYYY"));
      }
    });
  }

  onDetails(itm){
    this.navCtrl.push(DetailExperiencePage,{
      program_id: itm.program_id
    });
  }

  register(itm){
    const option: InAppBrowserOptions = {
      hideurlbar: 'yes',
      toolbar: 'no',
      hardwareback: 'yes',
      useWideViewPort: 'yes',
      location: 'no',
      hidenavigationbuttons: 'yes'
    }
    const browser = this.iab.create(this.api.goCartCulinariaWeb(itm.program_id),'_blank', option);
  }

}
