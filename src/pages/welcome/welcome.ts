import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  employer: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.employer = this.navParams.get('employer')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }
  start(lang: string) {
    this.navCtrl.push('QuizPage', { lang: lang, employer: this.employer });
  }
}
