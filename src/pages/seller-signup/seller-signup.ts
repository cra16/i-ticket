// Module
import { Component } from '@angular/core';
import { AlertController, IonicPage, Loading, LoadingController, NavController, MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { AbstractControl } from '@angular/forms/src/model';
import { Platform } from 'ionic-angular/platform/platform';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
// Providers
import { AuthProvider } from '../../providers/auth/auth';
// Validator
import { EmailValidator } from '../../validators/email';
import { PhoneValidator } from '../../validators/phone';
// Page
import { SellerLoginPage } from '../seller-login/seller-login';
import { SellerMainPage } from '../seller-main/seller-main';

@IonicPage()
@Component({
  selector: 'page-seller-signup',
  templateUrl: 'seller-signup.html'
})

export class SellerSignupPage {
  public signupForm: FormGroup;
  public loading: Loading;

  constructor(public navCtrl: NavController, public authProvider: AuthProvider,
              public loadingCtrl: LoadingController, public alertCtrl: AlertController,
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
    }, 2) ;
    this.menu=menu;
    // this.menu.enable(false,'myMenu');
    // 위의 주석을 해제하면 Sidemenu가 사용 불가능해짐
    this.signupForm = formBuilder.group({
      name: ['', Validators.compose([Validators.minLength(2), Validators.required])],
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      password2: ['', Validators.compose([Validators.required, this.equalTo('password')])],
      phoneNumber: ['', Validators.compose([Validators.minLength(10), PhoneValidator.isValid])]
    });
  }
  private equalTo(field_name): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let input = control.value;
      let isValid = control.root.value[field_name] === input;

      if (!isValid)
        return { 'equalTo': { isValid } }
      else
        return null;
    };
  }

  signupUser(): void {
    if (!this.signupForm.valid) {
      console.log(
        `Need to complete the form, current value: ${this.signupForm.value}`
      );
    } else {
      const name: string = this.signupForm.value.name;
      const email: string = this.signupForm.value.email;
      const password: string = this.signupForm.value.password;
      const phoneNumber: string = this.signupForm.value.phoneNumber;

      this.authProvider.signupUser(name, email, password, phoneNumber)
      .then(user => {
        this.loading.dismiss()
        .then(() => {
          // auth.ts 내에서 signupUser method가 성공했으면 true을 돌려받고 실패했으면 false을 돌려받는다.
          // 이를 통해서 회원가입이 성공했을 시에는 LoginPage로 이동, 그 외에는 기존 page에 머무른다.
          if (user) {
            /*
            TODO: 회원가입이 되면, auth를 통해서 로그인을 시키고
            자동으로 sellerMainPage로 리다이렉트 시키는 게 좋아보인다.
            */
            this.authProvider.loginUser(email, password);
            this.navCtrl.setRoot(SellerMainPage);
          }
        }).catch(error => {
          console.log("@ loading.dismiss error : " + error);
        });
      }).catch(error => {
        console.log("@ authProvider.signupUser error : " + error);
      });
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }
}
