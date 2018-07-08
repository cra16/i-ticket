import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SellerSettingPage } from './seller-setting';

@NgModule({
  declarations: [
    SellerSettingPage,
  ],
  imports: [
    IonicPageModule.forChild(SellerSettingPage),
  ],
})
export class SellerSettingPageModule {}
