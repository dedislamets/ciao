import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-detail-experience',
  templateUrl: 'detail-experience.html',
})
export class DetailExperiencePage {

  program_id: number;
  param:any;
  language:any;
  arrList:any=[];
  arrList_detail:any=[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    private iab: InAppBrowser,) {
    this.program_id = navParams.get("program_id");
  }

  ionViewDidLoad() {
    this.loadLang();
    this.load_cooking_class();
  }

  loadLang(){
    this.api.getBahasa().then(lang => 
      {       
        if(lang['error'] == undefined) {
          this.language = JSON.stringify(lang);
          this.language = lang;
          //this.input_b_download = lang['id'].index.input_b_download;
        }else{
          this.api.showAlert(JSON.stringify(lang['error']));
        }
      });
  }
  load_cooking_class(){
    this.param = {
      params: {
        ws: 'cooking_class_detail_new',
        id: this.program_id,
        l: 'id'
      }
    };

    this.api.getApi(this.param).then(data => 
    {
      this.arrList.push(data['program']);
      for(var k = 0; k < this.arrList.length; k++){
        this.arrList[k]['image'] = this.api.getUrlCulinariaImage(this.arrList[k]['program_id']+'.jpg');
      }
      this.arrList_detail = data['program_detail'];
      
    });
  }
  register(){
    const option: InAppBrowserOptions = {
      hideurlbar: 'yes',
      toolbar: 'no',
      hardwareback: 'yes',
      useWideViewPort: 'yes',
      location: 'no',
      hidenavigationbuttons: 'yes'
    }
    const browser = this.iab.create(this.api.goCartCulinariaWeb(this.program_id),'_blank', option);
  }

}
