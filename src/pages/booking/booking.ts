import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore } from 'angularfire2/firestore';
import { DocumentReference } from '@firebase/firestore-types';
import { AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import firebase from 'firebase';
import { TicketProvider } from '../../providers/ticket/ticket';
import { TicketInfoPage } from '../ticket-info/ticket-info';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@IonicPage()
@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
})
export class BookingPage {
  concert: Array<any>; // 예약 대상이된 공연 정보
  date_list: any; // 공연 date정보
  booking: any = "viewing";
  count: number = 0;
  price: number = 0;
  firestore_seat: any;
  seats: Array<any>;
  col: Array<any>; // 1줄당 좌석 갯수 
  row: Array<any>; // 총 몇개의 좌석 행
  selected_seat: Array<any> = [];
  selected_date: any;
  selected_idx: any;
  previousDate: any = new Date();
  nextDate: any = new Date();
  date: Array<any>;
  days: Array<Date> = [];
  times: Array<Date> = [];
  fullDate: Date = null;
  list: Observable<any>;
  getDate: Array<any>;
  getted_date: Array<any> = [];
  getted_fulldate: Date = null;
  check: Array<any>;
  get_list: Array<any>;
  date_length: any;
  remained_seat: Array<Number> = [];
  is_temp: Array<number> = [] ;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public afs: AngularFirestore,
    public ticket: TicketProvider,
    public platform: Platform,
    private screen: ScreenOrientation) {
    // Lock vertical screen
    // 네이티브에서만 적용되는 기능,
    // 마지막에 주석해제 하면 됨.
    // this.screen.lock('portrait');

    let backAction = platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    }, 2)

    this.concert = navParams.data.concert_obj;
    this.seats = Array(120).fill(0);
    this.col = Array(12).fill(0);
    this.row = Array(10).fill(0);
    //첫공연 날짜로 부터 일주일간의 날짜 계산
    for (let i = 0; i < 7; i++) {
      let temp = new Date(this.concert['date'][0].getTime());
      temp.setDate(temp.getDate() + i);
      this.days.push(temp);
    }
    // 맨 처음 날짜 불러와서 보여주기
    this.getList(this.days[0]) ;
    //남은좌석개수 계산
    this.date_length = this.concert['date'].length;

    // 공연이 있는 날들을 저장하기 위한 어레이
    for (let i = 0 ; i < this.date_length ; i++ ) {
      this.is_temp.push(this.concert['date'][i].getDate()) ;
    }
    
    this.remained_seat = ticket.getSeatCount(this.concert['id'],this.date_length) ;
    
    //등록된 날짜 개수
    let num = 0;
    do {
      let test = new Date(this.concert['date'][num].getTime() + Number(this.concert['runningTime']) * 60000);
      this.times.push(test)
      num++;
    } while (this.concert['date'][num] != null)

    //데이터베이스의 날짜의 해당 일자를 추출
    this.list = this.afs.collection('concerts').doc(this.concert['id']).valueChanges();
    this.list.subscribe(data => {
      this.getDate = data;
      for (let i = 0; i < this.getDate['date'].length; i++) {
        this.getted_date.push(this.getDate['date'][i].getDate())
      }
    })
  }
  //해당 날짜에 해당하는 리스트를 불러오는 기능
  getList(day) {
    this.fullDate = day
    this.getted_fulldate = day.getDate()
  }
  ishere(day) {
    return this.is_temp.indexOf(day.getDate()) >= 0 ? false : true ;
  }
  // -----------------------------------------------------------------------------------------------------------------------------------

  selectDate(date_idx, date) {
    this.selected_date = date;
    this.selected_idx = date_idx;
    this.firestore_seat = this.afs.collection("concerts").doc(this.concert['id'])
      .collection("date").doc(date_idx.toString())
      .collection("seat", ref => ref.orderBy("info"))
      .valueChanges()
      .subscribe(data => {
        this.seats = data;
      });
    // 페이지 전환
    this.booking = "seats";
  }

  changeStatus(i, j) {
    // 최대 6명 예약 가능
    if (this.count < 6) {
      this.seats[12 * i + j].status *= -1;
      // 좌석을 선택했을 경우
      if (this.seats[12 * i + j].status == this.ticket.SELECTED) {
        this.count++;
        this.selected_seat.push(this.seats[12 * i + j]);
      }
      // 좌석선택을 취소했을 경우
      if (this.seats[12 * i + j].status == this.ticket.NOT) {
        this.count--;
        this.deleteObj(this.seats[12 * i + j]);
      }
    } else {
      // 6개를 선택한 상황에서 좌석선택을 취소했을 경우
      if (this.seats[12 * i + j].status == this.ticket.SELECTED) {
        this.seats[12 * i + j].status *= -1;
        this.count--;
        this.deleteObj(this.seats[12 * i + j]);
      }
      else {
        let alert = this.alertCtrl.create({
          title: '티켓 구매 갯수 제한',
          subTitle: '한 번에 최대 6개까지만 구매하실 수 있습니다.'
        });
        alert.present();
      }
    }
    // 최종적으로 보여줄 가격
    this.price = this.concert['price'] * this.count;
  }

  deleteObj(obj: Array<any>) {
    const idx: number = this.selected_seat.indexOf(obj);
    if (idx !== -1) {
      this.selected_seat.splice(idx, 1);
    }
  }
  buy() {
    let alert = this.alertCtrl.create({
      title: '공연 확인',
      message: this.concert['title'] + "<br>"
        + this.selected_date.toLocaleString()
        + '입니다.<br>'
        + '최종 가격은 '
        + this.price + '원입니다.',
      buttons: [
        {
          text: '취소',
          handler: () => {
            ("취소 버튼 클릭");
          }
        },
        {
          text: '확인',
          handler: () => {
            for (let i = 0; i < this.selected_seat.length; i++) {
              this.selected_seat[i].status = this.ticket.BEFORE_PAYMENT;
              this.afs.collection('concerts').doc(this.concert['id'])
                .collection('date').doc(this.selected_idx.toString())
                .collection('seat').doc(this.selected_seat[i].info)
                .update({
                  info: this.selected_seat[i].info,
                  status: this.ticket.BEFORE_PAYMENT,
                  uid: firebase.auth().currentUser['uid']
                })
            }
            this.afs.collection('userProfile').doc(firebase.auth().currentUser['uid'])
            .collection('ticket').add({
              status: this.ticket.BEFORE_PAYMENT,
              price: this.price,
              date: this.selected_date,
              concert_obj: this.concert,
              seats: this.selected_seat,
              buy_date: new Date()
            }).then((Ref) => {
              this.afs.collection('userProfile').doc(firebase.auth().currentUser['uid'])
              .collection('ticket').doc(Ref.id).update({
                id: Ref.id
              })
              this.navCtrl.setRoot(TicketInfoPage, { 'ticket_idx': Ref.id });
              }).catch(error => {
                console.log("@ buy insert error : " + error);
              });
          }
        }
      ] // buttons
    })
    alert.present();
  }
}