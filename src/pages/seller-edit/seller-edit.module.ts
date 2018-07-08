import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SellerEditPage } from './seller-edit';

@NgModule({
  declarations: [
    SellerEditPage,
  ],
  imports: [
    IonicPageModule.forChild(SellerEditPage),
  ],
})
export class SellerEditPageModule {}
