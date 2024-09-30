import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextphraseComponent } from './textphrase.component';

describe('TextphraseComponent', () => {
  let component: TextphraseComponent;
  let fixture: ComponentFixture<TextphraseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextphraseComponent]
    });
    fixture = TestBed.createComponent(TextphraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
