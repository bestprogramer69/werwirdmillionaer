import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryComponent } from './category.component';

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
   let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ], 
      declarations: [ CategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get categories from the backend API', fakeAsync(() => {
    const categories = [{ id: 1, name: 'Category 1' }, { id: 2, name: 'Category 2' }];
    const req = httpMock.expectOne('https://backendwerwirdmillionaer.azurewebsites.net/categories');
    expect(req.request.method).toBe('GET');
    req.flush(categories);

    tick();
    expect(component.categories).toEqual(categories);
  }));

  it('should start editing a category', () => {
    const index = 1;
    component.startEditing(index);
    expect(component.editingIndex).toEqual(index);
  });

  it('should save changes to a category', fakeAsync(() => {
    const score = { id: 1, name: 'New Category Name' };
    const spy = spyOn(component, 'updateScore').and.callThrough();
    component.saveEditing(score);
    expect(spy).toHaveBeenCalledWith(score);

    tick();
    expect(component.editingIndex).toEqual(-1);
  }));
});
