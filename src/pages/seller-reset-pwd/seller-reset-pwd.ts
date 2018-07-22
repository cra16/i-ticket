// Module
import { Component } from '@angular/core';
import { IonicPage, NavController, Alert, AlertController, MenuController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Platform } from 'ionic-angular/platform/platform';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
// Provider
import { AuthProvider } from '../../providers/auth/auth';
// Validator
import { EmailValidator } from '../../validators/email';

@IonicPage()
@Component({
  selector: 'page-seller-reset-pwd',
  templateUrl: 'seller-reset-pwd.html'
})
export class SellerResetPwdPage {
  public resetPasswordForm: FormGroup;

  constructor(public navCtrl: NavController, public authProvider: AuthProvider,
    public alertCtrl: AlertController, public formBuilder: FormBuilder,
    public menu: MenuController, public platform: Platform,
    private screen: ScreenOrientation) {
    // Lock vertical screen             
    // 네이티브에서만 적용되는 기능,
    // 마지막에 주석해제 하면 됨.
    // this.screen.lock('portrait');
    this.menu = menu;
    //백버튼눌렀을시 전페이지로
    let backAction = platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    }, 2)

    // this.menu.enable(false,'myMenu')
    // 위의 문장을 주석 처리하면 Sidemenu가 사용 가능해짐
    this.resetPasswordForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])]
    });
  }

  resetPassword(): void {
    if (!this.resetPasswordForm.valid) {
      console.log(`Form isn't valid, value: ${this.resetPasswordForm.value}`);
    } else {
      const email: string = this.resetPasswordForm.value.email;

      this.authProvider.resetPassword(email).then(user => {
        const alert: Alert = this.alertCtrl.create({
          message: "Check your email for a password reset link",
          buttons: [{
            text: "Ok",
            role: 'cancel',
            handler: () => { this.navCtrl.pop() }
          }]
        });
        alert.present()
      }).catch(error => {
        console.log("@ authProvider.resetPassword error : " + error);
        const errorAlert = this.alertCtrl.create({
          message: "존재하지 않는 이메일입니다.<br/>다시 확인하고 시도해주세요."
          ,
          buttons: [{
            text: "Ok",
            role: "cancel"
          }]
        });
        errorAlert.present();
      });
    }
  }
}

