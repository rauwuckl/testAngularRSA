import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { EncryptionService } from '../encryption.service';

import { LehrerViewComponent } from './lehrer-view.component';

class MockEncryptionService{
}

describe('LehrerViewComponent', () => {
  let component: LehrerViewComponent;
  let fixture: ComponentFixture<LehrerViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LehrerViewComponent ],
      providers: [
        {provide: ActivatedRoute, useValue: {snapshot: {paramMap: new Map([['secret', 'testSecret']])}} },
        {provide: EncryptionService, useClass: MockEncryptionService}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LehrerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
