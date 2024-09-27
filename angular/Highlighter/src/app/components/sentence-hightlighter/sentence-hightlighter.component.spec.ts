import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentenceHightlighterComponent } from './sentence-hightlighter.component';

describe('SentenceHightlighterComponent', () => {
  let component: SentenceHightlighterComponent;
  let fixture: ComponentFixture<SentenceHightlighterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SentenceHightlighterComponent]
    });
    fixture = TestBed.createComponent(SentenceHightlighterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
