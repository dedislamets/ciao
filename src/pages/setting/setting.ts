import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { FormProfilePage } from '../form-profile/form-profile';
import { LoginProvider } from '../../providers/login/login';
/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage,
    private loginProvider:LoginProvider,
    private nav : Nav) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }
  logout(){
    this.loginProvider.logout();
    this.storage.remove('login');
    this.nav.setRoot(LoginPage);
  }
  profile(){
    this.navCtrl.push(FormProfilePage);
  }

}
