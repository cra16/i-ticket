import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { SellerEditPage } from '../seller-edit/seller-edit';
import { AngularFirestore } from 'angularfire2/firestore';
import firebase from 'firebase';
import { UserProvider } from '../../providers/user/user';
import { Platform } from 'ionic-angular/platform/platform';
import { Observable } from 'rxjs/Observable';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SellerMainPage } from '../seller-main/seller-main';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})

export class DetailPage {
  uid: string;
  concertId: string;
  // 파라미터를 받아서 저장할 공연 변수
  concert: Array<any>;
  date_length: number;
  concert_status: string;

  date: Array<any>;
  new_date: Array<any>;

  groupname: any;
  username: any;


  // 예약진행을 위해서 필요한 유저 변수
  user_idx: any;
  //단체소개
  sellerRef: Observable<any>;
  sellerInfo: Array<any>;
  sellerImg: any;
  sellerPhonenumber: any;
  sellerIntroduce: any;
  sellerUid: any;
  isSeller: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase,
    public alertCtrl: AlertController,
    public afs: AngularFirestore,
    public user: UserProvider,
    public platform: Platform,
    private screen: ScreenOrientation) {
    // Lock vertical screen             
    // 네이티브에서만 적용되는 기능,
    // 마지막에 주석해제 하면 됨.
    // this.screen.lock('portrait');
    //백버튼눌렀을시 전페이지로
    let backAction = platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    }, 2)

    // 파라미터로 받은 객체를 저장한다.
    this.concert = navParams.data.concert_obj;
    this.date_length = this.concert['date'].length - 1;
    this.concert_status = this.concert['status'];
    this.uid = this.user.getUID();
    this.sellerUid = this.concert['uid']
    this.isSeller = this.user.getIsSeller();
    this.username = this.user.getGroupName();
    this.concertId = this.concert['id'];
    this.groupname = this.concert['groupname'];
    this.sellerRef = afs.collection('userProfile').doc(this.sellerUid).valueChanges()
    this.sellerRef.subscribe(data => {
      this.sellerInfo = data;
      this.sellerImg = this.sellerInfo['sellerImg'];
      this.sellerIntroduce = this.sellerInfo['sellerIntroduce'];
      this.sellerPhonenumber = this.sellerInfo['phoneNumber'];
    })
  }
  //공연정보 삭제 기능 (이 공연을 등록한 판매자에게만 보이게 해야한다.)
  deleteItem() {
    let confirm = this.alertCtrl.create({
      title: '삭제 확인',
      message: '정말로 이 공연 정보를 삭제하시겠습니까?',
      buttons: [
        {
          text: '취소',
          handler: () => {
          }
        },
        {

          text: '삭제',
          handler: () => {
            // 스토리지에 있는 사진 삭제
            const storageRef: firebase.storage.Reference = firebase.storage().ref(`/picture/${this.concert['title']}`);
            storageRef.delete();
            // 판매자 계정에서 공연 키 값 삭제
            let uid = firebase.auth().currentUser['uid'];
            let sellerRef = this.afs.doc(`userProfile/${uid}/concerts/${this.concert['id']}`)
            sellerRef.delete()
            //시트 컬렉션 먼저 삭제
            for (let c = 0; c < this.concert['date'].length; c++) {
              for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 12; j++) {
                  let info = String.fromCharCode(i + 65) + this.n(j + 1);
                  this.afs.doc(`concerts/${this.concert['id']}/date/${c}/seat/${info}`).delete()
                }
              }
            }
            for (let i = 0; i < 5; i++) {
              //데이트 컬렉션 삭제
              this.afs.doc(`concerts/${this.concert['id']}/date/${i}`).delete()
            }
            //공연 키값 문서 삭제
            this.afs.collection("concerts").doc(this.concert['id']).delete()
              .then(function () {
              })
              .catch(function (error) {
                console.error("Error removing document: ", error);
              });
            this.navCtrl.setRoot(SellerMainPage);
          }
        }
      ]
    });
    confirm.present();
  }
  n(n) {
    return n > 9 ? "" + n : "0" + n;
  }

  editItem() {
    this.navCtrl.setRoot(SellerEditPage, { concert_obj: this.concert })
  }

}