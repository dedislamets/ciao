import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-produk-penunjang-detail',
  templateUrl: 'produk-penunjang-detail.html',
  providers: [ApiProvider]
})
export class ProdukPenunjangDetailPage {

  param:any;
  arr_item:any=[];
  img_produk_penunjang:any;
  harga_produk_penunjang: number;
  nama_produk_penunjang:string;
  np:any;
  counter:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    public viewCtrl: ViewController) {
      this.np= this.navParams.get("np");
      this.counter= this.navParams.get("counter");
  }

  ionViewDidLoad() {
    this.load_item();
  }

  load_item(){
    this.param = {
      params: {
        ws: 'produkpenunjang',
        produk_penunjang: this.np ,
        lg: 'id'
      }
    };
    this.api.getApi(this.param).then(msg => 
    {
      this.arr_item= msg;
      for (var key in this.arr_item) {
        this.img_produk_penunjang = "http://www.modena.co.id/images/product/"+ this.arr_item[key][0]['name'] +".png";
        this.harga_produk_penunjang = this.arr_item[key][0]['price'];
        this.nama_produk_penunjang = this.arr_item[key][0]['nama_produk'];
      }
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  minat(){
    if(this.navParams.get('konten').minat_produk_penunjang==''){
      this.navParams.get('konten').minat_produk_penunjang = this.np + ";" + this.harga_produk_penunjang;
      this.navParams.get('konten').minat_produk_penunjang_clear = this.np;
    }else{
      this.navParams.get('konten').minat_produk_penunjang += "|" + this.np + ";" + this.harga_produk_penunjang;
      this.navParams.get('konten').minat_produk_penunjang_clear += "|" + this.np;
    }
    
    this.navParams.get('konten').values[this.counter] = 0;
    this.navParams.get('konten').values_qty[this.counter] = 1;
    this.navParams.get('konten').load_biaya_kontrak_servis();
    this.viewCtrl.dismiss();
	}

}
