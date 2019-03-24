import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AppNotify} from '../../app/app-notify';
import { IonicPage, NavController, ViewController ,NavParams,Events} from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
   
   employers:any[]=[];
   queryText = '';
  constructor(
    public navCtrl: NavController,
    public navNavParams: NavParams,
    public storage: Storage, 
    public events: Events,
    public dataService: DataProvider, 
    public appNotify:AppNotify,
    public viewCtrl: ViewController) {
      this.employers = this.dataService.employers;

    }

    ionViewDidEnter() { 
      this.dataService.loadEmployers();
      this.events.subscribe('employes', () => {
      this.employers = this.dataService.employers;
  })
  }

  startQuiz(employer){
    if(employer.answers)
        return  this.navCtrl.push('QuizPage', {  employer: employer });
     this.navCtrl.push('WelcomePage',{employer:employer});
  }

  search() {
      let queryText = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
      this.employers.forEach(item => {
          item.hide = true;
         this.filter(item, queryWords);
      });
   
  }

  filter(item, queryWords) {
    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach(queryWord => {
        if (item.name.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }
    item.hide = !(matchesQueryText);
  }

  openClassement(){
    this.navCtrl.push('ClassementPage');
  }
  openStats(){
    this.navCtrl.push('StatsPage');
  }
}
