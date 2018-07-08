import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserProvider } from '../../providers/user/user';
import { DetailPage } from '../detail/detail';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SellerRegisterPage } from '../seller-register/seller-register';

@IonicPage()
@Component({
  selector: 'page-seller-main',
  templateUrl: 'seller-main.html',
})
export class SellerMainPage {
  concert_list: Array<any>;
  username: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public afs: AngularFirestore,
    public user: UserProvider, private screen: ScreenOrientation) {
    // Lock vertical screen             
    // 네이티브에서만 적용되는 기능,
    // 마지막에 주석해제 하면 됨.
    // this.screen.lock('portrait');
    this.initialize();
  }

  initialize() {
    this.username = this.user.getGroupName();
    this.afs.collection('userProfile').doc(this.user.obj['uid'])
            .collection('concerts').valueChanges().subscribe(data => {
              this.concert_list = data ;
            }) ;
    // for(let i = 0 ; i < this.concert_list.length ; i++) {
    //   let Ref = this.afs.collection('concerts').doc(this.concert_list[i]['id']) ;
    //   for (let j = 0 ; j < this.concert_list['date'].length ; j ++){
    //     console.log("hi~") ;
    //   }
    // }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SellerMainPage');
  }

  goManagePage(slide) {
    this.navCtrl.push(DetailPage, { concert_obj: slide });
  }
  //목록추가 기능
  addItem() {
    this.navCtrl.push(SellerRegisterPage);
  }
}
