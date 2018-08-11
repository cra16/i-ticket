// Module
import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
// Page
import { SellerLoginPage } from '../seller-login/seller-login';
// Provider
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController, public menu: MenuController,
              public auth: AuthProvider, private screen: ScreenOrientation) {
    // Lock vertical screen
    // 네이티브에서만 적용되는 기능,
    // 마지막에 주석해제 하면 됨.
    this.screen.lock('portrait');

    this.menu=menu;
    // this.menu.enable(false,'myMenu')
    // 위의 문장을 주석 처리하면 Sidemenu가 사용 가능해짐
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  // 판매자 로그인 페이지로 이동
  goToSellerLoginPage() {
    this.navCtrl.push(SellerLoginPage) ;
  }
}
