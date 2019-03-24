import { Http }    from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import { Events } from 'ionic-angular';
/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {
  qFr: any[];
  qEn:any[];
  employers:any[]=[]
  scores:number[]=[]
  questionDificileFr:any;
  questionDificileEn:any;
    
  fireemployes = firebase.database().ref('/employes');
  firequestions = firebase.database().ref('/questions');
  constructor(public http: Http, public events: Events,) {
  }


randomFive(data:any[]){
  let questions:any[]=[]
  let list:any[]=data;
for (let i = 0 ; i < 5; i++) {
  let j=Math.floor( Math.random() * ( list.length-1) );
    questions.push(list[j]);
    list.splice(j,1);
  }
  return questions;
}


load(lang?:string) {
  return new Promise((resolve, reject) => {
    switch (lang) {
      case 'fr':
        if(this.qFr)
        return resolve( this.randomFive(this.qFr));
        return this.firequestions.child(lang).once('value', (snapshot) => {
          this.qFr=[];
          snapshot.forEach((child) => {
            let question=child.val();
               question.id=child.key;
               this.qFr.push(question)    
          })
          this.events.publish('questions');
            resolve( this.randomFive(this.qFr));
          })
      default:
      if(this.qEn)
        return resolve( this.randomFive(this.qEn));
        return this.firequestions.child(lang).once('value', (snapshot) => {
          this.qEn=[];
          snapshot.forEach((child) => {
            let question=child.val();
               question.id=child.key;
               this.qEn.push(question)    
             })
             
             this.events.publish('questions');
          resolve( this.randomFive(this.qEn));
        })
    }
  })  
}


loadEmployers() {
  return this.fireemployes.on('value', (snapshot) => { 
    this.employers=[];
      snapshot.forEach((child) => {
        let employer=child.val();
          employer.id=child.key;
          employer.score=employer.score?employer.score:0;
        this.employers.push(employer)    
    })
    this.employers.sort((a, b)=> {
       return b.score - a.score;
    });
    this.scores=[]
    this.processData(this.employers)
    this.events.publish('employes');
})
}

setScore(id,answers:any) {  
  return this.fireemployes.child(id).update(answers);
}


setRating(id,lang:string,rate) {  
  return this.firequestions.child(lang).child(id).child('rates').push({value:rate});
}


colorScore(score:any,style:number=1):string{
  score=Number(score)
  switch (style) {
    case 1:
    if(score<29)
    return 'red';
    else if(score>30&&score<49)
      return 'orange';
   return 'success'
    default:
    if(score<29)
    return '#EB0606';
    else if(score>30&&score<49)
      return '#ffa500';
    return '#10dc60'
  }
}

departements(){
  return ['corporate','finance','general management','hr','legal','legal-HR-CR','Marketing','RTC','sales','supply','WACA','Guest'];
}

processData(list:any){
let departements:string[]=this.departements();
this.scores=[]
   departements.forEach(departement => {
     let score:number=0, nbre:number=0
     let group=this.findByname(departement);
     group.forEach(item=>{
         if(item.score)
             nbre++;
             score+=Number(item.score)
          }
         )
         score=Math.floor(nbre>0?score/nbre:score);
        this.scores.push(score);
  });
}



findByname(name:string){
  let group=this.employers.filter(employer=>{
    employer.score=employer.score?employer.score:0;
    return employer.department.toUpperCase()==name.toUpperCase()}
  )
  group.sort((a, b)=> {
    return b.score - a.score;
 });
 return  group;
}

nbParticipants(){
  let nbParticipant=this.employers.filter(employe=>employe.score&&employe.score>0);
return nbParticipant.length;
}

meilleurParticipant(){
  let nbParticipant=this.employers.filter(employe=>employe.score&&employe.score>0);
  return nbParticipant.length? nbParticipant[0]:null;
}

questionDifFr(){
    let diff:any[] =  this.qFr.sort((a, b)=> {
    let arate:number=0,brate:number=0
       if(!a.rates||!b.rates)
       return a.amswered && b.amswered;
       a.rates.forEach(rate => {
          arate+=Number(rate.value);
       });
       arate=arate/a.rates.length;
      b.rates.forEach(rate => {
        brate+=Number(rate.value);
     });
     brate=brate/b.rates.length;
    return arate - brate;
 }); 
 this.questionDifFr=diff[0]

}

questionDifEn(){

    let diff:any[] = this.qFr.sort((a, b)=> {
    let arate:number=0,brate:number=0
       if(!a.rates||!b.rates)
       return a.amswered && b.amswered;
       a.rates.forEach(rate => {
          arate+=Number(rate.value);
       });
       arate=arate/a.rates.length;
      b.rates.forEach(rate => {
        brate+=Number(rate.value);
     });
     brate=brate/b.rates.length;
    return arate - brate;
 }); 
 this.questionDifEn=diff[0]
 }
}