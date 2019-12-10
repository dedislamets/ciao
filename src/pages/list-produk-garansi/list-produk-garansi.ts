import { Component } from '@angular/core';
import { LoadingController,IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { RegisterProdukPage } from '../register-produk/register-produk';
import { ApiProvider } from '../../providers/api/api';
import * as moment from 'moment';
import { FormDetailPage } from '../form-detail/form-detail';
/**
 * Generated class for the ListProdukGaransiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list-produk-garansi',
  templateUrl: 'list-produk-garansi.html',
  providers: [ApiProvider]
})
export class ListProdukGaransiPage {

  profile=[];
  public param:any;
  arrList:any;
  arr_bulan = new Array("Januari","Februari","Maret","April", "Mei","Juni","Juli","Agustus","September","Oktober","November","Desember");
  language:any;
  template_pembelian_dari:string;
  template_nomor_seri:string;
  judul:string;
  daftar_produk:string;
  values_produk_note:Array<string> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public api: ApiProvider,) {
      
      storage.get('login').then(getData => {
        if (getData) {
          this.profile = getData;
          this.getData();
          
        }else{
          this.navCtrl.setRoot(LoginPage);
        }
      });
  }
  loadLang(){
    this.api.getBahasa().then(lang => 
      {       
        if(lang['error'] == undefined) {
          this.language = JSON.stringify(lang);
          this.language = lang;
          this.template_pembelian_dari = lang['id'].index.template_pembelian_dari;
          this.template_nomor_seri = lang['id'].index.template_nomor_seri;
          this.judul = lang['id'].mulai_registrasi_garansi.tambah_produk;
          this.daftar_produk = lang['id'].mulai_registrasi_garansi.daftar_produk;
        }else{
          this.api.showAlert(JSON.stringify(lang['error']));
        }
      });
  }
  ionViewDidLoad() {
    this.loadLang();
  }

  create(){
    this.navCtrl.push(RegisterProdukPage);
  }

  getData() {
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loader.present();
    this.param = {
      params: {
      ws: 'memberproduk',
      memberid: this.profile['konsumen_id'],
      }
    };
    this.api.getApi(this.param).then(data =>
    {
    
      if(data['error'] == undefined) {
        this.arrList = data;
        for(var k = 0; k < this.arrList.length; k++){
          this.arrList[k]['tanggal'] = this.api.format_tanggal( this.arrList[k]['purchasedate'], this.arr_bulan );
          this.load_memberproduk(this.arrList[k],k);
        }
        
        loader.dismiss();
      }else{
          this.api.showAlert(data['error']);
          loader.dismiss();
      }
    });
  }

  load_memberproduk(data_member,index){
    if( typeof data_member.data_kontrak_servis !== "undefined" ){
      this.values_produk_note[index] = "Kontrak servis AKTIF No. " + data_member.data_kontrak_servis[0].nomor_kks
      // update data nomor kontrak servis di website modena
      this.update_data_kontrak_servis( data_member.serialnumber, data_member.data_kontrak_servis[0].nomor_kks );
      //produk_note += "<br />Berlaku : " + format_tanggal( data_member.data_kontrak_servis[0].date_from_formatted, arr_bulan ) + " - " + format_tanggal( data_member.data_kontrak_servis[0].date_to_formatted, arr_bulan )
      //produk_note += "<br />Waktu kunjungan terdekat : " + format_tanggal( data_member.data_kontrak_servis[0].tanggal_jadwal_formatted, arr_bulan )
    }else{
      if( data_member.kontrak_servis_registrasi == 1 ){
        this.values_produk_note[index] = "Registrasi kontrak servis menunggu verifikasi.";
      }else{
        this.values_produk_note[index]='';
      }
    }
    if( typeof data_member.data_servis_request !== "undefined" ){
      this.values_produk_note[index] += ( this.values_produk_note[index].trim().length > 0 ? "<br />" : "" ) + "Permintaan servis No. " + data_member.data_servis_request.nomor_ron
    }
  }

  update_data_kontrak_servis(p_sn, p_ksn){
    this.param = {
      params: {
        ws: 'memberproduk',
        c: 'update_data_kontrak_servis',
        memberid: this.profile['konsumen_id'],
        sn: p_sn,
        ksn: p_ksn
      }
    };
    this.api.getApi(this.param).then(data =>
    {

    });
  }
  itemSelected(item){
    //console.log(item);
    this.navCtrl.push(FormDetailPage, {
      item: item,
      konsumen_id: this.profile['konsumen_id'],
      c: '',
      profile: this.profile
    })
  }
}
