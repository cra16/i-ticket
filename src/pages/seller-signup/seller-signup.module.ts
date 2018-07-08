import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SellerSignupPage } from './seller-signup';

@NgModule({
  declarations: [
    SellerSignupPage,
  ],
  imports: [
    IonicPageModule.forChild(SellerSignupPage),
  ],
})
export class SellerSignupPageModule {}
