import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormDetailPage } from './form-detail';

@NgModule({
  declarations: [
    FormDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(FormDetailPage),
  ],
})
export class FormDetailPageModule {}
