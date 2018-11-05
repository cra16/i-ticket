import { Component } from '@angular/core';
import { NavController, Platform, NavParams } from 'ionic-angular';
import { SellerRegisterPage } from '../seller-register/seller-register';
import { DetailPage } from '../detail/detail';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-seller-my-list',
  templateUrl: 'seller-my-list.html',
})
export class SellerMyListPage {

  // 시간, 단체별로 저장할 리스트
  list_team: Observable<any[]>;
  list_time: Array<any>;
  //month_list: Array<any> ;
  num: number;
  category: string = "time";
  test_month: Array<any> = Array(12).fill(0);
  month: Array<string> = Array(12).fill('14');
  monthForView: Array<number> = Array(12).fill(0);
  year: any;

  constructor(public navParams: NavParams,
              public navCtrl: NavController,
              public afs: AngularFirestore,
              public platform: Platform,
              private screen: ScreenOrientation,
              public userprovider:UserProvider) {
                
    // Lock vertical screen             
    // 네이티브에서만 적용되는 기능,
    // 마지막에 주석해제 하면 됨.
    this.screen.lock('portrait');
    let backAction = platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    }, 2)

    this.initializeItems();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SellerMyListPage');
  }

  initializeItems() {
    this.category = "time";
    console.log("이니셜 시작");
    this.afs.collection('concerts', ref => ref.where("uid","==",this.userprovider.getUID()).orderBy("date")).valueChanges().subscribe(data => {
      console.log(data);
      this.num = data.length;
      this.list_time = data;
      
      for (var i = 0; i < this.num; i++) {
        let time = new Date(this.list_time[i].date[0]);
        let month = time.getMonth();
        this.year = time.getFullYear();
        this.test_month[month] += 1;

        this.analyzeMonth(this.test_month);
        this.getYear(this.year);
      }
    });
    console.log(this.list_time);
    console.log("이니셜 끝");
  }

  getYear(year){
    this.year = year;
  }

  analyzeMonth(test) {
    let much = 0;
    for (var i = 0; i < 12; i++) {
      if (test[i] > 0) {
        much += 1;
      }
    }

    for (var i = 11; i > -1; i--) {
      if (test[i] > 0) {
        this.month[11 - i] = this.n(i);
        this.monthForView[11 - i] = i + 1;
      }
    }
  }

  goDetailPage(list) {
    this.navCtrl.push(DetailPage, { concert_obj: list });
  }
  ionViewWillUnload() {
    console.log("시자쿠");
  }
  n(n) {
    return n > 9 ? "" + (n + 1) : "0" + (n + 1);
  }

}