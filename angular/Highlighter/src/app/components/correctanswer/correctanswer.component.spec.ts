import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectanswerComponent } from './correctanswer.component';

describe('CorrectanswerComponent', () => {
  let component: CorrectanswerComponent;
  let fixture: ComponentFixture<CorrectanswerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorrectanswerComponent]
    });
    fixture = TestBed.createComponent(CorrectanswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
