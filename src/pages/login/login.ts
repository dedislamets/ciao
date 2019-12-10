import { Component } from '@angular/core';
import { AlertController,ToastController, IonicPage, NavController, NavParams, MenuController  } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { RegisterPage } from '../register/register';
import { ApiProvider } from '../../providers/api/api';
import { LoginProvider } from '../../providers/login/login';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
 import { HomePage } from '../home/home';
import { ForgotpassPage } from '../forgotpass/forgotpass';
import { Facebook, FacebookLoginResponse  } from '@ionic-native/facebook';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [ApiProvider]
})

export class LoginPage {
  input = {
    email: '',
    password: ''
  }
  maxlogin: number = 0;
  public param:any;
  public arr_token: any;
  devid:any = 'cdpqvof4zW4:APA91bHD-UaJl0di4d7lAUfjHnNuiArLhn5Zt53IlU7Ilv30eoN2TKXWqRG2wmfZyESEDzTtw2rF164BnyCFXaZr5G-H-vmNMS-0mJLB4MlTIWn8XVlNhx__dwWpB6QmKgMpb3SBtP5h';
  permitchange:string = '';
  loginForm: FormGroup;
  loginError: string;
  registrationId: any;
  label_register_new:string;
  label_have_account:string;
  label_lupa_password:string;
  label_click_here:string;
  language:any;
  label_email:string;
  label_klik_disini:string;
  masuk_dengan:string;
  judul:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, menuCtrl: MenuController,
    private storage: Storage,
    public toastCtrl: ToastController,
    private loginProvider:LoginProvider,
    public api: ApiProvider,
    private alertCtrl: AlertController,
    private fb: Facebook,
		fbi: FormBuilder,)
  {
    
    this.loginForm = fbi.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
		});

    firebase.auth().onAuthStateChanged( user => {
      if (user){
        this.navCtrl.setRoot(HomePage);
      } 
    });

    this.storage.get('registrationId').then(data => {
      this.registrationId = data;
    });
   
  }


  ionViewDidLoad() {
    this.storage.get('deviceid').then(dev => {
        this.devid = dev;
    });
    this.loadLang();
  }

  showAlert(msg) {
      this.alertCtrl.create({
          title: 'Error!',
          subTitle: msg,
          buttons: ['OK']
      }).present();
  }
  loadLang(){
    this.api.getBahasa().then(lang => 
    {
      if(lang['error'] == undefined) {
        this.language = JSON.stringify(lang);
        this.language = lang;
        this.label_register_new = lang['id'].login.label_register_new;
        this.label_have_account = lang['id'].login.label_have_account;
        this.label_lupa_password = lang['id'].login.label_lupa_password_kecil;
        this.label_click_here = lang['id'].login.label_click_here;
        this.label_email = lang['id'].login.email;
        this.label_click_here = lang['id'].login.klik_disini;
        this.masuk_dengan = lang['id'].login.masuk_dengan;
        this.judul = lang['id'].login.judul;
      }else{
        this.api.showAlert(JSON.stringify(lang['error']));
      }
    });
  }
  public register()
  {
    this.navCtrl.setRoot(RegisterPage);
  }
  
  login() {
		let data = this.loginForm.value;

		if (!data.email) {
			return;
		}

		let credentials = {
			email: data.email,
			password: data.password
		};
		// this.auth.signInWithEmail(credentials)
		// 	.then(
		// 		() => this.navCtrl.setRoot(HomePage),
		// 		error => this.loginError = error.message
		// 	);
  }
  
  public loginapp()
  {
    let valid = this.validateForm();
    
    if(valid){
      this.ceklogin();
    }
    
    
  }

  public ceklogin(){
    this.param = {
        params: {
        ws: 'login',
        e: this.input.email,
        p: this.input.password,
      }
    };

    this.api.getApi(this.param).then(data => 
    {
        if(data['error'] == undefined) {
            this.api.setmemory('prof',data[0]);
            this.storage.set('login',data[0]);
            this.cek_langganan_push(this.input.email);
            
        }else{
            this.showAlert(JSON.stringify(data['error']));
        }
    });
  }

  public cek_langganan_push(email){
    this.param = {
      params: {
        ws: 'push_subscription',
        apps:'ciaomodena',
        mode:"cek",
        registrasionid: this.registrationId,
        email: email
      }
    };
    this.api.getApi(this.param).then(msg => 
    {
      if( msg['langganan_id'] == "" ){
        this.langganan_push(email);
      }else{
        this.navCtrl.setRoot(HomePage);
      }
    });
  }

  public langganan_push(email){
    this.param = {
      params: {
        ws: 'push_subscription',
        apps:'ciaomodena',
        registrasionid: this.registrationId,
        email: email
      }
    };
    this.api.getApi(this.param).then(msg => 
    {
      this.navCtrl.setRoot(HomePage);
    });
  }

  public google(){

    this.loginProvider.googlePlusLogin().then(
      (response) =>{
        //this.api.showAlert(response);
        this.param = {
          params: {
            ws: 'parsing_login',
            e: response["user"]["providerData"][0].email,
            nama: response["user"]["providerData"][0].displayName,
            hp: response["user"]["providerData"][0].phoneNumber,
            fbid:''
          }
        };

        this.api.getApi(this.param).then(data => 
        {
            this.api.setmemory('prof',data[0]);
            this.storage.set('login',data[0]);
            this.cek_langganan_push(response["user"]["providerData"][0].email);
        });
        
      }).catch((error) => {
        alert(error);
      })

    // this.auth.signInWithGoogle().then(
    //   () => this.navCtrl.setRoot(MenuPage),
    //   error => console.log(error.message)
    // );
    
  }

  public facebook(){
    this.loginProvider.facebookLogin().then(
      (response) =>{
        //this.api.showAlert(response);
        this.param = {
          params: {
            ws: 'parsing_login',
            e: typeof response["user"]["providerData"][0].email == 'undefined' || response["user"]["providerData"][0].email == null || response["user"]["providerData"][0].email == '' ? response["user"]["providerData"][0].uid : response["user"]["providerData"][0].email ,
            nama: response["user"]["providerData"][0].displayName,
            hp: response["user"]["providerData"][0].phoneNumber,
            fbid: response["user"]["providerData"][0].uid
          }
        };

        this.api.getApi(this.param).then(data => 
        {
            this.api.setmemory('prof',data[0]);
            this.storage.set('login',data[0]);
            this.cek_langganan_push(response["user"]["providerData"][0].email);
        });
      }).catch((error) => {
        alert(error);
      })
    
  }

    // createTable(){
    //     this.sqlite.create({
    //         name: 'csms.db',
    //         location: 'default'
    //     }).then((db: SQLiteObject) => {
    //         db.executeSql('CREATE TABLE IF NOT EXISTS draft_wo(ron VARCHAR(50) PRIMARY KEY, tgl VARCHAR(10), tipe VARCHAR(10), model VARCHAR(10), serial VARCHAR(10), tgl_beli date, stok_dealer VARCHAR(10), no_garansi VARCHAR(50), pending int(1), alasan_tertunda VARCHAR(100),level_perbaikan VARCHAR(100),kode_keluhan VARCHAR(10),kode_defect VARCHAR(10), kode_perbaikan VARCHAR(10), keterangan text, catatan_teknisi text ))', {})
    //         .then(res => console.log('Executed SQL'))
    //         .catch(e => console.log(e));
    
    //     }).catch(e => console.log(e));
    // }

  validateForm() {
      if (this.input.email.length == 0 || this.input.password.length == 0 || this.input.email.trim()=='' || this.input.password.trim()=='') {
        const toast = this.toastCtrl.create({
          message: 'Email/Password tidak boleh kosong.',
          duration: 3000,
          position: 'top'
        });
        toast.present(toast);
        return false;
      }
      else {
          return true;
      }
  }
  lupa_password(){
    this.navCtrl.push(ForgotpassPage);
  }
}
