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
  categories: any = [];
  editingIndex: number = -1;

  //get request for game and add weightedpoints and duration
  ngOnInit() {
    this.http.get<Highscore[]>('https://backendwerwirdmillionaer.azurewebsites.net/game').subscribe(data => {              
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
  });

  this.http.get('https://backendwerwirdmillionaer.azurewebsites.net/categories').subscribe(data => {
      this.categories = data;
    });
  }


  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  categorybyId(id: any){
    if (this.categories === undefined) {
      this.http.get('https://backendwerwirdmillionaer.azurewebsites.net/categories').subscribe(data => {
        this.categories = data;
      });
    }
    const category = this.categories && this.categories.find((category:any) => category.id === id);
    return category;
  }
  //delete request for game
  deleteScore(id: any) {    
    const url = `https://backendwerwirdmillionaer.azurewebsites.net/game/${id}`;
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