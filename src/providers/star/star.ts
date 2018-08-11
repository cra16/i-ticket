import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import firebase from 'firebase';

export interface Star {
  uid: any;
  concertId: any;
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

  getConcertStars(concertId) {
    const starsRef = this.afs.collection('stars', ref => ref.where('concertId', '==', concertId))
    return starsRef.valueChanges();
  }
  //별점 생성 및 업데이트
  setStar(uid, concertId, value) {
    //별점 document 데이터
    const star: Star = { uid, concertId, value};

    const starPath = `stars/${star.uid}_${star.concertId}`;

    return this.afs.doc(starPath).set(star)

  }

}
