import { Component } from '@angular/core';

@Component({
  selector: 'app-sentence-hightlighter',
  templateUrl: './sentence-hightlighter.component.html',
  styleUrls: ['./sentence-hightlighter.component.scss']
})
export class SentenceHightlighterComponent {
  space = ' ';
  inputValue: string = 'Shiv Akhila is bad. It needs to be better! How can we fix it?';
  sentences: string[] = this.inputValue.split(/(?<=[.!?])\s+/); // Split by sentence-ending punctuation

  selectedSentenceIndices: Set<number> = new Set(); // Set to track selected sentence indices

  constructor() { }

  saveData() {
    // Split the input into sentences by punctuation marks and update the sentences array
    this.sentences = this.inputValue.split(/(?<=[.!?])\s+/);
  }

  selectSentence(index: number) {
    console.log('entered select');
    if (this.selectedSentenceIndices.has(index)) {
      this.selectedSentenceIndices.delete(index); // Deselect if already selected
    } else {
      this.selectedSentenceIndices.add(index); // Select if not selected
    }
    console.log(this.selectedSentenceIndices);
  }

  isSelected(index: number): boolean {
    return this.selectedSentenceIndices.has(index); // Check if sentence is selected
  }

  shouldHighlightSpaceAfter(index: number): boolean {
    // Highlight space only if the current sentence and the next sentence are both selected
    return this.isSelected(index) && this.isSelected(index + 1);
  }
}
