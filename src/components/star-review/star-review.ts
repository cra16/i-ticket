import { Component, OnInit, Input } from '@angular/core';
import { StarProvider } from '../../providers/star/star';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserProvider } from '../../providers/user/user';
import { Console } from '@angular/core/src/console';

@Component({
  selector: 'star-review',
  templateUrl: 'star-review.html'
})
export class StarReviewComponent implements OnInit{

  @Input() uid ;
  @Input() concertId :any;

  stars: Observable<any>;
  avgRating: Observable<any>;
  star: Array<any> = Array(11).fill(0) ;
  temp: any ;

  constructor(private starProvider : StarProvider,
    private afs: AngularFirestore,
    private user: UserProvider) {
   }

  ngOnInit() {
    this.stars = this.starProvider.getConcertStars(this.concertId) ;
    this.avgRating = this.stars.map(arr => {
      const ratings = arr.map(v => v.value) ;
      if (ratings.length) {
        this.afs.collection('stars').doc(this.user.getUID()+"_"+this.concertId).valueChanges().subscribe(data => {
          if(data) 
            this.star[data['value']*2] = true ;
        }) ;
        return ratings.reduce((total, val) => total + val ) / arr.length ;
      } else {
        return 0;
      }
    }) ;
  }

  starHandler(value) {
    this.starProvider.setStar(this.uid, this.concertId, value)
  }

}
