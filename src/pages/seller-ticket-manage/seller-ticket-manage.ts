import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  selector: 'page-seller-ticket-manage',
  templateUrl: 'seller-ticket-manage.html',
})
export class SellerTicketManagePage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private screen: ScreenOrientation) {
  // Lock vertical screen             
  // 네이티브에서만 적용되는 기능,
  // 마지막에 주석해제 하면 됨.
  this.screen.lock('portrait');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SellerTicketManagePage');
  }

}
