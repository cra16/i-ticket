// Module
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, NavController } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Camera } from '@ionic-native/camera';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GooglePlus } from '@ionic-native/google-plus';
// Providers
import { AuthProvider } from '../providers/auth/auth';
import { TicketProvider } from '../providers/ticket/ticket' ;
import { StarProvider } from '../providers/star/star';
import { UserProvider } from '../providers/user/user';
// Page
import { MyApp } from './app.component';
import { MyListPage } from '../pages/my-list/my-list';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { DetailPage } from '../pages/detail/detail';
import { MainPage } from '../pages/main/main';
import { SellerLoginPage } from '../pages/seller-login/seller-login';
import { SellerRegisterPage } from '../pages/seller-register/seller-register';
import { SellerResetPwdPage } from '../pages/seller-reset-pwd/seller-reset-pwd';
import { SellerEditPage } from '../pages/seller-edit/seller-edit';
import { SellerMainPage } from '../pages/seller-main/seller-main';
import { StarReviewComponent } from '../components/star-review/star-review';
import { SellerMyListPage } from '../pages/seller-my-list/seller-my-list';
import { SellerSettingPage } from '../pages/seller-setting/seller-setting';
import { SellerSignupPage } from '../pages/seller-signup/seller-signup';
import { SettingPage } from '../pages/setting/setting';
// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';

import { firebaseKey } from '../key/firebaseKey';
import { AlertProvider } from '../providers/alert/alert';

import { PolicyPage } from '../pages/policy/policy';

export const firebaseConfig = {
      apiKey: firebaseKey['apiKey'],
      authDomain: firebaseKey['authDomain'],
      databaseURL: firebaseKey['databaseURL'],
      projectId: firebaseKey['projectId'],
      storageBucket: firebaseKey['storageBucket'],
      messagingSenderId: firebaseKey['messagingSenderId']
};

@NgModule({
  declarations: [
    MyApp,
    DetailPage,
    MainPage,
    MyListPage,    
    ListPage,
    LoginPage,
    PolicyPage,
    SettingPage,
    SellerLoginPage,
    SellerRegisterPage,
    SellerEditPage,
    SellerMainPage,
    SellerResetPwdPage,
    SellerSignupPage,
    SellerSettingPage,
    SellerMyListPage,
    StarReviewComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      menuType: 'overlay',
      pageTransition: 'ios-transition',
      backButtonIcon: 'md-arrow-back',
      backButtonText: '',
      iconMode: 'md',
      scrollAssist: false, 
      autoFocusAssist: false,
      // modalEnter: 'modal-slide-in',
      // modalLeave: 'modal-slide-out',
      // tabbarPlacement: 'bottom',
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DetailPage,
    MainPage,
    MyListPage,
    ListPage,
    LoginPage,
    PolicyPage,
    SettingPage,
    SellerLoginPage,
    SellerRegisterPage,
    SellerEditPage,
    SellerMainPage,
    SellerSettingPage,
    SellerMyListPage,
    SellerResetPwdPage,
    SellerSignupPage,
    StarReviewComponent,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    ScreenOrientation,
    TicketProvider,
    AuthProvider,
    UserProvider,
    GooglePlus,
    AngularFireAuth,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    StarProvider,
    AngularFireDatabase,
    AlertProvider
  ]
})
export class AppModule {}
