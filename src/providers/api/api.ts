import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';
import { Storage } from '@ionic/storage';
import * as sha1 from 'sha1';
import { AlertController, ToastController,LoadingController,Events  } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
//import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Observable } from 'rxjs';
/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
export enum ConnectionStatusEnum {
    Online,
    Offline
}

@Injectable()
export class ApiProvider {
    private uuid: any ;
    public data_teknisi: any;
    moda: string = 'Production';
    base_url_ajax_modena: string = 'https://www.modena.co.id/';
    url_ajax_modena: string = 'https://www.modena.co.id/ws_index_ded.php';
    versi = '3.0.1';

    constructor(public httpClient: HttpClient, private device: Device, 
        private storage: Storage,
        private alertCtrl: AlertController,
        private transfer: FileTransfer,
        public loadingCtrl: LoadingController,
        //private sqlite: SQLite,
        private toastCtrl: ToastController,
        public events: Events,
        private network: Network) {
        //console.log('Hello ApiProvider Provider');
            this.storage.get('prof').then(profile => {
                this.data_teknisi = profile;
            });
            this.storage.get('mode').then(mode => {
                if(mode != null){
                this.moda = mode;
                }
            });
            events.subscribe('reload:created', eventData => { 
                this.storage.get('mode').then(mode => {
                    if(mode != null){
                    this.moda = mode;
                    }
                });
            });
    }
    getBahasa(){
        var url = 'http://air.modena.co.id/csapps/lang/lang.php';
        return new Promise(resolve => {
            this.httpClient.post(url, null).subscribe(
                (data) => {
                    resolve(data);
                }, err => {
                    resolve(err);
                });
        });

    }

    getUrl(url){
        return new Promise(resolve => {
            this.httpClient.get(url).subscribe(
                (data) => {
                    resolve(data);
                }, err => {
                    resolve(err);
                });
        });

    }
    getCSApi(param){
        
        var url = 'http://air.modena.co.id/csapps/';
        
        return new Promise(resolve => {
            this.httpClient.post(url, null,param).subscribe(
                (data) => {
                    resolve(data);
                }, err => {
                    resolve(err);
                });
        });

    }
    baseUrl(){
        return this.base_url_ajax_modena ;
    }
    getUrlCulinariaImage(param){
        return this.base_url_ajax_modena +'culinaria-image.php?img=' + param;
    }
    goCartCulinariaWeb(param){
        return this.base_url_ajax_modena +'culinaria-cart.php?id=' + param;
    }
    getApi(param){
        
        return new Promise(resolve => {
            this.httpClient.post(this.url_ajax_modena, null,param).subscribe(
                (data) => {
                    resolve(data);
                }, err => {
                    resolve(err);
                });
        });

    }

    getImage(param){
        var url = 'http://air.modena.co.id/csms_api/ws/upload/base.php';
        if(this.moda=='Development'){
            url = 'http://air.modena.co.id/csms_api_dev/ws/upload/base.php';
        }
        return new Promise(resolve => {
            this.httpClient.post(url, null,param).subscribe(
                (data) => {
                    resolve(data);
                }, err => {
                    resolve(err);
                });
        });

    }
    getProfile(param){
        var url = 'http://air.modena.co.id/csms_api/ws/upload/profile.php';
        if(this.moda=='Development'){
            url = 'http://air.modena.co.id/csms_api_dev/ws/upload/profile.php';
        }
        return new Promise(resolve => {
            this.httpClient.post(url, null,param).subscribe(
                (data) => {
                    resolve(data);
                }, err => {
                    resolve(err);
                });
        });

    }
  
    random() {
        if(this.device.isVirtual == null){
            this.uuid = '1234';
        }else{
            this.uuid = this.device.uuid;
        }
        let rand =  Math.floor(Math.random() * 90000) + 10000;
        let token = sha1('dsvp' + rand + this.uuid);  
        let arr= {
            rand: rand,
            sessid: this.uuid,
            token: token
        };
        return arr;
    }

    setmemory(name, arr_data){
        this.storage.set(name,arr_data);
    }

    getmemory(name){
        this.storage.get(name).then(data => {
            return data;
        });
    }

    showNotify(msg,judul){
        let alert = this.alertCtrl.create({
            title: judul,
            subTitle: JSON.stringify(msg).toString().replace(/"/g, ""),
            buttons: ['OK']
        }).present();
    }

    showAlert(msg){
        let alert = this.alertCtrl.create({
            title: '',
            subTitle: JSON.stringify(msg),
            buttons: ['OK']
        }).present();
    }
    showSuccess(msg){
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'middle'
          });
        
          toast.onDidDismiss(() => {
            console.log('Dismissed toast');
          });
        
          toast.present();
    }

    public initializeNetworkEvents(): void {
        //console.log('check inet');
        let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
            this.showAlert('Tidak ada jaringan internet');
          });
          disconnectSubscription.unsubscribe();
    }

    pushImage(picture, photo){
        const loader = this.loadingCtrl.create({
            content: "Uploading...",
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
        var url = this.url_ajax_modena + 'ws=upload_garansi';
        fileTransfer.upload(photo, url, options)
        .then((data) => { 
            loader.dismiss();
           status_upload = true;
           return status_upload;
        }, (err) => {
            loader.dismiss();
            alert("error : "+JSON.stringify(err));
            return status_upload;
        });
        //fileTransfer.abort();
        
    } 

    format_tanggal(s, ad){
        if(s== null){
            return;
        }
        var arr_tanggal = s.split("-")
        return arr_tanggal[2] + " " + ad[ parseInt( arr_tanggal[1] ) - 1 ] + " " + arr_tanggal[0]
    }

    format_number(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    ValidateEmail(mail,bahasa) {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(mail.match(mailformat)){
          return true;
        }else{
          const toast = this.toastCtrl.create({
            message: bahasa,
            duration: 3000,
            position: 'top'
          });
          toast.present(toast);
          return false;
        }
      }

    // public saveSql(query){
    //     this.sqlite.create({
    //         name: 'csms.db',
    //         location: 'default'
    //         }).then((db: SQLiteObject) => {

    //             db.executeSql(query)
    //             .then(res => {
    //                 console.log('insert');
    //                 return res;
    //             }).catch(e => console.log(e));

    //         }).catch(e => console.log(e));
            
    // }

    // public selectSql(query){
    //     this.sqlite.create({
    //         name: 'csms.db',
    //         location: 'default'
    //         }).then((db: SQLiteObject) => {

    //             db.executeSql(query, {})
    //             .then(res => {
                    
    //                 console.log('select');
                   
    //                 // for(var i=0; i<res.rows.length; i++) {
        
    //                 //     this.expenses.push({
    //                 //         rowid:res.rows.item(i).rowid,
    //                 //         date:res.rows.item(i).date,
    //                 //         type:res.rows.item(i).type,
    //                 //         description:res.rows.item(i).description,
    //                 //         amount:res.rows.item(i).amount})
    //                 // }
    //                 // console.log(JSON.stringify(this.expenses));
    //                 return res;
        
    //             }).catch(e => console.log(e));

    //         }).catch(e => console.log(e));    
    // }
}
