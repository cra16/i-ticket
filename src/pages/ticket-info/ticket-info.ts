import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { UserProvider } from '../../providers/user/user';
import firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import { TicketProvider } from '../../providers/ticket/ticket';
import { Platform } from 'ionic-angular/platform/platform';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  selector: 'page-ticket-info',
  templateUrl: 'ticket-info.html',
})
export class TicketInfoPage {

  ticket_idx: any;
  info: Object = [];
  concert: Object;
  username: string;
  endTime: Date;
  finalDate: Date;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afs: AngularFirestore,
    public user: UserProvider,
    public ticket: TicketProvider,
    public platform: Platform,
    private screen: ScreenOrientation) {
    // Lock vertical screen             
    // 네이티브에서만 적용되는 기능,
    // 마지막에 주석해제 하면 됨.
    this.screen.lock('portrait');
    
    //백버튼눌렀을시 전페이지로
    let backAction = platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    }, 2)
    this.ticket_idx = navParams.data.ticket_idx;
    console.log("data");
    this.initialize();

  }
  initialize() {
    this.username = this.user.getGroupName();
    this.afs.collection('userProfile').doc(this.user.getUID())
      .collection('ticket', ref => ref.where('id', '==', this.ticket_idx))
      .valueChanges().subscribe((data) => {
        this.info = data;
        //공연의 끝나는 시간 계산
        this.endTime = new Date(this.info[0]['date'].getTime() + Number(this.info[0]['concert_obj'].runningTime) * 60000);
        //입금기한 설정 (현재 구매한 시간으로 부터 24시간 뒤로 설정해놓음)
        this.finalDate = new Date(this.info[0]['buy_date'].getTime() + 86400000);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketInfoPage');
  }

}
