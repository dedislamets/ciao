import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterProdukPage } from './register-produk';

@NgModule({
  declarations: [
    RegisterProdukPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterProdukPage),
  ],
})
export class RegisterProdukPageModule {}
