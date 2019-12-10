import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListPromoPage } from './list-promo';

@NgModule({
  declarations: [
    ListPromoPage,
  ],
  imports: [
    IonicPageModule.forChild(ListPromoPage),
  ],
})
export class ListPromoPageModule {}
