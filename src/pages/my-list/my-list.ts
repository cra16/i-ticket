import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import firebase from 'firebase';
import { TicketProvider } from '../../providers/ticket/ticket';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  selector: 'page-my-list',
  templateUrl: 'my-list.html',
})
export class MyListPage {
  notyet_num: number;
  done_num: number;
  concert_list: Array<any>;
  closed_list: Array<any>;
  times: Array<Date> = [];
  endTimes: Array<Date>=[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afs: AngularFirestore,
    public ticket: TicketProvider,
    private screen: ScreenOrientation) {
    // Lock vertical screen             
    // 네이티브에서만 적용되는 기능,
    // 마지막에 주석해제 하면 됨.
    // this.screen.lock('portrait');
    this.initializeList();
  }

  initializeList() {
    this.afs.collection('userProfile').doc(firebase.auth().currentUser['uid'])
      .collection('ticket', ref => ref.where('status', '>=', this.ticket.BEFORE_PAYMENT).where('status', '<=', this.ticket.DONE).orderBy('status', 'desc'))
      .valueChanges().subscribe((data) => {
        this.concert_list = data;
        this.notyet_num = data.length; // 관람 예정 공연의 수

        for(let num=0; num<this.concert_list.length ; num++) {
          let test = new Date(this.concert_list[num]['date'].getTime() + Number(this.concert_list[num].concert_obj['runningTime']) * 60000);
          this.times.push(test)
        } 
      });

   

    this.afs.collection('userProfile').doc(firebase.auth().currentUser['uid'])
      .collection('ticket', ref => ref.where('status', '==', this.ticket.CLOSED))
      .valueChanges().subscribe((data) => {
        this.closed_list = data;
        this.done_num = data.length; // 관람한 공연의 수
        for(let num=0; num<this.closed_list.length ; num++) {
          let test = new Date(this.closed_list[num]['date'].getTime() + Number(this.closed_list[num].concert_obj['runningTime']) * 60000);
          this.endTimes.push(test)
        } 
      });
  }

}
