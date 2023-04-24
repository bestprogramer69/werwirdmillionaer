import { Component, OnInit, ElementRef, Renderer2  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})


export class QuizComponent implements OnInit{
  questions: Question[] = [];
  currentQuestion: Question = {id: 0, kategorien_id: 0,frage: "", falscheAntwort1: 0, falscheAntwort2: 0, falscheAntwort3: 0, richtigeAntwort: 0 , countRight: 0, countFalse: 0 };
  answer1: any;
  answer2: any;
  answer3: any;
  answer4: any;
  answers: Answer[] = [];
  currentAnswers: Answer[] = [];
  jokerUsed: boolean = false;
  gameOver: boolean = false;
  playerdata: any;
  win: boolean = false;
  availableQuestions: Question[] = [];
  pl: Question[] = [];
  nextenabled: boolean = false;
  pointsRight : number = 0;
  pointsFalse : number = 0;
  percentRight: number= 0;
  percentFalse: number = 0;
  
  constructor(private http: HttpClient, private router: Router, private renderer: Renderer2, private el: ElementRef) {

  }

  ngOnInit() {
    const storedPlayerData = localStorage.getItem('playerdata');    
    if (storedPlayerData) {
      this.playerdata = JSON.parse(storedPlayerData);      
    }
      localStorage.setItem('gameStarted', `${true}`);
    const url = 'https://backendwerwirdmillionaer.azurewebsites.net/questions';
    const answersUrl = 'https://backendwerwirdmillionaer.azurewebsites.net/answer';
  
    forkJoin([
      this.http.get<Question[]>(url),
      this.http.get<Answer[]>(answersUrl)
    ]).subscribe((response) => {      
      this.questions = response[0];
      this.answers = response[1];
      const currentQuestionId = localStorage.getItem('currentQuestionId');            
      if (currentQuestionId) {
       
        
        const question = this.questions.find(q => q.id === parseInt(currentQuestionId));
       
        if(question){
          
        this.loadQuestion(question)
        }
        else{
          this.startGame();
        }
    }
      else{
      this.startGame();
      }
    });
  
    
    
    
  }

  startGame() {
        
    this.availableQuestions = this.questions.filter(q => q.kategorien_id === parseInt(this.playerdata.kategorien_id));    
    localStorage.setItem('availableQuestions', JSON.stringify(this.availableQuestions));

    this.currentQuestion = this.getNextQuestion();
    this.currentAnswers = this.getShuffledAnswers();

    localStorage.setItem('currentQuestionId', this.currentQuestion.id.toString());
       
    
    this.gameOver = false;
    this.jokerUsed = false;
    localStorage.setItem('joker', false.toString());
    
  }

  getNextQuestion(): Question {
      
    const randomIndex = Math.floor(Math.random() * this.availableQuestions.length);
    
    return this.availableQuestions[randomIndex];
  }

  loadQuestion(question: any){
    const joker = localStorage.getItem('joker');
    if (joker === 'true') {
      this.jokerUsed = true;
    }
    else{
      this.jokerUsed = false;
    }
    const storedPlayerData = localStorage.getItem('playerdata');
  
    if (storedPlayerData) {
      this.playerdata = JSON.parse(storedPlayerData);      
    }
    
    this.currentQuestion = question;
    const availableQuestionsString = localStorage.getItem('availableQuestions');
if (availableQuestionsString) {
  this.availableQuestions = JSON.parse(availableQuestionsString);

  
}
   this.currentAnswers = this.getShuffledAnswers();

  }

  getShuffledAnswers(): Answer[] {
     
    const answers = [
      this.getAnswerById(this.currentQuestion.richtigeAntwort),
      this.getAnswerById(this.currentQuestion.falscheAntwort1),
      this.getAnswerById(this.currentQuestion.falscheAntwort2),
      this.getAnswerById(this.currentQuestion.falscheAntwort3)
    ];

    
    const shuffledAnswers = [];
    while (answers.length > 0) {
      const randomIndex = Math.floor(Math.random() * answers.length);
      const answer = answers[randomIndex];
      if (answer) {
        shuffledAnswers.push(answer);
      }
      answers.splice(randomIndex, 1);
    }
    return shuffledAnswers;
  }
  

