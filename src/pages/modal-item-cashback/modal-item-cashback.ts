import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-modal-item-cashback',
  templateUrl: 'modal-item-cashback.html',
})
export class ModalItemCashbackPage {

  public param:any;
  items: any;
  label_daftar_registrasi_produk_dengan_cashback: string;
  language:any;
  tanggal: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    public viewCtrl: ViewController) {
      this.tanggal = navParams.get("tgl");
      this.loadLang();
      this.loadItem();
  }

  loadLang(){
  
      this.api.getBahasa().then(lang => 
      {
        if(lang['error'] == undefined) {
          this.language = JSON.stringify(lang);
          this.label_daftar_registrasi_produk_dengan_cashback = lang['id'].mulai_registrasi_garansi.label_daftar_registrasi_produk_dengan_cashback;
        }else{
          this.api.showAlert(JSON.stringify(lang['error']));
        }
      });
      
  }
  loadItem(){
    this.param = {
      params: {
        c: 'sellout_product',
        tgl: this.tanggal
      }
    };
    this.api.getCSApi(this.param).then(data => 
    {
      this.items = data['item'];
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalItemCashbackPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
