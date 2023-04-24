import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { LoginComponent } from './login.component';
import { HeaderComponent } from '../header/header.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: Router;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [LoginComponent, HeaderComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show alert and not navigate to dashboard if login is incorrect', () => {
    spyOn(window, 'alert');
    component.user = 'testuser';
    component.password = 'testpassword';
    spyOn(component['http'], 'get').and.returnValue(of([{ password: 'wrongpassword' }]));
    component.login();
    expect(window.alert).toHaveBeenCalledWith('incorrect login');
  });
  
  it('should show alert and not navigate to dashboard if login does not exist', () => {
    spyOn(window, 'alert');
    component.user = 'testuser';
    component.password = 'testpassword';
    
    spyOn(component['http'], 'get').and.returnValue(of(null));
    component.login();
    expect(window.alert).toHaveBeenCalledWith('login not existing');
  });
});
