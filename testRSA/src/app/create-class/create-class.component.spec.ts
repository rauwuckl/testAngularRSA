import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { EncryptionService } from '../encryption.service';

import { CreateClassComponent } from './create-class.component';

class MockEncryptionService{
  createPassword(): Observable<String>{
    return of("test")
  }
}

describe('CreateClassComponent', () => {
  let component: CreateClassComponent;
  let fixture: ComponentFixture<CreateClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateClassComponent ], 
      providers: [{provide: EncryptionService, useClass: MockEncryptionService}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
