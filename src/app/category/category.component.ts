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
  

  updateScore(score: any) {
    const url = `https://backendwerwirdmillionaer.azurewebsites.net/categories/${score.id}`;
    this.http.put(url, score).subscribe(() => {
      console.log('Category updated successfully');
    });
  }
  deleteScore(id: any) {
    const url = `https://backendwerwirdmillionaer.azurewebsites.net/categories/${id}`;
    this.http.delete(url).subscribe(() => {
      this.categories.splice(this.categories.indexOf(id), 1);
      console.log('Category deleted successfully');
    });
  }

  addCateogry() {
    this.addingCategory = true;
  }

  saveCategory() {
    
      this.http.post('https://backendwerwirdmillionaer.azurewebsites.net/categories', this.newCategory).subscribe(() => {
        console.log('Question updated successfully');
      });
      this.categories.push(this.newCategory);
    
      this.newCategory = {
      name: ''
    };
    this.addingCategory = false;
    this.savingCategory = false;
  }
  cancelAddingCategory() {
    this.addingCategory = false;
    this.newCategory = {
      name: '',
    };
  }

  isSaveEnabled() {
    
    return this.newCategory.name;
  }

  isComplete(category: any){
    return category.name;
  }
}
