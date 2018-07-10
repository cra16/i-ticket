import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, NavController } from 'ionic-angular';

// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AuthProvider } from '../providers/auth/auth';
import { TicketProvider } from '../providers/ticket/ticket' ;
import { MyApp } from './app.component';
import { AngularFireAuth } from 'angularfire2/auth';
import { GooglePlus } from '@ionic-native/google-plus';

import { Camera } from '@ionic-native/camera';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase';

import { MyListPage } from '../pages/my-list/my-list';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { DetailPage } from '../pages/detail/detail';
import { BookingPage } from '../pages/booking/booking';
import { MainPage } from '../pages/main/main';
import { SellerLoginPage } from '../pages/seller-login/seller-login';
import { SellerRegisterPage } from '../pages/seller-register/seller-register';
import { SellerResetPwdPage } from '../pages/seller-reset-pwd/seller-reset-pwd';
import { SellerEditPage } from '../pages/seller-edit/seller-edit';
import { TicketInfoPage } from '../pages/ticket-info/ticket-info';
import { SellerTicketManagePage } from '../pages/seller-ticket-manage/seller-ticket-manage';
import { UserProvider } from '../providers/user/user';
import { SellerMainPage } from '../pages/seller-main/seller-main';
import { StarProvider } from '../providers/star/star';
import { StarReviewComponent } from '../components/star-review/star-review';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SellerMyListPage } from '../pages/seller-my-list/seller-my-list';
import { SellerSettingPage } from '../pages/seller-setting/seller-setting';

import { firebaseKey } from '../key/firebaseKey';
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
    BookingPage,
    MainPage,
    MyListPage,
    ListPage,
    LoginPage,
    SellerLoginPage,
    SellerRegisterPage,
    SellerEditPage,
    TicketInfoPage,
    SellerTicketManagePage,
    SellerMainPage,
    StarReviewComponent,
    SellerSettingPage,
    SellerMyListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      menuType: 'overlay',
      pageTransition: 'ios-transition',
      // TODO : icon 수정
      backButtonIcon: 'assets/icon/icon-ticket.svg',
      // // iconMode: 'ios',
      // modalEnter: 'modal-slide-in',
      // modalLeave: 'modal-slide-out',
      // tabbarPlacement: 'bottom',
      backButtonText: 'BACK',
    }),
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DetailPage,
    BookingPage,
    MainPage,
    MyListPage,
    ListPage,
    LoginPage,
    SellerLoginPage,
    SellerRegisterPage,
    TicketInfoPage,
    SellerEditPage,
    SellerTicketManagePage,
    SellerMainPage,
    StarReviewComponent,
    SellerSettingPage,
    SellerMyListPage
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
  ]
})
export class AppModule {}
