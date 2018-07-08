import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SellerMyListPage } from './seller-my-list';

@NgModule({
  declarations: [
    SellerMyListPage,
  ],
  imports: [
    IonicPageModule.forChild(SellerMyListPage),
  ],
})
export class SellerMyListPageModule {}
