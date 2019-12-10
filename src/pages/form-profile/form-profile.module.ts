import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormProfilePage } from './form-profile';

@NgModule({
  declarations: [
    FormProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(FormProfilePage),
  ],
})
export class FormProfilePageModule {}
