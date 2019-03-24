import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Slides, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { AppNotify } from '../../app/app-notify';
/**
 * Generated class for the QuizPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-quiz',
  templateUrl: 'quiz.html',
})
export class QuizPage {
  @ViewChild('slides') slides: Slides;
  timer: any;
  time = 0
  maxTime = 0
  lang: any;
  displayTime: any = 100;
  hasAnswered: boolean = false;
  score: number = 0;
  max: number = 100;
  slideOptions: any;
  questions: any;
  activeIndex: number = 0;
  employer:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public notify:AppNotify,
    public dataService: DataProvider) {
    this.lang = this.navParams.get('lang');
    this.employer = this.navParams.get('employer')
    this.questions= this.employer.answers;
    this.hasAnswered=(this.employer.answers&&this.employer.answers.length)
    this.score=this.employer.score?this.employer.score:0
  }

  ionViewDidLoad() {
    if(this.questions&&this.questions.length)
         return
    this.score=0;
    this.slides.lockSwipes(true);
    this.dataService.load(this.lang).then((data:any) => {
      this.questions = data;
      setTimeout(() => {
        this.ionSlideDidChange();
      }
        ,
        1000);
    });

  }

  end() {
    this.navCtrl.setRoot('HomePage');
  }

  nextSlide() {
    if (this.timer)
      clearInterval(this.timer);
    if (this.hasAnswered) {
      this.slides.slideNext();
      return
    }

    let question = this.questions[this.activeIndex];
    if (question) {
      this.rating(question);
      question.amswered = true;
      this.score += question.rate;
      this.max += question.answers ? question.answers.length : 0;
      if(question.answers.length)
      this.dataService.setRating(question.id,this.lang,(question.rate*100/question.answers.length).toFixed(0))
    }
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);

  }

  rating(question: any) {
    let score: number = question.answers ? question.answers.length : 0, amswared = false;
    question.answers.forEach(amswer => {
      if (amswer.selected)
        amswared = true;
      if ((amswer.correct && !amswer.selected) || (!amswer.correct && amswer.selected))
        score--;
    });
    if (!amswared)
           score = 0;
    question.rate = score;
  }

  ionSlideDidChange() {
    if (this.slides.isEnd()) {
       if (this.hasAnswered)
          return 
      let loading=  this.notify.loading({content:'Scoring...'})
      this.dataService.setScore(this.employer.id,{lang:this.lang,score:this.humaniseScore(),answers:this.questions}).then(()=>{
        this.hasAnswered = true;
        loading.dismiss()
      })
      loading.present();
      return 
    }
    if (this.hasAnswered)
      return 
    console.log("start");
    this.activeIndex = this.slides.getActiveIndex() ? this.slides.getActiveIndex() : 0;
    let question = this.questions[this.activeIndex];
    this.time = question.answers ? question.answers.length * 15000 + 10000 : 5000 + 10000
    this.maxTime = this.time;
    this.counter();
  }


  counter() {
    if (this.hasAnswered)
      return
    setTimeout(() => {
      this.timer = setInterval(() => {
        if (this.time != 0) {
          this.time -= 1000;
          this.displayTime = (this.time * 100 / this.maxTime).toFixed(0);
        } else {
          this.nextSlide();
        }
      }, 1000)
    }, 1000);

  }

  humaniseScore(): string {
    if(!this.max)
      return Number(this.score).toFixed(0);
    return (this.score * 100 / this.max).toFixed(0);
  }

  randomizeAnswers(rawAnswers: any[]): any[] {

    for (let i = rawAnswers.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = rawAnswers[i];
      rawAnswers[i] = rawAnswers[j];
      rawAnswers[j] = temp;
    }

    return rawAnswers;

  }

  restartQuiz() {
    this.hasAnswered = true;
    this.slides.lockSwipes(false);
    this.slides.slideTo(1, 1000);

  }

}

