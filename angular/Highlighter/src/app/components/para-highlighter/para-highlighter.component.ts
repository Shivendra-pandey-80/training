import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-para-highlighter',
  templateUrl: './para-highlighter.component.html',
  styleUrls: ['./para-highlighter.component.scss']
})


export class ParaHighlighterComponent {
  @Input() message: string = ''; 
  paragraphs: string[] = []; // Array to hold paragraphs
  selectedParagraphIndices: Set<number> = new Set(); // Track selected paragraphs

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    // Split the message into paragraphs based on line breaks (\n or \r\n) or two or more spaces
    this.paragraphs = this.message.split(/\n+/).filter(paragraph => paragraph.trim().length > 0);
  }

  selectParagraph(index: number) {
    if (this.selectedParagraphIndices.has(index)) {
      this.selectedParagraphIndices.delete(index); // Deselect if already selected
    } else {
      this.selectedParagraphIndices.add(index); // Select if not selected
    }
  }

  isSelected(index: number): boolean {
    return this.selectedParagraphIndices.has(index); // Check if the paragraph is selected
  }
}
