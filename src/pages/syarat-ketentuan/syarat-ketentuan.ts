import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
/**
 * Generated class for the SyaratKetentuanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-syarat-ketentuan',
  templateUrl: 'syarat-ketentuan.html',
})
export class SyaratKetentuanPage {

  param:any;
  konten_konfirmasi:string;
  input_b_syarat_ketentuan_kontrak_servis:string;
  language:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public api: ApiProvider,public viewCtrl: ViewController) {
    this.loadLang();
      
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad SyaratKetentuanPage');
  }

  loadLang(){
  
    this.api.getBahasa().then(lang => 
    {
      if(lang['error'] == undefined) {
        this.language = JSON.stringify(lang);
        this.input_b_syarat_ketentuan_kontrak_servis = lang['id'].registrasi_kontrak_servis.input_b_syarat_ketentuan_kontrak_servis;
        this.loadItem(lang['id'].umum.kode_bahasa);
      }else{
        this.api.showAlert(JSON.stringify(lang['error']));
      }
    });
    
  }
  loadItem(lg){
    this.param = {
      params: {
        c: 'konfirmasi',
        konf: 'konfirmasi_kontrak_servis',
        lg: lg
      }
    };
    this.api.getCSApi(this.param).then(msg => 
    {
      this.konten_konfirmasi = msg['pesan'];
    });
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
