import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParaHighlighterComponent } from './para-highlighter.component';

describe('ParaHighlighterComponent', () => {
  let component: ParaHighlighterComponent;
  let fixture: ComponentFixture<ParaHighlighterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParaHighlighterComponent]
    });
    fixture = TestBed.createComponent(ParaHighlighterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
