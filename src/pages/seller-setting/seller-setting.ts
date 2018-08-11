// Module
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { Camera } from '@ionic-native/camera';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { AngularFirestore } from 'angularfire2/firestore';
import firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
// Provider
import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-seller-setting',
  templateUrl: 'seller-setting.html',
})

export class SellerSettingPage {
  groupname: any;
  image: any;
  imgUrl: string;
  uid: any;
  phoneNumber: any;
  userprofile: Array<any>;
  userRef: Observable<any>;
  img: any;
  introduce: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController, public camera: Camera,
    public toastCtrl: ToastController, public user: UserProvider,
    public afs: AngularFirestore, public alertCtrl: AlertController,
    private screen: ScreenOrientation) {
    // Lock vertical screen
    // 네이티브에서만 적용되는 기능,
    // 마지막에 주석해제 하면 됨.
    this.screen.lock('portrait');

    this.groupname = user.getGroupName();
    this.uid = user.getUID();
    // TODO: 코드 줄일 수 있을 듯 한데... by walter
    this.userRef = afs.collection('userProfile').doc(this.uid).valueChanges();
    this.userRef.subscribe(data => {
      this.userprofile = data;
      this.phoneNumber = this.userprofile['phoneNumber'];
      this.introduce = this.userprofile['sellerIntroduce'];
      // check if user set profile image
      this.userprofile['photoURL'] == "null" ? this.image = "../../assets/imgs/defaultImage.jpg" : console.log("이미 프사를 등록했군용")
    })
  } // constructor

  // 사진 추가 액션씻
  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '이미지를 선택해주세요',
      buttons: [
        {
          text: '갤러리에서 가져오기',
          handler: () => {
            this.getPhotoFromGallery();
          }
        },
        {
          text: '취소',
          role: 'cancel'
        }]
    });
    actionSheet.present();
  }

  // 갤러리에서 사진 가져오기
  getPhotoFromGallery() {
    this.camera.getPicture({
      quality: 50,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      this.presentToast('이미지가 성공적으로 추가 되었습니다.');
    }).catch(error => {
      console.log("@ camera.getPicture error : " + error);
      this.presentToast('이미지를 선택하는 동안 에러가 발생했습니다.');
    });
  }
  //정보메시지 표시(에러메시지 등)
  // TODO: toast, alert 뿌리는 걸 provider로 제공하면 좋을 듯, 여기저기서 쓰이니까 by walter
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
  // 등록하면 사진, 연락처, 공연소개 부분이 유저의 정보로 업데이트됨.
  updateSellerInfo() {
    let editCompletedToastMessage = '판매자 정보가 성공적으로 수정되었습니다.';
    if (this.image != null) {
      const storageRef: firebase.storage.Reference = firebase.storage().ref('/SellerImage/' + this.groupname);
      const uploadTask: firebase.storage.UploadTask = storageRef.putString(this.image, 'data_url');
      uploadTask.then((uploadSnapshot: firebase.storage.UploadTaskSnapshot) => {
        this.imgUrl = uploadSnapshot.downloadURL;
        this.afs.doc(`userProfile/${this.uid}`).update({
          sellerImg: this.imgUrl,
          phoneNumber: this.phoneNumber,
          sellerIntroduce: this.introduce
        }).catch(error => {
          editCompletedToastMessage = '핸드폰 번호 또는 단체 소개 내용을 수정하는 데 실패했습니다.';
          console.log("@ afs.doc.update error : " + error);
        })
      }).catch(error => {
        editCompletedToastMessage = '사진을 저장하는 데 실패했습니다.';
        console.log("@ uploadTask error : " + error);
      });
    }
    else if (this.image == null) {
      this.afs.doc(`userProfile/${this.uid}`).update({
        phoneNumber: this.phoneNumber,
        sellerIntroduce: this.introduce
      }).catch(error => {
        editCompletedToastMessage = '핸드폰 번호 또는 단체 소개 내용을 수정하는 데 실패했습니다.';
        console.log("@ afs.doc.update error : " + error);
      });
    }
    this.presentToast(editCompletedToastMessage);

  }
}
