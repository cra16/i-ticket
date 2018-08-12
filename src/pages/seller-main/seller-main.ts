import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,MenuController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController,
     public navParams: NavParams, public afs: AngularFirestore,
    public user: UserProvider, private screen: ScreenOrientation, 
    public menu: MenuController) {
    // Lock vertical screen             
    // 네이티브에서만 적용되는 기능,
    // 마지막에 주석해제 하면 됨.
    this.screen.lock('portrait');
    this.menu=menu;
    this.menu.enable(true,'myMenu');
    this.initialize();
  }

  initialize() {
    this.username = this.user.getGroupName();
    this.afs.collection('userProfile').doc(this.user.obj['uid'])
            .collection('concerts',ref => ref.where('status','==','판매 중')).valueChanges().subscribe(data => {
              this.concert_list = data ;
            }) ;
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
