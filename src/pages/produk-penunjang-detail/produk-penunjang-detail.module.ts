import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdukPenunjangDetailPage } from './produk-penunjang-detail';
import { UppercasePipe } from '../../pipes/uppercase/uppercase';


@NgModule({
  declarations: [
    ProdukPenunjangDetailPage,
    UppercasePipe
  ],
  imports: [
    IonicPageModule.forChild(ProdukPenunjangDetailPage),
  ],
})
export class ProdukPenunjangDetailPageModule {}
