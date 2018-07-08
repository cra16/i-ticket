import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SellerRegisterPage } from './seller-register';

@NgModule({
  declarations: [
    SellerRegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(SellerRegisterPage),
  ],
})
export class SellerRegisterPageModule {}
