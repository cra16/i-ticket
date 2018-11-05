import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { LoadingController, AlertController, Alert } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
// providers
import { AlertProvider } from '../../providers/alert/alert';

interface User {
  uid: string;
  email: string;
  name: string;
  phoneNumber?: any;
  photoURL?:any;
  isSeller: boolean;
}

@Injectable()
export class AuthProvider {
  user: Observable<User>;
  constructor(public afs: AngularFirestore,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public afAuth: AngularFireAuth,
    private googlePlus: GooglePlus,
    public alertProvider: AlertProvider) {
      this.user = this.afAuth.authState
        .switchMap(user => {
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
          } else {
            return Observable.of(null)
          }
        }
      );
  }
  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }
  signupUser(name: string, email: string, password: string, phoneNumber: string): Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(newUser => {
        let docRef = this.afs.doc(`userProfile/${newUser.uid}`);
        docRef.set({
          name: name,
          email: email,
          phoneNumber: phoneNumber,
          uid: newUser.uid,
          isSeller: true,
          photoURL: "null",
          sellerImg: "null",
        })
        return true;
      }).catch(error => {
        console.log("@ firebase.auth().createUserWithEmailAndPassword error : " + error);
        const alert: Alert = this.alertCtrl.create({
          message: error.message,
          buttons: [{ text: 'Ok', role: 'cancel' }]
        });
        alert.present();
        return false;
      }
      );
  };

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<void> {
    const userId: string = firebase.auth().currentUser.uid;
    firebase.database().ref(`/userProfile/${userId}`).off();
    this.googlePlus.logout();
    this.alertProvider.presentToast("정상적으로 로그아웃되었습니다.");
    return firebase.auth().signOut();
  }
  /////////////////////////////////////////////////////구글 로그인///////////////////////////////////////////////////////////////////////////
  googleLogin() {
    console.log("Login try")
    this.googlePlus.login({
      'webClientId': '545732523356-vin80v0rch347p7qaap3s1gbo2n9djo9.apps.googleusercontent.com'
    }).then((res) => {
      var isHandong = res.email;
      var isHandongSplited = isHandong.split("@") // ~~~@handong.edu
      if (isHandongSplited[1] == "handong.edu") {
        var provider = firebase.auth.GoogleAuthProvider.credential(res.idToken);
        firebase.auth().signInWithCredential(provider).then((success) => {
          this.updateUserData(success);
          return true;
        }).catch((error) => {
          console.log("Firebase failure: " + JSON.stringify(error));
        });
      }
      else {
        this.alertProvider.presentToast("한동대학교 이메일로만 이용가능합니다.");
        this.googlePlus.logout();
        return false;
      }
    }).catch((gplusErr) => {
      console.log("GooglePlus failure: " + JSON.stringify(gplusErr));
    });
  }

  private updateUserData(res) {
    // Sets user data to firestore on login
    const data: User = {
      uid: res.uid,
      email: res.email,
      name: res.displayName,//familyName과 givenName도 불러올수 있음.
      phoneNumber: res.phoneNumber,
      photoURL: res.photoURL,
      isSeller: false
    }
    this.afs.doc(`userProfile/${res.uid}`).set(data)
  }
}
