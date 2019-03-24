import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuizPage } from './quiz';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
@NgModule({
  declarations: [
    QuizPage,
   
  ],
  imports: [
    IonicPageModule.forChild(QuizPage),
    RoundProgressModule
  ],
})
export class QuizPageModule {}
