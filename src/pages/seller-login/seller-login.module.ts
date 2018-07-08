import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SellerLoginPage } from './seller-login';

@NgModule({
  declarations: [
    SellerLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(SellerLoginPage),
  ],
})
export class SellerLoginPageModule {}
