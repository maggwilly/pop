import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { Chart } from 'chart.js';
import { DataProvider } from '../../providers/data/data';
/**
 * Generated class for the StatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
})
export class StatsPage {
  @ViewChild('barCanvas') barCanvas;
  barChart: any;
  questionDifFr:any;
  questionDifEn:any;
  constructor(
    public navCtrl: NavController,
    public dataService: DataProvider,
    public events: Events, 
     public navParams: NavParams) {
  }

  ionViewDidEnter(){ 
    this.dataService.load('fr')
    this.dataService.load('en')
    this.events.subscribe('questions', () => {
      this.questionDifFr = this.dataService.questionDifFr;
      this.questionDifEn = this.dataService.questionDifEn;
     })
    
  }

  ionViewDidLoad() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
        type: 'bar',
        data: {
            labels: this.dataService.departements(),
            datasets: [{
                label: 'Classements',
                data: this.dataService.scores,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }

    });

}

}
