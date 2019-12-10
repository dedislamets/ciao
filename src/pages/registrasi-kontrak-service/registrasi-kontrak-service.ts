import { Component } from '@angular/core';
import { LoadingController,ModalController, AlertController ,IonicPage, NavController, NavParams , ActionSheetController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ApiProvider } from '../../providers/api/api';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalItemCashbackPage } from '../modal-item-cashback/modal-item-cashback';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import * as moment from 'moment';
import { NumberFormatStyle } from '@angular/common';
import { ProdukPenunjangDetailPage } from '../produk-penunjang-detail/produk-penunjang-detail';
import { SyaratKetentuanPage } from '../syarat-ketentuan/syarat-ketentuan';
import { HomePage } from '../home/home';
import { FormProfilePage } from '../form-profile/form-profile';


@IonicPage()
@Component({
  selector: 'page-registrasi-kontrak-service',
  templateUrl: 'registrasi-kontrak-service.html',
  providers: [ApiProvider]
})
export class RegistrasiKontrakServicePage {

  language:any;
  profile:any = [];
  param:any;
  values:Array<string> = [];
  values_qty:Array<string> = [];
  konsumen_id:any;
  judul:string;
  label_ubah_lokasi_produk:string;
  label_produk_penunjang_yang_mungkin_anda:string;
  label_konfirmasi_registrasi_kontrak_servis:string;
  input_b_syarat_ketentuan_kontrak_servis:string;
  input_b_kirim_kontrak_servis:string;
  label_biaya_kontrak_servis_rp:string;
  label_total_tagihan_yang_harus_dibayarkan:string;
  label_total_produk_penunjang_rp:string;
  label_biaya_kontrak_servis:string;
  btn_ubah_lokasi:string;
  label_propinsi:string;
  label_kota:string;
  label_lokasi_produk:string;
  label_kode_pos:string;
  label_telepon:string;
  label_telepon_selular:string;
  label_pembelian_produk_penunjang_rp:string;
  label_batal_ubah_lokasi:string;
  biaya_produk_penunjang:number;
  total_biaya_kontrak_servis: number;
  label_total_biaya_rp:string;
  judul_notifikasi:string;
  label_dengan_mengirimkan_registrasi_kontrak_servis_berikut:string;
  label_catatan:string;
  biaya_kontrak_servis:number;
  membersproduct_id = new Array();
	membersproduct_serialnumber = new Array();
  membersproduct_id_boleh_kontrak_servis = new Array();
  arr_item:any;
  arr_detail_item_seleksi:any = [];
  arr_provinsi:any;
  provinsi:any;
  telepon:string;
  hp:string;
  kota:any;
  kode_pos:string;
  arr_produk_penunjang: any;
  arr_kota:any;
  ubah :boolean = false;
  produk_id:number;
  minat_produk_penunjang:string='';
  minat_produk_penunjang_clear:string='';
  alamat_current:string;
  label_kirimkan_registrasi_kontrak_servis:string;
  judul_konfirmasi:string;
  keterangan:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage,
    public alertCtrl: AlertController,
    private camera: Camera,
    public api: ApiProvider,
    private sanitizer: DomSanitizer,
    private transfer: FileTransfer,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController) {
      this.produk_id = navParams.get("produk_id");
      
  }

  ionViewDidLoad() {
    this.storage.get('login').then(getData => {
      if (getData) {
        this.profile = getData;
        this.konsumen_id = getData['konsumen_id'];
        this.load_profil_pengguna(getData);
        this.loadLang();
        this.load_konfirmasi_registrasi_kontrak_servis();
        this.load_produk_penunjang();
        
      }
    });
    
  }

  goprofile(){
    let modal = this.modalCtrl.create(FormProfilePage, { flag_tutup: true });
    modal.onDidDismiss(() => {
      this.ionViewDidLoad();
    });
    modal.present();
  }

  load_profil_pengguna(getData){
    this.param = {
      params: {
        ws: 'memberprofil',
        memberid: this.konsumen_id,
      }
    };
    this.api.getApi(this.param).then(data_profile => 
    {
      this.profile = data_profile[0];
      this.alamat_current = data_profile[0]['address'];
      this.telepon = data_profile[0]['phone'];
      this.hp = data_profile[0]['handphone'];
      this.kode_pos = data_profile[0]['homepostcode'];
      this.provinsi = data_profile[0]['state_id'];
      this.load_provinsi(data_profile[0]['state_id']);
      this.load_kota(data_profile[0]['region_id']);
    });
  }
  load_konfirmasi_registrasi_kontrak_servis(){
    this.param = {
      params: {
        ws: 'registrasi_kontrak_servis',
        c:'maksimal_usia_produk'
      }
    };

    this.api.getApi(this.param).then(msg_usia_produk => 
    {
      this.param = {
        params: {
          ws: 'memberproduk',
          c:'cek_kontrak_servis',
          memberid: this.konsumen_id,
          membersproductid: this.produk_id,
        }
      };
      this.api.getApi(this.param).then(msg => 
      {
        this.arr_item = msg;
        for( var x = 0; x < this.arr_item.length; x++ ){
          this.membersproduct_serialnumber[ this.membersproduct_serialnumber.length ] = msg[x].serialnumber;
        }
        this.load_biaya_kontrak_servis();
      });
      
    });
  }
  load_biaya_kontrak_servis(){
    this.param = {
      params: {
        c: 'load_biaya_kontrak_servis',
      }
    };

    this.api.getCSApi(this.param).then(msg => 
    {
      var biaya_kontrak_servis = msg['biaya_kontrak_servis'] != "" ? msg['biaya_kontrak_servis']  : 0;
      var biaya_penunjang_kontrak_servis = this.load_biaya_penunjang_kontrak_servis();
      this.label_biaya_kontrak_servis= "Rp" + this.api.format_number(biaya_kontrak_servis)  + " x "+ String(this.membersproduct_serialnumber.length) +" unit";
      this.biaya_produk_penunjang = biaya_penunjang_kontrak_servis[0];
      this.biaya_kontrak_servis =  biaya_kontrak_servis * this.membersproduct_serialnumber.length;
      this.total_biaya_kontrak_servis =(biaya_kontrak_servis * this.membersproduct_serialnumber.length) + biaya_penunjang_kontrak_servis[0];
    });
  }

  load_biaya_penunjang_kontrak_servis(){
    this.arr_detail_item_seleksi=[];
		var arr_minat_produk_penunjang = this.minat_produk_penunjang.split("|");
		var total_biaya_penunjang_kontrak_servis = 0;
		var string_return = 0;
		 	for( var x = 0; x < arr_minat_produk_penunjang.length; x++ ){
         if(arr_minat_produk_penunjang[x]==""){
           continue;
         }
         //debugger;
         total_biaya_penunjang_kontrak_servis += parseFloat(arr_minat_produk_penunjang[x].split(";")[1]) * parseInt(this.values_qty[x])
         if(this.values_qty[x]== undefined){
          this.values_qty[x]='1';
         }
         this.arr_detail_item_seleksi.push({
          'counter': x+1,
          'nama_produk': arr_minat_produk_penunjang[x].split(";")[0],
          'harga_produk':parseFloat(arr_minat_produk_penunjang[x].split(";")[1]),
          'qty': this.values_qty[x],
          'subtotal_produk' : parseFloat(arr_minat_produk_penunjang[x].split(";")[1]) * parseInt(this.values_qty[x])
         })
        
		 	}
		 	return new Array(total_biaya_penunjang_kontrak_servis, string_return)

  }

  detail_produk_penunjang(np, counter){
    let modal = this.modalCtrl.create(ProdukPenunjangDetailPage,
      {
        np: np,
        counter: counter,
        konten: this
      });
    modal.present();
  }
  syaratketentuan(){
    let modal = this.modalCtrl.create(SyaratKetentuanPage);
    modal.present();
  }
  load_produk_penunjang(){
    this.param = {
      params: {
        ws: 'produkpenunjang',
        memberid: this.konsumen_id,
        membersproductid: this.produk_id,
      }
    };

    this.api.getApi(this.param).then(data => 
    {
      this.arr_produk_penunjang= data;
    });
  }
  load_provinsi(ref=""){
    this.param = {
      params: {
        ws: 'propinsi_kontrakservis',
      }
    };

    this.api.getApi(this.param).then(data => 
    {
      this.arr_provinsi= data;
      this.provinsi = (ref != "" ? ref : data[0]['propinsi_id']) ;
    });
  }
  load_kota(ref=""){
    this.param = {
      params: {
        ws: 'kota_kontrakservis',
        propinsi_id: this.provinsi
      }
    };

    this.api.getApi(this.param).then(data => 
    {
      this.arr_kota= data;
      this.kota = (ref != "" ? ref : data[0]['kota_id']) ;
    });
  }
  loadLang(){
   
    this.api.getBahasa().then(lang => 
    {
      
      if(lang['error'] == undefined) {
        this.language = JSON.stringify(lang);
        this.language = lang;
        this.judul = lang['id'].registrasi_kontrak_servis.judul;
        this.label_ubah_lokasi_produk = lang['id'].registrasi_kontrak_servis.label_ubah_lokasi_produk;
        this.label_catatan = lang['id'].registrasi_kontrak_servis.label_catatan;
        this.label_batal_ubah_lokasi = lang['id'].registrasi_kontrak_servis.label_batal_ubah_lokasi;
        this.label_total_biaya_rp = lang['id'].registrasi_kontrak_servis.label_total_biaya_rp;
        this.label_pembelian_produk_penunjang_rp = lang['id'].registrasi_kontrak_servis.label_pembelian_produk_penunjang_rp;
        this.label_biaya_kontrak_servis_rp = lang['id'].registrasi_kontrak_servis.label_biaya_kontrak_servis_rp;
        this.label_total_produk_penunjang_rp = lang['id'].registrasi_kontrak_servis.label_total_produk_penunjang_rp;
        this.label_produk_penunjang_yang_mungkin_anda = lang['id'].registrasi_kontrak_servis.label_produk_penunjang_yang_mungkin_anda;
        this.label_konfirmasi_registrasi_kontrak_servis = lang['id'].registrasi_kontrak_servis.label_konfirmasi_registrasi_kontrak_servis;
        this.input_b_syarat_ketentuan_kontrak_servis = lang['id'].registrasi_kontrak_servis.input_b_syarat_ketentuan_kontrak_servis;
        this.input_b_kirim_kontrak_servis = lang['id'].registrasi_kontrak_servis.input_b_kirim_kontrak_servis;
        this.label_dengan_mengirimkan_registrasi_kontrak_servis_berikut = lang['id'].registrasi_kontrak_servis.label_dengan_mengirimkan_registrasi_kontrak_servis_berikut;
        this.label_total_tagihan_yang_harus_dibayarkan = lang['id'].registrasi_kontrak_servis.label_total_tagihan_yang_harus_dibayarkan;
        this.btn_ubah_lokasi = this.label_ubah_lokasi_produk;
        this.judul_notifikasi = lang['id'].umum.judul_notifikasi;
        this.label_lokasi_produk = lang['id'].registrasi_kontrak_servis.label_lokasi_produk;
        this.label_propinsi = lang['id'].registrasi_kontrak_servis.label_propinsi;
        this.label_kota = lang['id'].registrasi_kontrak_servis.label_kota;
        this.label_kode_pos = lang['id'].registrasi_kontrak_servis.label_kode_pos;
        this.label_telepon = lang['id'].registrasi_kontrak_servis.label_telepon;
        this.label_telepon_selular = lang['id'].registrasi_kontrak_servis.label_telepon_selular;
        this.judul_konfirmasi = lang['id'].umum.judul_konfirmasi;
        this.label_kirimkan_registrasi_kontrak_servis = lang['id'].registrasi_kontrak_servis.label_kirimkan_registrasi_kontrak_servis;
      }else{
        this.api.showAlert(JSON.stringify(lang['error']));
      }
    });
  }

  onChangePropinsi(p){
    this.load_kota();
  }
  ubah_lokasi(){
    if(this.ubah==true){
      this.ubah = false;
      this.btn_ubah_lokasi = this.label_ubah_lokasi_produk;
      this.alamat_current = this.profile['address'];
      this.telepon = this.profile['phone'];
      this.kode_pos = this.profile['homepostcode'];
      this.hp = this.profile['handphone'];
      this.provinsi=this.profile['state_id'];
      this.load_provinsi(this.profile['state_id']);
      this.load_kota(this.profile['region_id']);
    }else{
      this.ubah=true;
      this.btn_ubah_lokasi = this.label_batal_ubah_lokasi;
    }
  }

  hilangkan_seleksi(isi,j){
    var arr_minat_produk_penunjang = this.minat_produk_penunjang.split("|");
    var arr_minat_produk_penunjang_clear = this.minat_produk_penunjang_clear.split("|");
    var np = isi.nama_produk + ";" + isi.harga;
    var stemp = "";
    var stemp_clear = "";
    for( var x = 0; x < arr_minat_produk_penunjang.length; x++ ){
      if( arr_minat_produk_penunjang[x].toLowerCase() != np.toLowerCase() )	{
        if(arr_minat_produk_penunjang.length-1==1){
          stemp += arr_minat_produk_penunjang[x];
          stemp_clear += arr_minat_produk_penunjang_clear[x];
        }else{
          stemp += (x==0?"": "|" ) + arr_minat_produk_penunjang[x];
          stemp_clear += (x==0?"": "|" ) + arr_minat_produk_penunjang_clear[x];
        }
        
      }else{
        this.values[j] = "1";
      }
    }
    this.minat_produk_penunjang = stemp;
    this.minat_produk_penunjang_clear = stemp_clear;
    this.load_biaya_kontrak_servis();
  }

  hitunglagi(j){
    this.load_biaya_kontrak_servis();
  }

  validator(){
    var text ='';
    
    try {
      if(this.alamat_current==''){
        text += this.label_lokasi_produk + ' Fill Required..<br>';
      }
      if(this.telepon==''){
        text += this.label_telepon + ' Fill Required..<br>';
      }
      if(this.hp==''){
        text += this.label_telepon_selular + ' Fill Required..<br>';
      }
      if(this.konsumen_id==''){
        text += 'Konsumen ID Fill Required..<br>';
      }

      if(text != ''){
        this.api.showNotify(text,this.judul_notifikasi);
      }else{
        this.showConfirm();
      }

      
    } catch (error) {
      this.api.showAlert(error);
    }
  }

  showConfirm() {
    
    this.param = {
      params: {
        ws: 'registrasi_kontrak_servis',
        jumlah_produk: 1,
        hd_membersproductid_0:this.produk_id,
        t_keterangan: this.keterangan,
        hd_ubah_lokasi_0: ( this.ubah ? 1 : 0 ),
        t_alamat_0: this.alamat_current,
        s_kota_0: this.kota,
        s_propinsi_0: this.provinsi,
        t_kodepos_0: this.kode_pos,
        t_telepon_0: this.telepon,
        t_telepon_selular_0: this.hp,
        minat_produk_penunjang: this.minat_produk_penunjang_clear,
        konsumen_id: this.konsumen_id
      }
    };
    var arr_minat_produk_penunjang = this.minat_produk_penunjang_clear.split("|");
    if( arr_minat_produk_penunjang[0] != ""){
      for( var x = 0; x < arr_minat_produk_penunjang.length; x++ ){
        this.param['params']['qty_' + arr_minat_produk_penunjang[x]] = this.values_qty[x];
        this.param['params']['harga_' + arr_minat_produk_penunjang[x]] = this.arr_detail_item_seleksi[x]['harga_produk'];
      }
    }

    const confirm = this.alertCtrl.create({
      message: this.label_kirimkan_registrasi_kontrak_servis,
      title: this.judul_konfirmasi,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            const loader = this.loadingCtrl.create({
                content: "Uploading Image...",
            });
            this.api.getApi(this.param).then(data => 
            {
              if(data['error'] == undefined) {
                loader.dismiss();
                this.navCtrl.setRoot(HomePage);
              }else{
                loader.dismiss();
                this.api.showNotify(data['error'],'Error');
              }
            });
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

}