  getAnswerById(id: number): Answer | undefined {
  
    
    return this.answers.find(a => a.id === id);
  }
  answerQuestion(answer: Answer) {
    this.pointsRight = this.currentQuestion.countRight
    this.pointsFalse = this.currentQuestion.countFalse
    const button = this.el.nativeElement.querySelector(`#answer-${answer.id}`)
    const answerButtons = document.getElementsByClassName("answer-button") as HTMLCollectionOf<HTMLButtonElement>;
    for (let i = 0; i < answerButtons.length; i++) {
      answerButtons[i].disabled = true;
    }
    const urlQuestion = `https://backendwerwirdmillionaer.azurewebsites.net/questions/${this.currentQuestion.id}`;
    if (answer.id === this.currentQuestion.richtigeAntwort) {
      
      
      this.availableQuestions = this.availableQuestions.filter(q => q !== this.currentQuestion);   
      localStorage.setItem('availableQuestions', JSON.stringify(this.availableQuestions));
     
      
      this.pointsRight ++;
      this.http.put(urlQuestion, {
        countRight: this.pointsRight
      }).subscribe(() => {
      });
      this.renderer.setStyle(button, 'background-color', 'green');
      this.playerdata.punktzahl += 30;
      if (this.availableQuestions.length === 0) {        
        this.win = true;
        localStorage.setItem('gameStarted', `${false}`);
      } else {
        this.nextenabled = true;
      }
      localStorage.setItem('playerdata',  JSON.stringify(this.playerdata));
  
    } else {
      this.pointsFalse ++;
      this.http.put(urlQuestion, {
        countFalse: this.pointsFalse
      }).subscribe(() => {
      });
      const correctButton = this.el.nativeElement.querySelector(`#answer-${this.currentQuestion.richtigeAntwort}`)
       this.renderer.setStyle(button, 'background-color', 'red');
       this.renderer.setStyle(correctButton, 'background-color', 'lightgreen');
      this.gameOver = true;
      localStorage.setItem('gameStarted', `${false}`);
    }
const completepoints = this.pointsRight + this.pointsFalse;
    this.percentRight =  Math.round((this.pointsRight / completepoints) * 100);
    this.percentFalse = Math.round((this.pointsFalse / completepoints) * 100);
  }
  nextQuestion(){
    const storedPlayerData = localStorage.getItem('playerdata');

    if (storedPlayerData) {
      this.playerdata = JSON.parse(storedPlayerData);      
    }
    const answerButtons = document.getElementsByClassName("answer-button") as HTMLCollectionOf<HTMLButtonElement>;
    for (let i = 0; i < answerButtons.length; i++) {
      answerButtons[i].disabled = false;
      answerButtons[i].style.backgroundColor = '';
    }
    this.nextenabled = false;
    this.currentQuestion = this.getNextQuestion();
    this.currentAnswers = this.getShuffledAnswers();
    localStorage.setItem('currentQuestionId', this.currentQuestion.id.toString());
    
  }

  playAgain() {
    const date = new Date();
    const formattedDateTime = date.toISOString();
    const spiel = {
      ...this.playerdata, 
      ende: formattedDateTime
    }    
    this.http.post('https://backendwerwirdmillionaer.azurewebsites.net/game',spiel).subscribe(() => {

    }); 
    localStorage.removeItem('availableQuestions');
    localStorage.removeItem('currentQuestionId');
    localStorage.removeItem('playerdata')
    this.router.navigate(['/'])
  }
  
  end(){
    localStorage.removeItem('availableQuestions');
    localStorage.removeItem('currentQuestionId');
    localStorage.removeItem('playerdata')
    this.router.navigate(['/'])
  }
  cashOut(){
    const date = new Date();
    const formattedDateTime = date.toISOString();
    const spiel = {
      ...this.playerdata, 
      ende: formattedDateTime
    }    
    this.http.post('https://backendwerwirdmillionaer.azurewebsites.net/game',spiel).subscribe(() => {
    }); 
    localStorage.removeItem('availableQuestions');
    localStorage.removeItem('currentQuestionId');
    localStorage.removeItem('playerdata')
    this.router.navigate(['/'])
  }

  Joker() {
    localStorage.setItem('joker', true.toString());
    this.jokerUsed = true;
    const buttons = Array.from(this.el.nativeElement.querySelectorAll('.answer-button')) as HTMLElement[];
    
    const falseAnswers= [this.currentQuestion.falscheAntwort1, this.currentQuestion.falscheAntwort2, this.currentQuestion.falscheAntwort3]
    const randomFalseAnswers = falseAnswers.sort(() => 0.5 - Math.random()).slice(0, 2);

    const buttonIds = randomFalseAnswers.slice(0, 2).map(id => `answer-${id}`);
    
    for (const id of buttonIds) {
      const button = Array.from(buttons).find((btn: HTMLElement) => btn.id === id) as HTMLButtonElement;
      if (button) {
        button.disabled = true;
        button.classList.add('disabled-button');

      }
    }
  }

  
  
}
  
  


interface Question {
  id: number;
  frage: string;
  kategorien_id : number;
  falscheAntwort1: number;
  falscheAntwort2: number;
  falscheAntwort3: number;
  richtigeAntwort: number;
  countRight: number;
  countFalse: number;
}
interface Answer {
  id: number;
  antwort: string;
  disabled: boolean; 
}
