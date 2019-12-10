import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { ModalmanualbookPage } from '../modalmanualbook/modalmanualbook';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { RegistrasiKontrakServicePage } from '../registrasi-kontrak-service/registrasi-kontrak-service';
import { RegistrasiServicePage } from '../registrasi-service/registrasi-service';
/**
 * Generated class for the FormDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-form-detail',
  templateUrl: 'form-detail.html',
})
export class FormDetailPage {
  konsumen_id: any;
  product_id:any;
  param:any;
  arr_tanggal:any;
  nama_produk:String;
  product:string;
  nomorseri:string;
  purchaseat:string;
  text_status_garansi:string;
  tanggal_pembelian:string;
  input_b_download:string;
  input_b_permintaan_servis:string;
  input_b_kontrak_servis:string;
  kontainer_info_kontrak_servis_tanggal_registrasi:string;
  img_produk:string;
  valid:string;
  profile:any;
  language:any;
  kontrak_servis_registrasi:any;
  kontainer_info_kontrak_servis_nomor:string;
  kontainer_info_kontrak_servis_status_registrasi:string;
  kontainer_info_kontrak_servis_masa_berlaku:string;
  kontainer_info_kontrak_servis_jadwal_kunjungan:string;
  label_tanggal_registrasi:string;
  label_kontrak_servis:string;
  label_nomor :string;
  label_masa_berlaku:string;
  label_jadwal_kunjungan:string;
  label_jadwal_kunjungan_terdekat:string;
  tabel_info_registrasi_kontrak_servis:boolean = false;
  tabel_info_kontrak_servis:boolean = false;
  spot_light_ada:boolean = false;
  arr_history:any;
  sURL = new Array();
  listVideo:any = [];
  arr_bulan = new Array("Januari","Februari","Maret","April", "Mei","Juni","Juli","Agustus","September","Oktober","November","Desember");

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    public modalCtrl: ModalController,
    private youtube: YoutubeVideoPlayer,
    private storage: Storage,) {
    this.konsumen_id = navParams.get("konsumen_id");
    this.profile = navParams.get("profile");
    
    this.sURL[0] = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=5&playlistId=PLURGZCKR6IhntTWh51X5Z3LoVpS2S4cBJ&key=AIzaSyD-P-LYczIg4nOQyHZqWYxC2cEs5sQjibI";
    this.sURL[1] = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=5&playlistId=PLURGZCKR6IhlFpmeWlJRQSECh8l-tVy-K&key=AIzaSyD-P-LYczIg4nOQyHZqWYxC2cEs5sQjibI";
    storage.get('login').then(getData => {
      if (getData) {
        this.profile = getData;
      }else{
        this.navCtrl.setRoot(LoginPage);
      }
    });
    this.product_id = navParams.get("item").membersproductid;
    
    this.img_produk = './assets/images/img-not-found.jpg';
  }

  ionViewDidLoad() {
    this.loadLang();
    this.load_awal_index_detail();
    
  }

  load_awal_index_detail(){
    if(this.navParams.get("c") == 'muat_video'){

    }else{
      this.load_profil_produk( this.konsumen_id, this.product_id );
      this.load_riwayat_produk(this.product_id);
    }
    
  
  }
  loadLang(){
    this.api.getBahasa().then(lang => 
      {       
        if(lang['error'] == undefined) {
          this.language = JSON.stringify(lang);
          this.language = lang;
          this.input_b_download = lang['id'].index.input_b_download;
          this.input_b_permintaan_servis = lang['id'].index.input_b_permintaan_servis;
          this.input_b_kontrak_servis = lang['id'].index.input_b_kontrak_servis;
          this.label_kontrak_servis = lang['id'].index.label_kontrak_servis;
          this.label_tanggal_registrasi = lang['id'].index.label_tanggal_registrasi;
          this.label_nomor = lang['id'].index.label_nomor;
          this.label_masa_berlaku = lang['id'].index.label_masa_berlaku;
          this.label_jadwal_kunjungan = lang['id'].index.label_jadwal_kunjungan;
          this.label_jadwal_kunjungan_terdekat = lang['id'].index.label_jadwal_kunjungan_terdekat;
          this.kontainer_info_kontrak_servis_status_registrasi = lang['id'].index.kontainer_info_kontrak_servis_status_registrasi;
        }else{
          this.api.showAlert(JSON.stringify(lang['error']));
        }
      });
  }
  load_profil_produk(kid,id){
    let arrid = new Array(id);
    this.param = {
      params: {
        ws: 'memberproduk',
        memberid: kid,
        membersproductid: arrid,
        c:''
      }
    };

    this.api.getApi(this.param).then(data => 
    {
      this.arr_tanggal = data[0].purchasedate.split("-");
      this.nama_produk = typeof data[0].nama_produk == "undefined" ? data[0].product : data[0].nama_produk;
      this.product =  data[0].product;
      this.nomorseri =  data[0].serialnumber;
      this.purchaseat = data[0].purchaseat;
      this.img_produk = "http://www.modena.co.id/images/product/" + this.nama_produk + ".png";
      this.tanggal_pembelian = this.arr_tanggal[2] + " " + this.arr_bulan[ parseInt( this.arr_tanggal[1] ) - 1 ] + " " + this.arr_tanggal[0];
      this.cek_data_garansi(this.nomorseri);
      this.load_data_youtube( this.product );
      this.load_data_kontrak_servis(data);

    });
  }
  load_riwayat_produk(pid){
    this.param = {
      params: {
        ws: 'riwayat_memberproduk',
        l: 'id',
        membersproductid: pid,
      }
    };

    this.api.getApi(this.param).then(data => 
    {
        this.arr_history = data;
        for(var k = 0; k < this.arr_history.length; k++){
          var arr_tanggal_waktu = data[k].tanggal_transaksi.split(" ");
          var arr_tanggal = arr_tanggal_waktu[0].split("-");
        
          this.arr_history[k]['tanggal'] = arr_tanggal[2] + " " + this.arr_bulan[ parseInt( arr_tanggal[1] ) - 1 ] + " " + arr_tanggal[0] ;
          this.arr_history[k]['jam'] = arr_tanggal_waktu[1];
          this.arr_history[k]['detail'] = data[k].detail_mode.split('<br />').join("<div style='padding:5px'></div>");
        }
    });
  }
  load_data_kontrak_servis(data){
    if(data[0].kontrak_servis_registrasi == 1 || typeof data[0].data_kontrak_servis != "undefined" ){
      this.kontrak_servis_registrasi=1;
    }
    if( typeof data[0].data_kontrak_servis != "undefined" ){
      this.tabel_info_kontrak_servis = true;
      this.kontainer_info_kontrak_servis_nomor = data[0].data_kontrak_servis[0].nomor_kks;
      this.kontainer_info_kontrak_servis_masa_berlaku = this.api.format_tanggal( data[0].data_kontrak_servis[0].date_from_formatted, this.arr_bulan ) + " "+ this.language.id.index.label_sampai_dengan+"<br /> " + this.api.format_tanggal( data[0].data_kontrak_servis[0].date_to_formatted, this.arr_bulan );
      var string_jadwal = "<table cellpadding=0 cellspacing=0 width=100% border=0>";
      var set_tanggal_terdekat = false;
      var asterisk = "";
      for(var x = 0; x < data[0].data_kontrak_servis.length; x++){
        if( data[0].data_kontrak_servis[x].tanggal_jadwal_formatted == "1900-01-01" ) {
          continue;
        }
        asterisk = !set_tanggal_terdekat && data[0].data_kontrak_servis[x].index_tanggal_jadwal >= 0 ? "<strong style='color:red'>*</strong>" : "";
        var strong = asterisk != "" ? "style='font-weight:900'" : "";
        set_tanggal_terdekat = !set_tanggal_terdekat && asterisk != "" ? true : set_tanggal_terdekat;
        string_jadwal += "<tr><td style='padding-right:10px' width=20px "+ strong +">"+ (x+1) +". </td><td "+ strong +">"+ this.api.format_tanggal( data[0].data_kontrak_servis[x].tanggal_jadwal_formatted, this.arr_bulan ) + asterisk + "</td></tr>";
      }
      string_jadwal += "</table>";
      this.kontainer_info_kontrak_servis_jadwal_kunjungan  = string_jadwal;
      
    }else{
      this.tabel_info_registrasi_kontrak_servis = true;
      this.kontainer_info_kontrak_servis_tanggal_registrasi = this.api.format_tanggal( data[0].kontrak_servis_registrasi_tanggal, this.arr_bulan );
    }
  }
  load_data_youtube(np){
    var tag_produk = new Array();
    var arr_nama_produk = np.replace(/MODENA/gi, "").split(" ");
    var nama_produk = "";
    
    for( var x = 0; x<arr_nama_produk.length; x++ ){
      if( arr_nama_produk[x].length > 1 ){
        tag_produk[ tag_produk.length ] = arr_nama_produk[x].trim();
        nama_produk += arr_nama_produk[x] + " "
      }
    }
    nama_produk = nama_produk.trim()
    tag_produk[ tag_produk.length ] = nama_produk;
    for( var x=0; x< tag_produk.length; x++ ){
		  this.inisialisasi_youtube(tag_produk[x]);
    }
  }
  inisialisasi_youtube(kata_kunci){
    for( var x=0; x < this.sURL.length; x++ ){
      this.muat_youtube( x, this.sURL[x], kata_kunci )
    }
  }

  muat_youtube( counter, urlx, kata_kunci ){
    
    this.api.getUrl(urlx).then(msg => 
    {
      this.gambar_thumbnail_youtube( counter, msg, kata_kunci )
    });
  }

  gambar_thumbnail_youtube( counter, data, kata_kunci ){
    var string_konten = "";
    for( var x=0; x < data.items.length; x++ ){
        //var imgsrc = data.items[x].snippet.thumbnails.default;
        if( data.items[x].snippet.title.indexOf( kata_kunci ) !== -1 || data.items[x].snippet.description.indexOf( kata_kunci ) !== -1 ){
          // string_konten += "<td>";
          // string_konten += "    <div class='yt-kontainer-utama' style='margin-right: 5px;width:"+ imgsrc.width +"px; height:"+ imgsrc.height +"px; ' >";
          // string_konten += "      <img onclick='muat_video(\""+ data.items[x].contentDetails.videoId +"\")'  src='"+ imgsrc.url +"' style='z-index:1;width:"+ imgsrc.width +"px; height:"+ imgsrc.height +"px;'  />";
          // string_konten += "      <div class='yt-kontainer-watermark'><img src='../../assets/images/play.png' class=\"watermark\"  /></div>";
          // string_konten += "    </div>";
          // string_konten += "</td>";
          this.spot_light_ada = true;
          this.listVideo.push(data.items[x]);
        }  
    }
    if( string_konten.length > 0 ) {
      //parent.document.getElementById("kontainer_youtube").style.display = "block";
    }
    //document.getElementById("y_kontainer").innerHTML += string_konten;
    
    //loading halaman selanjutnya	
    if( data.pageInfo.totalResults > data.pageInfo.resultsPerPage && typeof data.nextPageToken !== "undefined" ){
      this.muat_youtube(  counter,  this.sURL[ counter ] + "&pageToken=" + data.nextPageToken, kata_kunci )
    }
  }

  muat_video(videoId){
    this.youtube.openVideo(videoId);
  }

  cek_data_garansi(ps){
    console.log(this.profile.email);
    this.param = {
      params: {
        c: 'info_registrasi_garansi',
        cs: 'info_konsumen_produk',
        e: this.profile.email,
        s: ps
      }
    };

    this.api.getCSApi(this.param).then(data => 
    {
      if(data[0] == undefined){
        this.text_status_garansi = this.language['id']['index']['label_garansi_belum_diverifikasi'];
      }else{
        this.valid='1';
        this.text_status_garansi = this.language['id']['index']['label_garansi_telah_diverifikasi'];
      }
      
    });
  }

  download(){
    let modal = this.modalCtrl.create(ModalmanualbookPage,
      {
        content: this,
        
      });
    modal.present();
  }

  kontrakServis(){
    this.navCtrl.push(RegistrasiKontrakServicePage,{
      produk_id: this.product_id
    });
  }

  permintaanservis(){
    this.navCtrl.push(RegistrasiServicePage,{
      produk_id: this.product_id
    });
  }
}
