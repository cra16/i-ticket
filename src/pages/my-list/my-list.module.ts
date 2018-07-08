import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyListPage } from './my-list';

@NgModule({
  declarations: [
    MyListPage,
  ],
  imports: [
    IonicPageModule.forChild(MyListPage),
  ],
})
export class MyListPageModule {}
