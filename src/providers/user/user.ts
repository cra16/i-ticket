import { Injectable } from '@angular/core';

import firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { LoadingController, AlertController, Alert } from 'ionic-angular';

@Injectable()
export class UserProvider {
    private email: string;
    private uid: string;
    private phoneNumber: string;
    private groupName: string;
    private sellerImg: any;
    private sellerIntroduce: any;
    private photoURL: any;
    private isSeller: any;
    obj: any ;

    constructor(public afs: AngularFirestore, public loadingCtrl: LoadingController, public alertCtrl: AlertController) { }

    initialize(user) {
        return new Promise((resolve, reject) => {
            this.uid = user.uid
            this.afs.collection('userProfile').doc(this.uid).valueChanges().subscribe((data) => {
                this.obj = data ;
                this.email=this.obj['email']
                this.groupName=this.obj['name']
                this.uid=this.obj['uid']
                this.phoneNumber=this.obj['phoneNumber']
                this.sellerImg=this.obj['sellerImg']
                this.sellerIntroduce=this.obj['sellerIntroduce']
                this.photoURL=this.obj['photoURL']
                this.isSeller=this.obj['isSeller']
                resolve();
            },
            (error) => {
                reject(error);
            });
        });
    }
    
    getEmail() {
        return this.email;
    }
    getGroupName() {
        return this.groupName;
    }
    getUID() {
        return this.uid;
    }
    getPhoneNumber(){
        return this.phoneNumber;
    }
    setUID(uid) {
        return this.uid=uid;
    }
    getSellerImg() {
        return this.sellerImg;
    }
    getSellerIntroduce() {
        return this.sellerIntroduce;
    }
    getIsSeller(){
        return this.isSeller;
    }
    getPhotoURL(){
        return this.photoURL;
    }
}