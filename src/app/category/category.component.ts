import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
categories: any = [];
  editingIndex: number = -1;
  addingCategory: boolean = false;
  savingCategory: boolean = false;
  newCategory = {
   name: '',
  };

  constructor(private http: HttpClient) {
    this.http.get('https://backendwerwirdmillionaer.azurewebsites.net/categories').subscribe(data => {
      this.categories = data;
    });
  }

  startEditing(index: number) {
    this.editingIndex = index;
  }

  saveEditing(score: any) {
    this.updateScore(score);
    this.editingIndex = -1;
  }
  
//put request for category
  updateScore(score: any) {
    const url = `https://backendwerwirdmillionaer.azurewebsites.net/categories/${score.id}`;
    this.http.put(url, score).subscribe(() => {
    });
  }
  //delete request for category
  deleteScore(id: any) {
    // Check if any questions exist for this category
    const url = `https://backendwerwirdmillionaer.azurewebsites.net/questions`;
    this.http.get(url).subscribe((response) => {
      console.log(response);
      
      const questions: any = (<any[]>response).filter((question: { kategorien_id: string }) => question.kategorien_id === id);
      if (questions && questions.length > 0) {        
        if (confirm(`There are ${questions.length} questions associated with this category. Do you want to delete them?`)) {
          console.log('deleting questions');
          
          for (let i = 0; i < questions.length; i++) {           
            const questionId = questions[i].id;          
            const answers = [
              questions[i].falscheAntwort1,
              questions[i].falscheAntwort2,
              questions[i].falscheAntwort3,
              questions[i].richtigeAntwort,
            ]
           
            answers.forEach(answer => {
         
              
              const answerUrl = `https://backendwerwirdmillionaer.azurewebsites.net/questions/${answer}`;
              console.log(answerUrl);
              
              this.http.delete(answerUrl).subscribe();
            });
            
             const questionUrl = `https://backendwerwirdmillionaer.azurewebsites.net/questions/${questionId}`;
             console.log(questionUrl);
            this.http.delete(questionUrl).subscribe();
          }
          const categoryUrl = `https://backendwerwirdmillionaer.azurewebsites.net/categories/${id}`; 
          console.log(categoryUrl);
          
          this.http.delete(categoryUrl).subscribe(() => {
            this.categories.splice(this.categories.indexOf(id), 1); 
          });
                }
      } else {
        const categoryUrl = `https://backendwerwirdmillionaer.azurewebsites.net/categories/${id}`;
        this.http.delete(categoryUrl).subscribe(() => {
          this.categories.splice(this.categories.indexOf(id), 1);
        });
      }
    });
  }
  
  

  addCateogry() {
    this.addingCategory = true;
  }

  //post request for category
  saveCategory() {
      this.http.post('https://backendwerwirdmillionaer.azurewebsites.net/categories', this.newCategory).subscribe(() => {
      });
      this.categories.push(this.newCategory);
    
      this.newCategory = {
      name: ''
    };
    this.addingCategory = false;
    this.savingCategory = false;
  }

  //delete new category
  cancelAddingCategory() {
    this.addingCategory = false;
    this.newCategory = {
      name: '',
    };
  }

  //only if all inputs aren't empty
  isSaveEnabled() {
    
    return this.newCategory.name;
  }

  //only if all inputs aren't empty
  isComplete(category: any){
    return category.name;
  }
}
