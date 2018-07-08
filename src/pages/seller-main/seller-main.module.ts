import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SellerMainPage } from './seller-main';

@NgModule({
  declarations: [
    SellerMainPage,
  ],
  imports: [
    IonicPageModule.forChild(SellerMainPage),
  ],
})
export class SellerMainPageModule {}
