import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import 'rxjs/add/operator/map';

export interface Star {
  uid: any;
  consertId: any;
  value: number;
}

@Injectable()
export class StarProvider {

  constructor(private afs: AngularFirestore) {
  }

  getUserStars(uid) {
    const starsRef = this.afs.collection('stars', ref => ref.where('uid', '==', uid))
    return starsRef.valueChanges();
  }

  getConcertStars(consertId) {
    const starsRef = this.afs.collection('stars', ref => ref.where('consertId', '==', consertId))
    return starsRef.valueChanges();
  }
  //별점 생성 및 업데이트
  setStar(uid, consertId, value) {
    //별점 document 데이터
    const star: Star = { uid, consertId, value };

    const starPath = `stars/${star.uid}_${star.consertId}`;

    return this.afs.doc(starPath).set(star)

  }

}
