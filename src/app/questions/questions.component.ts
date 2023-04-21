import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})



export class QuestionsComponent {
  questions: any;
  categories: any;
  answers: any;
  editingIndex: number = -1;
  newQuestion = {
    kategorien_id: 1,
    frage: '',
    falscheAntwort1: '',
    falscheAntwort2: '',
    falscheAntwort3: '',
    richtigeAntwort: '',
    countRight: 0,
    countFalse: 0,
  };
  addingQuestion: boolean = false;
  savingQuestion: boolean = false;;

  getanswers(){
    this.http.get('https://backendwerwirdmillionaer.azurewebsites.net/answer').subscribe((response) => {
      this.answers = response;
    });
  }
  getCategories(){
  this.http.get('https://backendwerwirdmillionaer.azurewebsites.net/categories').subscribe((response) => {
      this.categories = response;
    });
  }

    getQuestions(){
      this.http.get('https://backendwerwirdmillionaer.azurewebsites.net/questions').subscribe(data => {
        this.questions = data;
      });
    }
  constructor(private http: HttpClient) {
    this.getanswers();
    this.getCategories();
    this.getQuestions();
    
   
  }

  startEditing(index: number) {
    this.editingIndex = index;
  }

  saveEditing(score: any) {
    const editedQuestion = Object.assign({}, score);
    const urlQuestion = `https://backendwerwirdmillionaer.azurewebsites.net/questions/${editedQuestion.id}`;
  
    this.http.put(urlQuestion, {
      kategorien_id: editedQuestion.kategorien_id,
      frage: editedQuestion.frage
    }).subscribe(() => {
    });
  
    const editedAnswers = [
      editedQuestion.falscheAntwort1,
      editedQuestion.falscheAntwort2,
      editedQuestion.falscheAntwort3,
      editedQuestion.richtigeAntwort
    ];
    for(let i = 0; i < editedAnswers.length; i++){
      const url = `https://backendwerwirdmillionaer.azurewebsites.net/answer/${editedAnswers[i]}`;
      const newAnswer = this.answers.find((answer: {id: string}) => answer.id === editedAnswers[i]);
      this.http.put(url, newAnswer).subscribe(() => {
      });
    }
    
   
    this.editingIndex = -1;
  }
  
  deleteScore(score: any) {
    const editedQuestion: any = Object.assign({}, score);
    const id = editedQuestion.id;
    const editedAnswers = [
      editedQuestion.falscheAntwort1,
      editedQuestion.falscheAntwort2,
      editedQuestion.falscheAntwort3,
      editedQuestion.richtigeAntwort
    ];
    const urlQuestion = `https://backendwerwirdmillionaer.azurewebsites.net/questions/${editedQuestion.id}`;
  
    this.http.delete(urlQuestion).pipe(
      concatMap(() => {
        const deleteAnswerRequests = [];
        for (let i = 0; i < editedAnswers.length; i++) {
          const url = `https://backendwerwirdmillionaer.azurewebsites.net/answer/${editedAnswers[i]}`;
          deleteAnswerRequests.push(this.http.delete(url));
        }
        return forkJoin(deleteAnswerRequests);
      })
    ).subscribe(() => {
    });
    const index = this.questions.findIndex((q: any) => q.id === id);
    if (index !== -1) {
      this.questions.splice(index, 1);
    }
  }
  getAnswerById(id: number) {
    if (this.answers === undefined) {
      this.getanswers();
    }
    const answer = this.answers && this.answers.find((answer: Answer) => answer.id === id);
    return answer;
  }

  addQuestion() {
    this.getCategories();
    this.addingQuestion = true;
  }
  saveQuestion() {
    this.savingQuestion = true; 
    let question = {
      kategorien_id: this.newQuestion.kategorien_id,
      frage: this.newQuestion.frage,
      
      countRight: 0,
      countFalse: 0,
    };
    const obs1 = this.http.post<AnswerResponse>('https://backendwerwirdmillionaer.azurewebsites.net/answer', {
      antwort: this.newQuestion.falscheAntwort1,
    });
    const obs2 = this.http.post<AnswerResponse>('https://backendwerwirdmillionaer.azurewebsites.net/answer', {
      antwort: this.newQuestion.falscheAntwort2,
    });
    const obs3 = this.http.post<AnswerResponse>('https://backendwerwirdmillionaer.azurewebsites.net/answer', {
      antwort: this.newQuestion.falscheAntwort3,
    });
    const obs4 = this.http.post<AnswerResponse>('https://backendwerwirdmillionaer.azurewebsites.net/answer', {
      antwort: this.newQuestion.richtigeAntwort,
    });
    
    forkJoin([obs1, obs2, obs3, obs4]).subscribe((responses) => {
      const [res1, res2, res3, res4] = responses;
      
      const completequestion = {
 ...question,
        falscheAntwort1: res1.id,
        falscheAntwort2: res2.id,
        falscheAntwort3: res3.id,
        richtigeAntwort: res4.id,
      }      
      this.http.post('https://backendwerwirdmillionaer.azurewebsites.net/questions',completequestion).subscribe(() => {
      });
      this.getanswers();
      this.questions.push(completequestion);
    });    
      this.newQuestion = {
      kategorien_id: 1,
      frage: '',
      falscheAntwort1: '',
      falscheAntwort2: '',
      falscheAntwort3: '',
      richtigeAntwort: '',
      countRight: 0,
      countFalse: 0,
    };
    this.addingQuestion = false;
    this.savingQuestion = false;
  }
  isSaveEnabled() {
    return this.newQuestion.kategorien_id &&
           this.newQuestion.frage &&
           this.newQuestion.falscheAntwort1 &&
           this.newQuestion.falscheAntwort2 &&
           this.newQuestion.falscheAntwort3 &&
           this.newQuestion.richtigeAntwort;
}
isComplete(question: any): boolean {
  if (!question) return false;

  const fields = [
    question.kategorien_id,
    question.frage,
    this.getAnswerById(question.falscheAntwort1).antwort,
    this.getAnswerById(question.falscheAntwort2).antwort,
    this.getAnswerById(question.falscheAntwort3).antwort,
    this.getAnswerById(question.richtigeAntwort).antwort,
  ];

  return fields.every(field => field !== '');
}
 
  
  cancelAddingQuestion() {
    this.addingQuestion = false;
    this.newQuestion = {
      kategorien_id: 0,
      frage: '',
      falscheAntwort1: '',
      falscheAntwort2: '',
      falscheAntwort3: '',
      richtigeAntwort: '',
      countRight: 0,
      countFalse: 0,
    };
  }

}


interface Answer {
  id: number;
  antwort: string;
}
interface AnswerResponse {
  id: number;
  antwort: string;
}
