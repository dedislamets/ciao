import { Component } from '@angular/core';
import {  App, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
//import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase';
import { LoginProvider } from '../../providers/login/login';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { RegisterProdukPage } from '../register-produk/register-produk';
import { ApiProvider } from '../../providers/api/api';
import { ListProdukGaransiPage } from '../list-produk-garansi/list-produk-garansi';
import { ListExperiencePage } from '../list-experience/list-experience';
import { ListPromoPage } from '../list-promo/list-promo';
import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  userProfile: any = null;
  public param:any;
  label_welcome:string;
  language:any;
  nama:string;
  public alertShown:boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private loginProvider:LoginProvider, 
    private app: App,
    private iab: InAppBrowser,
    public api: ApiProvider,
    private storage: Storage,
    private alertCtrl: AlertController,
    public platform: Platform,
    //private googlePlus: GooglePlus
    ) {
      this.loadLang();
      // firebase.auth().onAuthStateChanged( user => {
      //   if (user){
      //     this.userProfile = user;
          
      //   } else { 
      //       this.userProfile = null;
      //   }
      // });
      storage.get('login').then(getData => {
        if (getData) {
          this.load_profil_pengguna(getData);
        }
      });

      platform.registerBackButtonAction(() => {
        let nav = this.app.getActiveNavs()[0];
        let activeView = nav.getActive();
        if(nav.canGoBack()){
          nav.pop(); //which navigates user to back page :)
        }else{
          if(activeView.name === 'HomePage') {
            if (this.alertShown==false) {
              this.presentConfirm();
            }
          }
          if(activeView.name === 'FormProfilePage') {
            this.navCtrl.setRoot(HomePage);
          }
        }
        
      },0);

      this.cek_app_update();
  }

  cek_app_update(){
    this.param = {
      params: {
        ws: 'appver',
        lv: this.api.versi,
      }
    };
    this.api.getApi(this.param).then(msg => 
    {
      if( msg['update'] == 1 ){
        let alert = this.alertCtrl.create({
            title: 'Aplikasi terbaru sudah tersedia.\nUpdate aplikasi?',
            message: '',
            buttons: [
              {
                text: 'Tidak',
                role: 'cancel',
                handler: () => {
                  
              }
            },
            {
              text: 'Ya!',
              handler: () => {
                window.location.replace(msg['url'])
              }
            }]
        }).present();
      }
    });
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
        title: 'Lanjut untuk keluar aplikasi?',
        message: '',
        buttons: [
          {
            text: 'Tidak',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
              this.alertShown=false;
          }
        },
        {
          text: 'Ya!',
          handler: () => {
            console.log('Yes clicked');
            this.platform.exitApp();
          }
        }]
    });

    alert.present().then(()=>{
      this.alertShown=true;
    });
  }

  load_profil_pengguna(getData){
    this.param = {
      params: {
        ws: 'memberprofil',
        memberid: getData['konsumen_id'],
      }
    };
    this.api.getApi(this.param).then(data_profile => 
    {
      this.nama = data_profile[0]['name'];
      this.userProfile = data_profile[0]['name'];
    });
  }
  
  logout(){
    this.loginProvider.logout();
    this.navCtrl.setRoot(LoginPage);
  }

  register(){
    this.navCtrl.push(ListProdukGaransiPage);
  }
  experience(){
    this.navCtrl.push(ListExperiencePage);
  }
  promo(){
    this.navCtrl.push(ListPromoPage);
  }
  onlineshop(){
      const option: InAppBrowserOptions = {
        hideurlbar: 'yes',
        toolbar: 'no',
        hardwareback: 'yes',
        useWideViewPort: 'yes',
        location: 'no',
        hidenavigationbuttons: 'yes'
      }
      const browser = this.iab.create('http://www.modena.co.id','_blank', option);

  }

  loadLang(){
    this.api.getBahasa().then(lang => 
    {
      
      if(lang['error'] == undefined) {
        this.language = JSON.stringify(lang);
        this.language = lang;
        this.label_welcome = lang['id'].umum.label_welcome;
      }else{
        this.api.showAlert(JSON.stringify(lang['error']));
      }
    });
  }

  
 

}
