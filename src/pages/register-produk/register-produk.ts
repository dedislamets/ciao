import { Component } from '@angular/core';
import { LoadingController,ModalController, AlertController ,IonicPage, NavController, NavParams , ActionSheetController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
//import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalItemCashbackPage } from '../modal-item-cashback/modal-item-cashback';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import * as moment from 'moment';
import { FormProfilePage } from '../form-profile/form-profile';
import { ScannerPage } from '../scanner/scanner';

@IonicPage()
@Component({
  selector: 'page-register-produk',
  templateUrl: 'register-produk.html',
  providers: [ApiProvider]
})
export class RegisterProdukPage {

  public base64Image : any =  './assets/images/img-not-found.jpg';
  profile=[];
  
  public myForm: FormGroup;
  values:Array<string> = [];
  labels:Array<string> = [];
  valids:Array<string> = [];
  validatePar:Array<string>=[];
  public param:any;
  public homeColor : String;
  display: String;
  label_klaim_cashback_pelanggan_terhormat: String;
  label_klaim_cashback_silahkan_lengkapi: String;
  label_faktur_harus_difoto: string;
  label_konten_syarat_dan_ketentuan: string;
  label_foto_faktur: string;
  label_tempat_pembelian: string;
  label_tanggal_pembelian: string;
  label_data_pembelian:string;
  label_no_seri_produk : string;
  input_b_tambah_produk_registrasi:string;
  input_b_kirim_registrasi:string;
  label_data_klaim_cashback:string;
  konten_metode_klaim: any;
  label_b_sellout_produk:string;
  judul_notifikasi:string;
  label_klaim_cashback_metode_pembayaran:string;
  judul:string;
  judul_konfirmasi:string;
  konfirmasi_kirim_registrasi_garansi:string;
  tanggal:any;
  notif_mohon_lengkapi_profil_anda:string;
  metodeKlaim:any;
  kontenMetodeKlaim:any;
  mk:string;
  language:any;
  tempat_beli: string;
  tgl_beli: any;
  konsumen_id:string;
  disabled:string = "disabled";
  chk_setuju:boolean = false;
  isOn:boolean = false;

  arr_bulan = new Array("Januari","Februari","Maret","April", "Mei","Juni","Juli","Agustus","September","Oktober","November","Desember");
  data = {
    projects: [
      {
        projectName: "",
      }
    ]
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    public modalController:ModalController,
    //private barcodeScanner: BarcodeScanner,
    private camera: Camera,
    public api: ApiProvider,
    private sanitizer: DomSanitizer,
    private transfer: FileTransfer,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController) {
      this.display = 'none';
      this.mk = '0';
      this.konten_metode_klaim = '';
      this.myForm = this.formBuilder.group({
        projects: this.formBuilder.array([])
      })
      
      this.setCompanies();
      storage.get('login').then(getData => {
        if (getData) {
          this.konsumen_id = getData['konsumen_id'];
          this.load_profil_pengguna(getData);
        }
      });
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
      
    });
  }

  standart_validation(){
    this.validatePar["tempat"]= this.tempat_beli;
    this.validatePar["tgl_beli"]= this.tgl_beli;
  }

  ionViewDidLoad() {
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loader.present();
    this.storage.get('login').then(getData => {
      if (getData) {
        this.konsumen_id = getData['konsumen_id'];
        this.load_profil_pengguna(getData);
        this.loadLang();
        this.loadMetode();
      }
    });
    
    
    loader.dismiss();
    
  }

  goprofile(){
    let modal = this.modalCtrl.create(FormProfilePage, { flag_tutup: true });
    modal.onDidDismiss(() => {
      this.ionViewDidLoad();
    });
    modal.present();
  }

  loadMetode(){
    delete this.param.params.sc;
    this.param['params']['lang'] = 'id';
    this.param['params']['c'] = 'sellout_metode_klaim';
    this.api.getCSApi(this.param).then(data => 
    {
      this.metodeKlaim = data['metode_klaim'];
      this.kontenMetodeKlaim =  data['konten_metode_klaim'];
    });
  }
  loadLang(){
    this.param = {
      params: {
        c: 'sellout_product',
        sc: 'cek_saja',
      }
    };

    this.api.getCSApi(this.param).then(data => 
    {
        if(data['error'] == undefined) {
          this.api.getBahasa().then(lang => 
          {
            
            if(lang['error'] == undefined) {
              this.language = JSON.stringify(lang);
              this.language = lang;
              this.label_klaim_cashback_pelanggan_terhormat = lang['id'].mulai_registrasi_garansi.label_klaim_cashback_pelanggan_terhormat.replace(/#periode_sellout#/, this.api.format_tanggal( data['awal'], this.arr_bulan ) + " - " + this.api.format_tanggal( data['akhir'], this.arr_bulan ));
              this.label_klaim_cashback_silahkan_lengkapi = lang['id'].mulai_registrasi_garansi.label_klaim_cashback_silahkan_lengkapi;
              this.label_faktur_harus_difoto = lang['id'].mulai_registrasi_garansi.label_faktur_harus_difoto;
              this.label_konten_syarat_dan_ketentuan = lang['id'].mulai_registrasi_garansi.label_konten_syarat_dan_ketentuan;
              this.label_foto_faktur = lang['id'].mulai_registrasi_garansi.label_foto_faktur;
              this.label_tanggal_pembelian = lang['id'].mulai_registrasi_garansi.label_tanggal_pembelian;
              this.label_tempat_pembelian = lang['id'].mulai_registrasi_garansi.label_tempat_pembelian;
              this.judul = lang['id'].mulai_registrasi_garansi.judul;
              this.input_b_tambah_produk_registrasi = lang['id'].mulai_registrasi_garansi.input_b_tambah_produk_registrasi;
              this.label_data_pembelian = lang['id'].mulai_registrasi_garansi.label_data_pembelian;
              this.label_no_seri_produk =lang['id'].mulai_registrasi_garansi.label_no_seri_produk;
              this.judul_notifikasi = lang['id'].umum.judul_notifikasi;
              this.label_klaim_cashback_metode_pembayaran = lang['id'].mulai_registrasi_garansi.label_klaim_cashback_metode_pembayaran;
              this.konfirmasi_kirim_registrasi_garansi =lang['id'].mulai_registrasi_garansi.konfirmasi_kirim_registrasi_garansi;
              this.judul_konfirmasi = lang['id'].umum.judul_konfirmasi;
              this.label_data_klaim_cashback = lang['id'].mulai_registrasi_garansi.label_data_klaim_cashback;
              this.label_b_sellout_produk = lang['id'].mulai_registrasi_garansi.label_b_sellout_produk;
              this.input_b_kirim_registrasi = lang['id'].mulai_registrasi_garansi.input_b_kirim_registrasi;
              this.notif_mohon_lengkapi_profil_anda = lang['id'].umum.notif_mohon_lengkapi_profil_anda;

              var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

              if(!this.profile['email'].trim().match(mailformat) || this.profile['name'].trim() == "" || this.profile['address'].trim() == "" || this.profile['handphone'].trim() == ""){
                        
                const confirm = this.alertCtrl.create({
                  message: this.notif_mohon_lengkapi_profil_anda,
                  title: this.judul_notifikasi,
                  buttons: [
                    {
                      text: 'OK',
                      handler: () => {
                        let modal = this.modalCtrl.create(FormProfilePage, { flag_tutup: true });
                        modal.onDidDismiss(() => {
                          this.ionViewDidLoad();
                        });
                        modal.present();
                      }
                    },
                    {
                      text: 'Cancel',
                      handler: () => {
                        this.navCtrl.setRoot(HomePage);
                      }
                    }
                  ]
                });
                confirm.present();
              }

              
            }else{
              this.api.showAlert(JSON.stringify(lang['error']));
            }
          });
          
        }else{
            this.api.showAlert(JSON.stringify(data['error']));
        }
    });
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Login Authentication',
      subTitle: 'Please login for next step.',
      buttons: [
        {
          text: 'OK',
          handler: data => {
            this.navCtrl.setRoot(HomePage);
          }
        }
      ]
    });
    alert.present();
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Pilih Foto',
      buttons: [
        {
          text: 'Camera',
          role: 'destructive',
          icon:'camera',
          handler: () => {
            this.takePhoto(1);
          }
        },{
          text: 'Galeri Foto',
          icon:'images',
          handler: () => {
            this.takePhoto(0);
          }
        },{
            text: 'Preview',
            icon:'eye',
            handler: () => {

            }
        },{
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  takePhoto(sourceType:number){
    let options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      sourceType: sourceType,
      correctOrientation: true
    }
    this.camera.getPicture(options).then((imageData) => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        
    }, (err) => {
       console.log(err);
    });
  }
  addNewProject() {
    let control = <FormArray>this.myForm.controls.projects;
    control.push(
      this.formBuilder.group({
          projectName: ['']
      })
    )
  }
  deleteProject(index) {
    let control = <FormArray>this.myForm.controls.projects;
    control.removeAt(index);
    this.labels.splice(index,1);
    this.values.splice(index,1);
  }

  setCompanies() {
    let control = <FormArray>this.myForm.controls.projects;
    this.data.projects.forEach(x => {
      control.push(this.formBuilder.group({ 
        projectName: x.projectName 
      }))
    })
  }

  valChange(value:string, index:number):void{
    value = value.replace(/\s+/g, '');
    this.display = 'block';
    this.values[index] = value;
    this.param = {
        params: {
        ws: 'cek_data_registrasiproduk',
        sn: value,
        }
    };

    this.api.getApi(this.param).then(data => 
    {
      this.labels[index] = '';
      if(data['error'] == undefined) {
        if(data['item'] != ''){
          if(data['item'] == "duplikasi" ) {
            this.labels[index] = this.language['id']['mulai_registrasi_garansi']['label_produk_error_1'];
          }else{
            this.labels[index] = data['item'];
            this.valids[index] = '1';
          }
        }else{
          this.labels[index] = this.language['id']['mulai_registrasi_garansi']['label_produk_error_2'];
        }
      }else{
          alert(JSON.stringify(data['error']));
      }
    });
  }

  scanBarcode(index) {
    let modal = this.modalController.create(ScannerPage, {
        data: this,
        index: index
    });
    modal.present();
    
    // this.barcodeScanner.scan().then(barcodeData => {
    //   if(barcodeData.text != "") {
    //     this.values[index]  = barcodeData.text.replace(/\s+/g, '');
    //     this.valChange(barcodeData.text.replace(/\s+/g, ''),index);
    //   }
      
    //  }).catch(err => {
    //      console.log('Error', err);
    //  });
  }



  onChangeMetode(val){
    this.mk = val;
    if(parseInt(val)>0){
      this.konten_metode_klaim =  this.kontenMetodeKlaim[val].replace(/#no_ponsel#/,this.profile['hp']);
    }else{
      this.konten_metode_klaim = '';
    }
  }
  setuju(val){
    this.disabled = val;
  }

  pilih(){
    this.navCtrl.push(ModalItemCashbackPage,{
      tgl: (this.tanggal == undefined ? moment().format("YYYY/MM/DD") : this.tanggal)
    })
  }
  send(){
    var text ='';
    try {
      if(parseInt(this.mk)>0){
        this.param['params']['lang'] = 'id';
        this.param['params']['c'] = 'sellout_metode_klaim';
        this.param['params']['sc'] = 'validasi_sellout_klaim';
        this.param['params']['metode_klaim'] = this.mk;
        this.api.getCSApi(this.param).then(data => 
        {
          for(var l = 0; l < data['wajib_diisi'].length; l++){
            let obj = document.getElementById(data['wajib_diisi'][l]);
            if(obj['value'].trim() == '' ){
              text += "- " + data['wajib_diisi_label'][l] + ' Fill Required..<br>';
            }
          }
          text = this.subvalid(text);
          if(text != ''){
            this.api.showNotify(text,this.judul_notifikasi);
          }else{
            this.showConfirm(data['wajib_diisi']);
          }
        });
      }else{
        text = this.subvalid(text);
        if(text != ''){
          this.api.showNotify(text,this.judul_notifikasi);
        }
      }

      
    } catch (error) {
      this.api.showAlert(error);
    }
  }


  subvalid(text){
    if(this.tempat_beli=='' || this.tempat_beli == undefined){
      text += "- " + this.label_tempat_pembelian + ' ' + this.language['id']['validasi'].required + '<br>';
    }
    if(this.tgl_beli=='' || this.tgl_beli == undefined){
      text += "- " + this.label_tanggal_pembelian + ' '+ this.language['id']['validasi'].required +'<br>';
    }
    if(this.base64Image == "./assets/images/img-not-found.jpg"){
      text += "- " + this.label_foto_faktur + ' '+ this.language['id']['validasi'].required +'<br>';
    }
    if(this.mk=="0"){
      text += "- " + this.label_klaim_cashback_metode_pembayaran + ' '+ this.language['id']['validasi'].combo +'<br>';
    }
    for(var k = 0; k < this.values.length; k++){
      if(this.values[k]=='' || this.values[k] == undefined){
        text += "- " + this.label_no_seri_produk + ' ' + (k+1) + ' '+ this.language['id']['validasi'].required +'<br>';
      }else if(this.valids[k] !='1'){
        text += "- " + this.label_no_seri_produk + ' '+ this.language['id']['validasi'].notvalid +'<br>';
      }
    }
    return text;
  }

  showConfirm(par_metode) {
    
    this.param = {
      params: {
        ws: 'registrasi_garansi_simpan',
        sel_metode_klaim: this.mk,
        hd_tanggal_pembelian: this.tgl_beli,
        t_tempat_pembelian: this.tempat_beli,
        konsumen_id: this.konsumen_id
      }
    };

    for(var l = 0; l < par_metode.length; l++){
      let obj = document.getElementById(par_metode[l]);
      this.param['params'][par_metode[l]] = obj['value'];
    }

    for(var k = 1; k < this.values.length+1; k++){
      this.param['params']['t_produk_' + k] = this.values[k-1]; 
    }

    
    
    const confirm = this.alertCtrl.create({
      message: this.konfirmasi_kirim_registrasi_garansi,
      title: this.judul_konfirmasi,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.api.getApi(this.param).then(data => 
            {
              if(data['error'] == undefined) {
                this.pushImage(data['garansi_id'] , this.base64Image);
                
              }else{
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

  pushImage(picture, photo){
    const loader = this.loadingCtrl.create({
        content: "Uploading Image...",
    });
    loader.present();
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
        fileKey: 'file',
        mimeType :'image/jpeg',
        fileName: picture,
        chunkedMode: false,
        headers: {}
    }
    let status_upload = false;
    var url = this.api.url_ajax_modena + '?ws=upload_garansi';
    fileTransfer.upload(photo, url, options)
    .then((data) => { 
        loader.dismiss();
        this.navCtrl.setRoot(HomePage);
    }, (err) => {
        loader.dismiss();
        alert("error : "+JSON.stringify(err));
    });
    
  }  

  onChangeTanggal(event) {
    this.tanggal = event.year + '/' + (event.month<10 ? '0'+event.month : event.month) + '/'  + (event.day<10 ? '0'+event.day : event.day);
    this.tanggal = (this.tanggal == undefined ? moment().format("YYYY/MM/DD") : this.tanggal);
    this.param = {
      params: {
        c: 'sellout_product',
        sc: 'cek_saja',
        tgl: this.tanggal
      }
    };

    this.api.getCSApi(this.param).then(data => 
    {
      this.label_klaim_cashback_pelanggan_terhormat = this.language['id'].mulai_registrasi_garansi.label_klaim_cashback_pelanggan_terhormat.replace(/#periode_sellout#/, this.api.format_tanggal( data['awal'], this.arr_bulan ) + " - " + this.api.format_tanggal( data['akhir'], this.arr_bulan ));
    });
  }


}
