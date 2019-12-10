import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
/**
 * Generated class for the ForgotpassPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgotpass',
  templateUrl: 'forgotpass.html',
})
export class ForgotpassPage {

  public param:any;
  label_lupa_password:string;
  language:any;
  label_mohon_masukkan_email: string;
  email:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,public api: ApiProvider,) {
  }

  ionViewDidLoad() {
    this.loadLang()
  }

  loadLang(){
    this.api.getBahasa().then(lang => 
    {
      if(lang['error'] == undefined) {
        this.language = JSON.stringify(lang);
        this.language = lang;
        this.label_mohon_masukkan_email = lang['id'].login.label_mohon_masukkan_email;
        this.label_lupa_password = lang['id'].login.label_lupa_password;
      }else{
        this.api.showAlert(JSON.stringify(lang['error']));
      }
    });
  }
  resetpass(){
    if(this.email.trim()==""){
      alert('Email tidak boleh kosong');
    }else{
      this.param = {
        params: {
          ws: 'register',
          c: 'reset_password',
          e: this.email,
        }
      };
      this.api.getApi(this.param).then(data => 
      {
        if(data['error'] == undefined) {
          this.api.showNotify(this.language['id']['login']['note_reset_password'],'OK');
        }else{
          this.api.showNotify(data['error'],'Error');
        }
      });
    }
  }
}
