// Module
import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController,
         NavController, Alert, AlertController, MenuController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Platform } from 'ionic-angular/platform/platform';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
// Validator
import { EmailValidator } from '../../validators/email';
// Provider
import { AuthProvider } from '../../providers/auth/auth';
// Page
import { MainPage } from '../main/main';

@IonicPage()
@Component({
  selector: 'page-seller-login',
  templateUrl: 'seller-login.html'
})
export class SellerLoginPage {
  public loginForm: FormGroup;
  public loading: Loading;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, public authProvider: AuthProvider,
    public formBuilder: FormBuilder, public menu: MenuController,
    public platform: Platform, private screen: ScreenOrientation) {
    // Lock vertical screen
    // 네이티브에서만 적용되는 기능,
    // 마지막에 주석해제 하면 됨.
    // this.screen.lock('portrait');

    //백버튼눌렀을시 전페이지로
    let backAction = platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    }, 2)

    this.menu = menu;
    // this.menu.enable(false,'myMenu')
    // 위의 문장을 주석 처리하면 Sidemenu가 사용 가능해짐
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });

  }

  goToSellerSignupPage() {
    this.navCtrl.push('SellerSignupPage');
  }

  goToSellerResetPwdPage() {
    this.navCtrl.push('SellerResetPwdPage');
  }

  SellerLogin() {
    if (!this.loginForm.valid) {}
    else {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      this.authProvider.loginUser(email, password).then(authData => {
        this.loading.dismiss().then(() => {
          this.navCtrl.setRoot(MainPage);
        }).catch(error => {
          console.log("@ loading dismiss error : " + error);
        });
      }).catch(error => {
        console.log("@ authProvider loginUser error : " + error);
        this.loading.dismiss().then(() => {
          const alert: Alert = this.alertCtrl.create({
            message: error.message,
            buttons: [{ text: 'Ok', role: 'cancel' }]
          });
          alert.present();
        });
      });
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }
}
