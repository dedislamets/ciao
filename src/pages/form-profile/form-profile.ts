import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, LoadingController, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-form-profile',
  templateUrl: 'form-profile.html',
})
export class FormProfilePage {
  
  language:any;
  profile:any = [];
  param:any;
  konsumen_id:any;
  provinsi:any;
  telepon:string;
  hp:string;
  kota:any;
  kode_pos:string;
  alamat_current:string;
  arr_provinsi:any;
  arr_kota:any;
  label_lokasi_produk:string;
  label_propinsi:string;
  label_kota:string;
  label_kode_pos:string;
  label_telepon: string;
  label_telepon_selular:string;
  nama: string ='';
  email: string = '';
  label_nama:string;
  judul_konfirmasi:string;
  judul_notifikasi:string;
  label_alamat:string;
  notif_simpan_perubahan_data:string;
  label_kosongkan_apabila_tidak_ada_perubahan:string;
  label_ubah_password:string;
  label_ulangi_ketikkan_password:string;
  ubah:boolean =false;
  error_password_beda: boolean = false;
  flag_tutup:boolean = false;
  password:string = "";
  repeat_password:string = "";
  label_error_password_beda:string;
  error_email:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public api: ApiProvider,
    ) {
      this.flag_tutup = navParams.get("flag_tutup");
      storage.get('login').then(getData => {
        if (getData) {
          this.profile = getData;
          this.konsumen_id = getData['konsumen_id'];
          this.load_profil_pengguna(getData);
          this.loadLang();
        }
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormProfilePage');
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
      this.nama = data_profile[0]['name'];
      this.kode_pos = data_profile[0]['homepostcode'];
      this.provinsi = data_profile[0]['state_id'];
      this.email = data_profile[0]['email'];
      this.load_provinsi();
      this.load_kota(data_profile[0]['region_id']);
    });
  }

  ubah_password(){
    
    if( this.password.trim() != "" ) {
      this.ubah = true;
      if(this.password != this.repeat_password){
        this.error_password_beda = true;
      }else{
        this.error_password_beda = false;
      }
    }else{
      this.ubah = false;
    }
  }
 
  load_provinsi(){
    this.param = {
      params: {
        ws: 'propinsi_kontrakservis',
      }
    };

    this.api.getApi(this.param).then(data => 
    {
      this.arr_provinsi= data;
    });
  }
  load_kota(ref= ""){
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
  onChangePropinsi(p){
    this.load_kota();
  }
  loadLang(){
   
    this.api.getBahasa().then(lang => 
    {
      
      if(lang['error'] == undefined) {
        this.language = JSON.stringify(lang);
        this.language = lang;
        //this.judul = lang['id'].permintaan_servis.judul;
        this.judul_notifikasi = lang['id'].umum.judul_notifikasi;
        this.label_alamat = lang['id'].profil_pengguna.label_alamat;
        this.label_propinsi = lang['id'].registrasi_kontrak_servis.label_propinsi;
        this.label_kota = lang['id'].registrasi_kontrak_servis.label_kota;
        this.label_kode_pos = lang['id'].registrasi_kontrak_servis.label_kode_pos;
        this.label_telepon = lang['id'].registrasi_kontrak_servis.label_telepon;
        this.label_telepon_selular = lang['id'].registrasi_kontrak_servis.label_telepon_selular;
        this.notif_simpan_perubahan_data = lang['id'].profil_pengguna.notif_simpan_perubahan_data;
        this.judul_konfirmasi = lang['id'].umum.judul_konfirmasi;
        this.label_nama = lang['id'].profil_pengguna.label_nama;
        this.label_ubah_password = lang['id'].profil_pengguna.label_ubah_password;
        this.label_ulangi_ketikkan_password = lang['id'].profil_pengguna.label_ulangi_ketikkan_password;
        this.label_error_password_beda = lang['id'].profil_pengguna.label_password_tidak_sesuai;
        this.error_email = lang['id'].login.error_email;
        this.label_kosongkan_apabila_tidak_ada_perubahan = lang['id'].profil_pengguna.label_kosongkan_apabila_tidak_ada_perubahan;
      }else{
        this.api.showAlert(JSON.stringify(lang['error']));
      }
    });
  }

  validator(){
    var text ='';
    
    try {
      if(this.alamat_current==''){
        text += this.label_alamat + ' Fill Required..<br>';
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
      if(this.nama ==''){
        text += this.label_kota + ' Fill Required..<br>';
      }
      var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if(!this.email.trim().match(mailformat)){
        text += this.error_email + ' <br>';
      }

      if(this.error_password_beda){
        text += this.label_ubah_password + ' Not Match Field..<br>';
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
        ws: 'memberprofil',
        lg: 'id',
        c: 'simpan',
        txt_nama: this.nama,
        txt_alamat: this.alamat_current,
        s_kota: this.kota,
        s_propinsi: this.provinsi,
        txt_kodepos: this.kode_pos,
        txt_telepon: this.telepon,
        txt_telepon_selular: this.hp,
        memberid: this.konsumen_id,
        password: (this.ubah ? this.password : '' ),
        email: this.email
      }
    };

    const confirm = this.alertCtrl.create({
      message: this.notif_simpan_perubahan_data,
      title: this.judul_konfirmasi,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            const loader = this.loadingCtrl.create({
              content: "Waiting...",
            });
            this.api.getApi(this.param).then(data => 
            {
              if(data['error'] == undefined) {
                loader.dismiss();
                this.api.showNotify(data['status'],this.judul_notifikasi);
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

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
