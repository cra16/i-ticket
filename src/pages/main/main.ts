import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { ListPage } from '../list/list';
import { DetailPage } from '../detail/detail';
import { BookingPage } from '../booking/booking';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { UserProvider } from '../../providers/user/user';
import firebase from 'firebase';
import { ScreenOrientation } from '@ionic-native/screen-orientation';


@Component({
	selector: 'page-main',
	templateUrl: 'main.html'
})
export class MainPage {

	lists: AngularFirestoreCollection<any[]>;
	list_now: Observable<any>;
	list_will: Observable<any>;
	list_past: Observable<any>;
	concerts: any = "now";
	user_name: any;

	constructor(public navCtrl: NavController,
		        public afs: AngularFirestore,
				public userProvider: UserProvider,
				private screen: ScreenOrientation,
				public menu : MenuController) {
		// Lock vertical screen             
		// 네이티브에서만 적용되는 기능,
		// 마지막에 주석해제 하면 됨.
		// this.screen.lock('portraitv');
		this.menu=menu;
  		this.menu.enable(true,'myMenu');
		this.initializeApp();
		this.initializeItems();
	}
	
	initializeApp() {
		this.concerts = "now" ;
		firebase.auth().onAuthStateChanged(user => {
		  if (user) {
			this.userProvider.initialize(user).then(() => {
			  this.user_name = this.userProvider.getGroupName();
			}).catch(error => {
				console.log("@ userProvider initialize error : " + error);
			});
		  }
		});
	}

	initializeItems() {
		this.list_now = this.afs.collection('concerts', ref => ref.where("status", "==", "판매 중")).valueChanges();
		this.list_will = this.afs.collection('concerts', ref => ref.where("status", "==", "판매 예정")).valueChanges();
		this.list_past = this.afs.collection('concerts', ref => ref.where("status", "==", "종료된 공연")).valueChanges();
	}
	// Page Navigation function
	goListPage() {
		this.navCtrl.push(ListPage);
	}
	//페이지 이동 기능
	goDetailPage(slide) {
		// 공연의 키값을 파라미터로 받아온다.
		this.navCtrl.push(DetailPage, { concert_obj: slide })
	}
	goBookingPage(slide) {
		this.navCtrl.push(BookingPage, { concert_obj: slide })
	}
}
