import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, NavController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MainPage } from '../pages/main/main';
import { ListPage } from '../pages/list/list';
import { MyListPage } from '../pages/my-list/my-list';
import { LoginPage } from '../pages/login/login';
import { DetailPage } from '../pages/detail/detail';
import { SellerLoginPage } from '../pages/seller-login/seller-login';
import { SellerRegisterPage } from '../pages/seller-register/seller-register';
import { SellerMainPage } from '../pages/seller-main/seller-main';

import { AuthProvider } from '../providers/auth/auth';
import { UserProvider } from '../providers/user/user'

// Firebase
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import firebase from 'firebase';
import { AngularFireAction } from 'angularfire2/database/interfaces';
import { Toast } from 'ionic-angular/components/toast/toast';
import { SellerSettingPage } from '../pages/seller-setting/seller-setting';
import { SellerMyListPage } from '../pages/seller-my-list/seller-my-list' ;

import { firebaseKey } from '../key/firebaseKey';
import { SettingPage } from '../pages/setting/setting';
firebase.initializeApp({
  apiKey: firebaseKey['apiKey'],
  authDomain: firebaseKey['authDomain'],
  databaseURL: firebaseKey['databaseURL'],
  projectId: firebaseKey['projectId'],
  storageBucket: firebaseKey['storageBucket'],
  messagingSenderId: firebaseKey['messagingSenderId']
});

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: NavController;
  user_id: any;
  user_uid: any;
  user_email: any;
  user_photo: any;
  rootPage: any = LoginPage;
  pages: Array<{ title: string, component: any }>;

  userDoc: AngularFirestoreDocument<any>;
  concertDoc: AngularFirestoreDocument<any>;
  user: Observable<any>;
  concert: Observable<any>;
  public counter=0;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public authProvider: AuthProvider,
              public userProvider: UserProvider,
              private afs: AngularFirestore,
              public toastCtrl: ToastController) {
    this.initializeApp();

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      platform.registerBackButtonAction(() => {
        if (this.counter == 0) {
          this.counter++;
          this.presentToast();
          setTimeout(() => { this.counter = 0 }, 3000)
        } else {
          platform.exitApp();
        }
      }, 0)
    }).catch(error => {
      console.log("@ platform ready error : " + error);
    });
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: "끝내시려면 종료버튼을 한번 더 눌러주세요",
      duration: 3000,
      position: "bottom"
    });
    toast.present();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    }).catch(error => {
      console.log("@ platform ready error : " + error);
    });

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.rootPage = MainPage;
        this.userProvider.initialize(user).then(() => {
        this.user_id = this.userProvider.getGroupName();
        this.user_email = this.userProvider.getEmail();
        }).catch(error => {
          console.log("@ userProvider initialize error : " + error);
        });
      }
      else {
        this.rootPage = LoginPage;
      }
    });
  }

  openPage(page) {
    this.navCtrl.setRoot(page.component);
  }
  goMainPage() {
    this.userProvider.getIsSeller() == true ? this.navCtrl.setRoot(SellerMainPage) : this.navCtrl.setRoot(MainPage) ;
  }
  goMyListPage() {
    this.userProvider.getIsSeller() == true ? this.navCtrl.setRoot(SellerMyListPage) : this.navCtrl.setRoot(MyListPage) ;
  }
  goSettingPage() {
    this.userProvider.getIsSeller() == true ? this.navCtrl.push(SellerSettingPage) : this.navCtrl.push(SettingPage) ;
  }
  Logout() {
    this.authProvider.logoutUser().then(() => {
      this.navCtrl.setRoot(LoginPage, { user_id: this.user_id });
    }).catch(error => {
      console.log("@ authProvider logoutUser error : " + error);
    });;
  }
}
