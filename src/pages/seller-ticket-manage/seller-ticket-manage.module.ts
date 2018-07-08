import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SellerTicketManagePage } from './seller-ticket-manage';

@NgModule({
  declarations: [
    SellerTicketManagePage,
  ],
  imports: [
    IonicPageModule.forChild(SellerTicketManagePage),
  ],
})
export class SellerTicketManagePageModule {}
