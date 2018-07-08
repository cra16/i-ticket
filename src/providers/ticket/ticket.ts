import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class TicketProvider {
  /* 좌석 상태명 */
  VIP: number = 0; // 예약석 및 팔지 않는 좌석
  NOT: number = -1; // 팔리지 않은 좌석
  SELECTED: number = 1; // 구매창에서 선택한 좌석
  BEFORE_PAYMENT: number = 2; // 아직 입금확인이 되지 않은 좌석
  DONE: number = 3; // 입금완료된 좌석
  CLOSED: number = 4; // 공연이 종료된 좌석
  CANCEL: number = 99; // 취소된 좌석 -> 판매자에게...
  EMPTY : number = -99 ;
  remained_seat:Array<Number>=[];

  constructor(public afs: AngularFirestore) {
  }
  //남은 좌석 수 세기
  getSeatCount(concert_idx, length) {
    for (let i = 0; i < length; i++) {
      this.afs.collection('concerts').doc(concert_idx).collection('date').doc(i.toString()).collection('seat')
        .ref.where("status", "==", -1).get().then((doc) => {
          let count = doc.docs.length;
          this.remained_seat[i]=count;
        }).catch(error => {
          console.log("@ getSeatCount error : " + error);
        });
    }
    return this.remained_seat
  }
}