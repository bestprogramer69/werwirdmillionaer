import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent {

  categories: any;
  selectedCategory: any;
  name: any = "";
  highscores: any = [];


  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const url = 'http://localhost:5000/categories';
    this.http.get(url).subscribe((response) => {
      this.categories = response;
    });
    this.http.get<Highscore[]>('http://localhost:5000/game').subscribe(data => {         
      const weightedData = [];
         for (let i = 0; i < data.length; i++) {
      const start = new Date(data[i].start).getTime();
      const end = new Date(data[i].ende).getTime(); 
      console.log((end-start)/1000);
      console.log(data[i].punktzahl);
      
      const weightedPoints = Math.round((data[i].punktzahl / ((end - start)/1000)) * 10) /10;
      const duration = Math.round((end - start)/1000);
      
      const weightedScore = {
        ...data[i],
        weightedPoints,
        duration
      };
      weightedData.push(weightedScore);
      weightedData.sort((a, b) => b.weightedPoints - a.weightedPoints);
      console.log(weightedData);
      
      this.highscores = weightedData;
    }
  });
  }

  startGame() {
    const category = this.selectedCategory;
    console.log(category);
    
    if(!category) {
        alert('Please select a category.');
        return;
    }
    
    if(this.name === "") {
        alert('Please enter your name.');
        return;
    }
     
    const date = new Date();
    const formattedDateTime = date.toISOString();

    const data = { kategorien_id: category, spieler: this.name, start: formattedDateTime, punktzahl: 0 };
    localStorage.setItem('playerdata', JSON.stringify(data));
    this.router.navigate(['/', 'quiz'])
}

durationQuiz(score: any): number {
  const start = new Date(score.start);
  const end = new Date(score.ende);
  const duration = (end.getTime() - start.getTime()) / 1000;
  return duration;
}

weightedPoints(score: any): number {
  const duration = this.durationQuiz(score);
  const weightedPoints = score.punktzahl / duration;
  return weightedPoints;
}
}

interface Highscore {
  id: number;
  kategorien_id: number;
  spieler: string;
  start: Date;
  ende: Date;
  punktzahl: number;
}