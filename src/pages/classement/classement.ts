import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

@IonicPage()
@Component({
  selector: 'page-classement',
  templateUrl: 'classement.html',
})
export class ClassementPage {

  constructor(
    public navCtrl: NavController,
    public events: Events,
    public dataService: DataProvider, 
    public navParams: NavParams) {
  }


  ionViewDidEnter(){ 
    this.dataService.loadEmployers();
  }
}