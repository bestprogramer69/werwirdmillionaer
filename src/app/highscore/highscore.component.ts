import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-high-scores',
  templateUrl: './highscore.component.html',
  styleUrls: ['./highscore.component.css'],
  providers: [DatePipe]
})
export class HighscoreComponent {
  highscores: any = [];
  editingIndex: number = -1;

  ngOnInit() {
    this.http.get<Highscore[]>('http://localhost:5000/game').subscribe(data => {              
      const weightedData = [];
         for (let i = 0; i < data.length; i++) {
      const start = new Date(data[i].start).getTime();
      const end = new Date(data[i].ende).getTime();     
      const weightedPoints = Math.round((data[i].punktzahl / ((end - start)/1000)) * 10) /10;
      const duration = Math.round((end - start)/1000);

      const weightedScore = {
        ...data[i],
        weightedPoints,
        duration
      };
      weightedData.push(weightedScore);
      weightedData.sort((a, b) => b.weightedPoints - a.weightedPoints);
      
      this.highscores = weightedData;
    }
    console.log(this.highscores);
    
  });
  }


  constructor(private http: HttpClient, private datePipe: DatePipe) {}
  deleteScore(id: any) {    
    const url = `http://localhost:5000/game/${id}`;
    this.http.delete(url).subscribe(() => {
      const index = this.highscores.findIndex((score: any) => score.id === id);
      if (index !== -1) {
        this.highscores.splice(index, 1);
      }
    });
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