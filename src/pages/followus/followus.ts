import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
/**
 * Generated class for the FollowusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-followus',
  templateUrl: 'followus.html',
})
export class FollowusPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FollowusPage');
  }

  open_insta(){
    window.open('http://instagram.com/modenaindonesia', '_system', 'location=yes');
  }
  open_youtube(){
    window.open('http://www.youtube.com/user/MODENAIndonesia', '_system', 'location=yes');
  }
  open_twiter(){
    window.open('http://www.twitter.com/modenaindonesia', '_system', 'location=yes');
  }
  open_fb(){
    window.open('http://www.facebook.com/pages/Modena-Indonesia/178878438821055', '_system', 'location=yes');
  }
  open_linked(){
    //window.open('http://instagram.com/modenaindonesia');
  }

}
