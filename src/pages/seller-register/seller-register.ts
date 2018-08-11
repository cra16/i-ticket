import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, AlertController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { AngularFireDatabase } from 'angularfire2/database';
import { ListPage } from '../list/list';
import { TicketProvider } from '../../providers/ticket/ticket';
import firebase from 'firebase';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SellerMainPage } from '../seller-main/seller-main';
// providers
import { AlertProvider } from '../../providers/alert/alert';
import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-seller-register',
  templateUrl: 'seller-register.html',
})
export class SellerRegisterPage {

  lists: AngularFirestoreCollection<any[]>;
  genres: Array<{ genre: string, value: string }>;
  locations: Array<{ location: string, value: string }>;
  statuses: Array<{ status: string, value: string }>;

  click: number = 0;
  count: number = 0;
  add1 = 1; add2 = 1; add3 = 1; add4 = 1;
  title: any;
  date: Array<any> = [];
  genre: any;
  location: any;
  location2: string = '';
  runningTime: any;
  price: any;
  overview: any;
  actor: any;
  director: any;
  image: any;
  status: any;
  imageName: string;
  imgUrl: string;
  accountNumber: string;
  uid: any;

  select_seats: Array<any>; // 좌석표 select됀 정보값 array
  col: Array<any> = Array(12).fill(0); // 1줄당 좌석 갯수 
  row: Array<any> = Array(10).fill(0); // 총 몇개의 좌석 행

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private camera: Camera, public actionSheetCtrl: ActionSheetController,
    public alertProvider: AlertProvider, public platform: Platform,
    public af: AngularFireDatabase, public alertCtrl: AlertController,
    public afs: AngularFirestore, public ticket: TicketProvider,
    public user: UserProvider, private screen: ScreenOrientation,
    ) {
    // Lock vertical screen             
    // 네이티브에서만 적용되는 기능,
    // 마지막에 주석해제 하면 됨.
    this.screen.lock('portrait');

    // this.initialize_seat();
    //장르와 장소 공연상태 목록 
    this.genres = [
      { genre: '연극', value: '연극' },
      { genre: '댄스', value: '댄스' },
      { genre: '콘서트', value: '콘서트' },
      { genre: '아카펠라', value: '아카펠라' },
      { genre: '클래식', value: '클래식' },
    ]
    this.locations = [
      { location: '학관 104호', value: '학관 104호' },
      { location: '오디토리움', value: '오디토리움' },
      { location: '학생회관 앞', value: '학생회관 앞' },
      { location: '야외공연장', value: '야외공연장' },
      { location: '직접입력', value: this.location2 },
    ]
    this.statuses = [
      { status: '판매 예정', value: '판매 예정' },
      { status: '판매 중', value: '판매 중' },
      { status: '종료된 공연', value: '판매 종료' }
    ]
  }
  
  //사진 추가시 ActionSheet 활성화 기능 
  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '이미지를 선택해주세요',
      buttons: [
        {
          text: '갤러리에서 가져오기',
          handler: () => {
            this.accessGallery();
          }
        },
        {
          text: '취소',
          role: 'cancel'
        }]
    });
    actionSheet.present();
  }
  //갤러리에서 사진 가져오기
  accessGallery() {
    this.camera.getPicture({
      quality: 50,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      this.alertProvider.presentToast('이미지가 성공적으로 추가 되었습니다.');
    }).catch(error => {
      console.log("@ camera getPicture error : " + error);
      this.alertProvider.presentToast('이미지를 선택하는 동안 에러가 발생했습니다.');
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SellerRegisterPage');
  }
  //날짜추가 기능 핸들링 (리팩토링 필요)
  addDatetime() {
    this.count = this.count + 1;
    if (this.date[0] != null) {
      this.add1 = 0;
    }
    if (this.date[1] != null) {
      this.add2 = 0;
    }
    if (this.date[2] != null) {
      this.add3 = 0;
    }
    if (this.date[3] != null) {
      this.add4 = 0;
    }
  }
  //날짜삭제기능 핸들링 (리팩토링 필요)
  deleteDatetime() {
    if (this.count == 1 || this.add2 == 1) {
      this.date[1] = null;
      this.add1 = 1;
    }
    if (this.count == 2 || this.add3 == 1) {
      this.date[2] = null;
      this.add2 = 1;
    }
    if (this.count == 3 || this.add4 == 1) {
      this.date[3] = null;
      this.add3 = 1;
    }
    if (this.count == 4 || (this.date[4] != null || this.date[4] == null)) {
      this.date[4] = null;
      this.add4 = 1;
    }
    this.count--;
  }
  //판매등록 시 파이어베이스로 데이터 넘김
  updateConcert() {
    let url;
    let seatRef;
    let sellerRef;
    let groupname;
    //직접입력일시 정보변경
    if(this.location=="직접입력") {
      this.location = this.location2;
    }
    //auth를 통해 현재 로그인한 계정의 uid값 추출
    this.uid = this.user.getUID();
    //현재 로그인한 계정의 그룹명을 공연데이터베이스에 추가
    let userRef = this.afs.doc(`userProfile/${this.uid}`).valueChanges().subscribe(data => {
      groupname = data['name'];
    })
    // 파이어베이스 스토리지에 다음과 같은 경로에 다음과 같은 이름으로 이미지 파일을 업로드
    const storageRef: firebase.storage.Reference = firebase.storage().ref('/picture/' + this.title);
    const uploadTask: firebase.storage.UploadTask = storageRef.putString(this.image, 'data_url');
    uploadTask.then((uploadSnapshot: firebase.storage.UploadTaskSnapshot) => {
      this.imgUrl = uploadSnapshot.downloadURL;
      //날짜 데이터 할당
      let date_list = [];
      for (let i = 0; i < this.count + 1; i++) {
        date_list.push(new Date(this.date[i]))
      }
      //데이터베이스에 임의 생성한 키로 데이터 저장
      url = this.afs.collection("concerts").add({
        img: this.imgUrl,
        title: this.title,
        genre: this.genre,
        location: this.location,
        runningTime: this.runningTime,
        price: this.price,
        overview: this.overview,
        status: this.status,
        director: this.director,
        actor: this.actor,
        accountNumber: this.accountNumber,
        date: date_list,
        uid: this.uid,
        groupname: groupname
      }).then((docRef) => {
        this.afs.collection("concerts").doc(docRef.id).update({ //임의로 생성한 키값을 데이터베이스에 저장
          id: docRef.id
        });
        //판매자 계정 데이터베이스에 공연 키값 추가.
        sellerRef = this.afs.doc(`userProfile/${this.uid}/concerts/${docRef.id}`)
        sellerRef.set({
          id: docRef.id,
          img: this.imgUrl,
          title: this.title,
          genre: this.genre,
          location: this.location,
          runningTime: this.runningTime,
          price: this.price,
          overview: this.overview,
          status: this.status,
          director: this.director,
          actor: this.actor,
          accountNumber: this.accountNumber,
          date: date_list,
          uid: this.uid,
          groupname: groupname
        })
        //날짜데이터에 시트데이터 업데이트
        // for (let i = 0; i < this.count + 1; i++) {
        //   docRef.collection("date").doc(i.toString()).set({
        //     date: date_list[i]
        //   }).then(() => {
        //     for (let j = 0; j < this.col.length * this.row.length; j++) {
        //       seatRef = this.afs.doc(`concerts/${docRef.id}/date/${i}/seat/${this.select_seats[j].info}`);
        //       seatRef.set({
        //         info: this.select_seats[j].info,
        //         status: this.select_seats[j].status
        //       })
        //     }
        //   }).catch(error => {
        //     console.log("@ docRef.collection().doc().set error : " + error);
        //   });
        //}
      }).catch(error => {
        console.log("@ url add error : " + error);
      });
    }).catch(error => {
      console.log("@ uploadTask error : " + error);
    });

    let alert = this.alertCtrl.create({
      title: '등록완료',
      subTitle: '판매가 성공적으로 등록되었습니다.',
      buttons: ['OK']
    });
    alert.present();
    this.navCtrl.setRoot(SellerMainPage);
  }

  //좌석 갯수에 맞게끔 좌석값 초기화 함수
  // initialize_seat() {
  //   let seats = new Array(this.col.length * this.row.length);
  //   for (let i = 0; i < this.row.length; i++) {
  //     for (let j = 0; j < this.col.length; j++) {
  //       let seat_info = {
  //         status: this.ticket.NOT,
  //         info: ""
  //       };
  //       //TODO: 예약석 체크 알고리즘 만들어야 할듯
  //       if (i < 2)
  //         seat_info.status = this.ticket.VIP;
  //       // 없는 좌석
  //       if (i == this.row.length - 1) {
  //         if (j <= 2 || j >= 9)
  //           seat_info.status = this.ticket.EMPTY;
  //       }
  //       seat_info.info = String.fromCharCode(i + 65) + this.n(j + 1);
  //       seats[12 * i + j] = seat_info;
  //     }
  //   }
  //   this.select_seats = seats;
  // }
  // n(n) {
  //   return n > 9 ? "" + n : "0" + n;
  // }
}