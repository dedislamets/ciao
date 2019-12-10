import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { ApiProvider } from '../../providers/api/api';
import { HomePage } from '../home/home';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  input = {
    username: '',
    email: '',
    password: '',
    confirm: ''
  }
  public param:any;
  public arr_token: any;
  language:any;
  label_error_password_tidak_sama: string;
  label_error_isikan_password: string;
  label_error_isian_ulang_password: string;
  label_isikan_email_anda:string;
  registrationId: any;
  label_register_new:string;
  label_register:string;
  label_have_account:string;
  error_isian_kosong:string;
  error_email:string;
  label_username:string;
  label_email:string;
  label_confirm:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public toastCtrl: ToastController,
    private storage: Storage,
    public api: ApiProvider,) {
      this.storage.get('registrationId').then(data => {
        this.registrationId = data;
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
    this.loadLang();
  }

  public login()
  {
    this.navCtrl.setRoot(LoginPage);
    
  }

  public register()
  {
    this.input.username = '';
    this.input.email = '';
    this.input.password = '';
    this.input.confirm = '';
  }

  loadLang(){
    this.api.getBahasa().then(lang => 
    {
      if(lang['error'] == undefined) {
        this.language = JSON.stringify(lang);
        this.language = lang;
        this.label_error_password_tidak_sama= lang['id'].login.label_error_password_tidak_sama;
        this.label_error_isikan_password = lang['id'].login.label_error_isikan_password;
        this.label_error_isian_ulang_password = lang['id'].login.label_error_isian_ulang_password;
        this.label_isikan_email_anda = lang['id'].login.label_isikan_email_anda;
        this.label_register_new = lang['id'].login.label_register_new;
        this.label_have_account = lang['id'].login.label_have_account;
        this.label_register = lang['id'].login.label_register;
        this.error_isian_kosong = lang['id'].login.error_isian_kosong;
        this.error_email = lang['id'].login.error_email;
        this.label_username = lang['id'].login.username;
        this.label_email = lang['id'].login.email;
        this.label_confirm = lang['id'].login.confirm_pass;
        
      }else{
        this.api.showAlert(JSON.stringify(lang['error']));
      }
    });
  }

  validateForm() {
    if(this.input.username.length == 0 || this.input.username.replace(/\s+/g, '') == "") {
      const toast = this.toastCtrl.create({
        message: this.error_isian_kosong,
        duration: 3000,
        position: 'top'
      });
      toast.present(toast);
      return false;

    }else if(this.input.email.length == 0 || this.input.email.replace(/\s+/g, '') == "" ){
      const toast = this.toastCtrl.create({
        message: this.label_isikan_email_anda,
        duration: 3000,
        position: 'top'
      });
      toast.present(toast);
      return false;
    
    }else if(!this.api.ValidateEmail(this.input.email.replace(/\s+/g, ''),this.error_email)){
      return false;

    }else if(this.input.password.length == 0 || this.input.password.replace(/\s+/g, '') == "" ){
      const toast = this.toastCtrl.create({
        message: this.label_error_isikan_password,
        duration: 3000,
        position: 'top'
      });
      toast.present(toast);
      return false;
    }else if(this.input.confirm.length == 0 || this.input.confirm.replace(/\s+/g, '') == ""){
      const toast = this.toastCtrl.create({
        message: this.label_error_isian_ulang_password,
        duration: 3000,
        position: 'top'
      });
      toast.present(toast);
      return false;

    }else if(this.input.password !== this.input.confirm){
      const toast = this.toastCtrl.create({
        message: this.label_error_password_tidak_sama,
        duration: 3000,
        position: 'top'
      });
      toast.present(toast);
      return false;

    }else {
        return true;
    }
    
  }

  public registrasi(){
    let valid = this.validateForm();
    
    if(valid){
        this.arr_token = this.api.random();
        this.param = {
            params: {
            ws: 'register',
            e: this.input.email,
            p: this.input.password,
            nama: this.input.username
            }
        };

        this.api.getApi(this.param).then(data => 
        {
            if(data['error'] == undefined) {
                if(data[0].status=='duplikasi'){
                  this.api.showAlert(data[0].pesan);
                }else{
                  this.ceklogin();
                }
                
            }else{
                this.api.showAlert(JSON.stringify(data['error']));
            }
        });
    }
  }

  ceklogin(){
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
          this.param = {
              params: {
                ws: 'push_subscription',
                apps:'ciaomodena',
                mode:"cek",
                registrasionid: this.registrationId,
                email: this.input.email
              }
          };
          this.api.getApi(this.param).then(msg => 
          {
            
            if( msg['langganan_id'] == "" ){
              this.param = {
                params: {
                  ws: 'push_subscription',
                  apps:'ciaomodena',
                  registrasionid: this.registrationId,
                  email: this.input.email
                }
              };
              this.api.getApi(this.param).then(msg => 
              {
                this.navCtrl.setRoot(HomePage);
              });
            }else{
              this.navCtrl.setRoot(HomePage);
            }
          })
          
      }else{
          this.api.showAlert(JSON.stringify(data['error']));
      }
    });
  }
}
