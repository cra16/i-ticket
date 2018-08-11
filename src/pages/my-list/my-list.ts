import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import firebase from 'firebase';
import { TicketProvider } from '../../providers/ticket/ticket';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { timeout } from '../../../node_modules/rxjs/operators';

@Component({
  selector: 'page-my-list',
  templateUrl: 'my-list.html',
})
export class MyListPage {
  reviewed_num: number;
  done_num: number;
  concert_list: Array<any>;
  concert_info: Array<any> =[];
  info : Array<any>;
  closed_list: Array<any>;
  concerts: Array<any> = [];
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
    
    this.afs.collection('stars', ref => ref.where('uid','==',firebase.auth().currentUser['uid'])).valueChanges().subscribe((data) => {
        this.concert_list = data;
        this.reviewed_num = data.length; // 리뷰남긴 공연의 수
        //공연 id 추출
        for(let num=0; num<data.length ; num++) { 
          let test = this.concert_list[num]['concertId'];
          this.concerts.push(test)
        } 
        //추출한 공연 id를 바탕으로 공연정보뽑아오기
   
        for(let num = 0; num < this.concerts.length; num++){
          
          this.afs.collection('concerts', ref => ref.where('id','==',this.concerts[num])).valueChanges().subscribe((data) =>
            {
              this.concert_info[num]=data;
            })
        }
        
      });   
  }
}
