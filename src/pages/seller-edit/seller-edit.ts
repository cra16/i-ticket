import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { ListPage } from '../list/list';
import firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { Platform } from 'ionic-angular/platform/platform';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SellerMainPage } from '../seller-main/seller-main';
// providers
import { AlertProvider } from '../../providers/alert/alert';
import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-seller-edit',
  templateUrl: 'seller-edit.html',
})

export class SellerEditPage {
  genres: Array<{ genre: string, value: string }>;
  locations: Array<{ location: string, value: string }>;
  statuses: Array<{ status: string, value: string }>;
  concert: Array<any>;
  title: any;
  date: Array<any>;
  genre: any;
  location: any;
  runningTime: any;
  price: any;
  overview: any;
  actor: any;
  director: any;
  image: any;
  status: any;
  imgUrl: any;
  img: any;
  count: number = 0;
  num: number = 0;
  count_date: number = 0;

  constructor(public navCtrl: NavController, public user: UserProvider,
    public navParams: NavParams, public actionSheetCtrl: ActionSheetController,
    private camera: Camera, public alertCtrl: AlertController,
    public afs: AngularFirestore, public alertProvider: AlertProvider,
    public platform: Platform, private screen: ScreenOrientation ) {
    // Lock vertical screen             
    // 네이티브에서만 적용되는 기능,
    // 마지막에 주석해제 하면 됨.
    // this.screen.lock('portrait');

    let backAction = platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    }, 2)

    this.concert = navParams.data.concert_obj;

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
      { location: '야외공연장', value: '야외공연장' }
    ]
    this.statuses = [
      { status: '판매 예정', value: '판매 예정' },
      { status: '판매 중', value: '판매 중' },
      { status: '종료된 공연', value: '판매 종료' }
    ]
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SellerEditPage');
  }
  // 사진 추가 시 액션시트 표시 
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
      this.alertProvider.presentToast('이미지를 선택하는 동안 에러가 발생했습니다.');
      console.log("@ getPicture error : " + error);
    });
  }
  //등록완료 버튼 누를 시 입력한 정보를 데이터 베이스의 값을 업데이트 해주는 기능
  updateConcert() {
    let url;
    let update;
    let userupdate;
    //이미지를 새로 추가했을 시 사진을 다시 스토리지에 저장 후, 새로운 URL 데이터베이스에 저장
    if (this.image != null) {
      const storageRef2: firebase.storage.Reference = firebase.storage().ref('/picture/' + this.concert['title']);
      const uploadTask: firebase.storage.UploadTask = storageRef2.putString(this.image, 'data_url');
      uploadTask.then((uploadSnapshot: firebase.storage.UploadTaskSnapshot) => {
        this.imgUrl = uploadSnapshot.downloadURL;
        //동시에 데이터베이스에 정보 업뎃
        update = this.afs.collection("concerts").doc(this.concert['id']).update(this.concert)
        url = this.afs.collection("concerts").doc(this.concert['id']).update({ img: this.imgUrl })
      }).catch(error => {
        console.log("@ uploadTask error : " + error);
      });
    }
    //이미지를 추가하지 않았을 시 기존 이미지 URL 변동없이 새로운 데이터만 업데이트
    else if (this.image == null) {
      url = this.afs.collection("concerts").doc(this.concert['id']).update(this.concert)
    }
    userupdate = this.afs.collection('userProfile').doc(this.user.obj['uid']).collection('concerts').doc(this.concert['id']).update(this.concert)
    let alert = this.alertCtrl.create({
      title: '수정완료',
      subTitle: '수정이 성공적으로 반영되었습니다.',
      buttons: ['OK']
    });
    

    alert.present();
    this.navCtrl.setRoot(SellerMainPage);
  }
}
