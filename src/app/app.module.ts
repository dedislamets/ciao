import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MenuPage } from '../pages/menu/menu';

import { LoginPage } from '../pages/login/login';
import {  Camera  } from '@ionic-native/camera';  
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LayoutLoginComponent } from '../pages/layout-login/layout-login';

import { RegisterPage } from '../pages/register/register';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { Device } from '@ionic-native/device';

import { ApiProvider } from '../providers/api/api';
import {  Network   } from '@ionic-native/network'; 
import { GooglePlus } from '@ionic-native/google-plus';
import { ReactiveFormsModule } from '@angular/forms';
import { FileTransfer } from '@ionic-native/file-transfer';
import { LoginProvider } from '../providers/login/login';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../services/auth.services';
import { RegisterProdukPage } from '../pages/register-produk/register-produk';
//import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ModalItemCashbackPage } from '../pages/modal-item-cashback/modal-item-cashback';
import { SafeHtmlPipe } from '../pipes/safe-html/safe-html';
import { ListProdukGaransiPage } from '../pages/list-produk-garansi/list-produk-garansi';
import { FormDetailPage } from '../pages/form-detail/form-detail';
import { ModalmanualbookPage } from '../pages/modalmanualbook/modalmanualbook';
import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { RegistrasiKontrakServicePage } from '../pages/registrasi-kontrak-service/registrasi-kontrak-service';
//import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ProdukPenunjangDetailPage } from '../pages/produk-penunjang-detail/produk-penunjang-detail';
import { KeysPipe } from '../pipes/keys/keys';
import { SyaratKetentuanPage } from '../pages/syarat-ketentuan/syarat-ketentuan';
import { RegistrasiServicePage } from '../pages/registrasi-service/registrasi-service';
import { ListExperiencePage } from '../pages/list-experience/list-experience';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { DetailExperiencePage } from '../pages/detail-experience/detail-experience';
import { ListPromoPage } from '../pages/list-promo/list-promo';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SettingPage } from '../pages/setting/setting';
import { FormProfilePage } from '../pages/form-profile/form-profile';
import { FollowusPage } from '../pages/followus/followus';
import { ForgotpassPage } from '../pages/forgotpass/forgotpass';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
//import { UpperCasePipe } from '@angular/common';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { ScannerPage } from '../pages/scanner/scanner';

export const firebaseConfig = {
	fire: {
		apiKey: "AIzaSyDnP2cocGByGh9V60XToMpDDz3TIBgx7lE",
    authDomain: "ciao-360cb.firebaseapp.com",
    databaseURL: "https://ciao-360cb.firebaseio.com",
    projectId: "ciao-360cb",
    storageBucket: "ciao-360cb.appspot.com",
    messagingSenderId: "532413195561",
    appId: "1:532413195561:web:1515a7d11417ec0e"

	}
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DetailExperiencePage,
    LayoutLoginComponent,
    LoginPage,
    RegisterPage,
    RegisterProdukPage,
    RegistrasiKontrakServicePage,
    RegistrasiServicePage,
    ListProdukGaransiPage,
    ListExperiencePage,
    ListPromoPage,
    MenuPage,
    ModalItemCashbackPage,
    FormDetailPage,
    ModalmanualbookPage,
    ProdukPenunjangDetailPage,
    SyaratKetentuanPage,
    SafeHtmlPipe,
    KeysPipe,
    SettingPage,
    FormProfilePage,
    FollowusPage,
    ForgotpassPage,
    ScannerPage
    //UpperCasePipe
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig.fire),
  ],
  exports: [
    LayoutLoginComponent,
	],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DetailExperiencePage,
    LayoutLoginComponent,
    LoginPage,
    RegisterPage,
    MenuPage,
    RegisterProdukPage,
    RegistrasiServicePage,
    RegistrasiKontrakServicePage,
    ModalItemCashbackPage,
    ListProdukGaransiPage,
    ListExperiencePage,
    ListPromoPage,
    FormDetailPage,
    FormProfilePage,
    ModalmanualbookPage,
    ProdukPenunjangDetailPage,
    SyaratKetentuanPage,
    FollowusPage,
    ForgotpassPage,
    SettingPage,
    ScannerPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Device,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    Network,
    FileTransfer,
    ScreenOrientation,
    GooglePlus,
    LoginProvider,
    AngularFireAuth,
    AuthService,
    Camera,
    //BarcodeScanner,
    InAppBrowser,
    YoutubeVideoPlayer,
    //SQLite,
    Push,
    Facebook,
    QRScanner 
  ]
})
export class AppModule {}
