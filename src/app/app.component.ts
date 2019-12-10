import { Component, ViewChild } from '@angular/core';
import { AlertController, Nav,NavController, Platform, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device';
import { ApiProvider } from '../providers/api/api';
import { AuthService } from '../services/auth.services';
import { HomePage } from '../pages/home/home';
import { RegisterPage } from '../pages/register/register';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from './app.config.firebase';
import { SettingPage } from '../pages/setting/setting';
import { ListProdukGaransiPage } from '../pages/list-produk-garansi/list-produk-garansi';
import { ListExperiencePage } from '../pages/list-experience/list-experience';
import { ListPromoPage } from '../pages/list-promo/list-promo';
import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser';

export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
}

@Component({
  templateUrl: 'app.html',
  providers: [ApiProvider]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild('mycontent') childNavCtrl: NavController;

  public param:any;
  public arr_token: any;
  rootPage: any;
  imageURL:any;
  

  pages: PageInterface[] = [
    { title: 'Home', pageName: 'HomePage', tabComponent: 'HomePage', icon: 'home' },
    { title: 'Registrasi', pageName: 'RegisterPage', tabComponent: 'RegisterPage', icon: 'create' },
    { title: 'Experience', pageName: 'TabsPage', tabComponent: 'Tab2Page', index: 2, icon: 'pizza' },
    { title: 'Latest News', pageName: 'TabsPage',tabComponent: 'SpecialPage', index: 2, icon: 'bookmarks' },
    { title: 'Online Shopping', pageName: 'TabsPage',tabComponent: 'SpecialPage', index: 2, icon: 'basket' },
    { title: 'Keluar', pageName: 'LogoutPage',tabComponent: 'LogoutPage', icon: 'log-out' },
  ];

  //pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, 
            public splashScreen: SplashScreen,
            public alertCtrl: AlertController,
            private storage: Storage,
            private iab: InAppBrowser,
            private device: Device,
            public api: ApiProvider,
            private push: Push,
            private auth: AuthService,
            public app: App) {
              
              this.initializeApp();
              this.pushsetup();
              this.imageURL =  './assets/images/profile.png';

              
              
  }
  

  ionViewDidLoad() {
   
  }


  initializeApp() {
    
    this.platform.ready().then(() => {
      this.splashScreen.hide();  
      this.statusBar.styleDefault();
      
      //this.getBahasa();    
    });
  }

  openPage(page: PageInterface) {
    let params = {};
    //this.rootPage=TabsPage;
    
    // The index is equal to the order of our tabs inside tabs.ts
    if (page.index != null) {
      params = { tabIndex: page.index };
    }

    if (this.nav.getActiveChildNav() && page.index != undefined) {
      console.log(params);
      this.app.getRootNav().push(page.pageName, params)
    } else {
      this.nav.setRoot(page.pageName, params);
    }
  }

  setting() {
    this.nav.setRoot(SettingPage);
  }

  registrasi(){
    this.nav.swipeBackEnabled = false;
    this.nav.setRoot(ListProdukGaransiPage);

  }
  experience(){
    this.nav.swipeBackEnabled = false;
    this.nav.setRoot(ListExperiencePage);
  }
  promo(){
    this.nav.swipeBackEnabled = false;
    this.nav.setRoot(ListPromoPage);
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

  home(){
    this.nav.setRoot(HomePage);

  }

  getBahasa(){

    this.api.getBahasa().then(data => 
    {
      if(data['error'] == undefined) {
        this.api.setmemory('lang',data);
      }else{
        this.api.showAlert(JSON.stringify(data['error']));
      }
    });
  }

  pushsetup(){
    this.rootPage=HomePage;
    
    const options: PushOptions = {
      android: {
          senderID:"532413195561",
          sound:  true,
          vibrate: true,
          
          //forceShow: true,
      },
      ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
      }
   };
   
    const pushObject: PushObject = this.push.init(options);
   
   
    pushObject.on('registration').subscribe((registration: any) => {
      //alert(JSON.stringify(registration));
      this.storage.set('registrationId', registration.registrationId);
    });

    pushObject.on('notification').subscribe((notification: any) =>{
      console.log('Received a notification', notification);
  
     let confirmAlert = this.alertCtrl.create({
            title: notification['title'],
            message: notification['message'],
            buttons: [{
              text: 'Abaikan',
              role: 'cancel'
            }, 
            // {
            //   text: 'Lihat',
            //   handler: () => {
            //     alert(JSON.stringify(notification));
            //     //self.nav.push(DetailsPage, {message: data.message});
            //     //this.app.getRootNav().push('NotifikasiPage');
            //     //this.nav.setRoot('NotifikasiPage');
            //   }
            // }
          ]
          });
           confirmAlert.present();
    });
   
    pushObject.on('error').subscribe(error => alert(error));
    
  }

}
