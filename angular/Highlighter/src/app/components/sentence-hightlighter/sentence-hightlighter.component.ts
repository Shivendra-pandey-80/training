import { Component, Input, SimpleChanges, HostListener } from '@angular/core';

@Component({
  selector: 'app-sentence-hightlighter',
  templateUrl: './sentence-hightlighter.component.html',
  styleUrls: ['./sentence-hightlighter.component.scss']
})
export class SentenceHightlighterComponent {
  space = ' ';
  @Input() message: string = '';
  sentences: string[] = [];
  
  savedRanges: [number, number][] = []; // 2D array to store word ranges for each highlighted sentence
  selectedSentenceIndices: Set<number> = new Set(); // Temporary set for tracking selection during dragging

  // Variables for dragging logic
  isDragging = false;
  dragStartIndex: number | null = null;
  dragEndIndex: number | null = null;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    this.sentences = this.message.split(/(?<=[.!?])\s+/);
    this.savedRanges = [];
    this.selectedSentenceIndices.clear();
  }

  // Start dragging to select sentences
  startDrag(index: number) {
    this.isDragging = true;
    this.dragStartIndex = index;
    this.dragEndIndex = index;
    // Select or deselect the entire sentence
    this.toggleSentence(index);
  }

  // Handle dragging over sentences
  dragOver(index: number) {
    if (this.isDragging && this.dragStartIndex !== null) {
      this.dragEndIndex = index;
      this.updateSelectedSentences();
    }
  }

  // End dragging and save the sentence range
  endDrag() {
    if (this.isDragging) {
      this.saveSelectedSentences();
    }
    this.isDragging = false;
    this.selectedSentenceIndices.clear(); // Clear the temporary selection
  }

  // Update the selected sentences based on drag range
  updateSelectedSentences() {
    this.selectedSentenceIndices.clear();
    if (this.dragStartIndex !== null && this.dragEndIndex !== null) {
      const start = Math.min(this.dragStartIndex, this.dragEndIndex);
      const end = Math.max(this.dragStartIndex, this.dragEndIndex);
      for (let i = start; i <= end; i++) {
        this.selectedSentenceIndices.add(i);
      }
    }
  }

  // Save the selected sentences as word ranges
  saveSelectedSentences() {
    if (this.selectedSentenceIndices.size === 0) {
      return; // No selected sentences
    }
  
    let minStartWordIndex = Infinity;
    let maxEndWordIndex = -Infinity;
  
    this.selectedSentenceIndices.forEach(index => {
      const startWordIndex = this.getWordIndexFromSentence(index);
      const endWordIndex = this.getWordIndexFromSentence(index + 1) - 1; // Exclusive end
  
      // Update min and max indices
      minStartWordIndex = Math.min(minStartWordIndex, startWordIndex);
      maxEndWordIndex = Math.max(maxEndWordIndex, endWordIndex);
    });
  
    // Create a single merged range and replace savedRanges
    const mergedRange: [number, number] = [minStartWordIndex, maxEndWordIndex];
    this.savedRanges.push(mergedRange);
    this.savedRanges = this.savedRanges.sort((a, b) => a[0] - b[0]);
  }

  // Toggle the selection of a sentence
  toggleSentence(index: number) {
    const wordindex = this.getWordIndexFromSentence(index);
    console.log("-----------------------------------------------",index,wordindex)
    if (this.isInRange(wordindex)) {
      this.deselectSentence(index);
    } else {
      this.selectSentence(index);
    }
  }


  // Deselect the entire sentence range
  deselectSentence(index: number) {
    console.log("--------------------------------- in deselect sentence --------------------------")
    const wordStartIndex = this.getWordIndexFromSentence(index);
    const wordEndIndex = this.getWordIndexFromSentence(index + 1) - 1; // Exclusive end
    console.log(wordEndIndex,wordStartIndex)
    this.savedRanges = this.savedRanges.filter(([start, end]) => !(wordStartIndex >= start && wordEndIndex <= end));
    console.log(this.savedRanges)
  }

  // Select a sentence and highlight it
  selectSentence(index: number) {
    this.selectedSentenceIndices.add(index);
  }

  // Check if the sentence at the given index is within any saved range
  isInRange(index: number): boolean {
    const wordStartIndex = this.getWordIndexFromSentence(index);
    const wordEndIndex = this.getWordIndexFromSentence(index + 1) - 1;
    return this.savedRanges.some(([start, end]) => wordStartIndex >= start && wordEndIndex <= end);
  }

  // Get the word index where the sentence starts
  getWordIndexFromSentence(sentenceIndex: number): number {
    return this.sentences.slice(0, sentenceIndex).reduce((acc, sentence) => acc + sentence.split(/\s+/).length, 0);
  }

  // Check if a sentence is selected
  isSelected(index: number): boolean {
    return this.isInRange(index);
  }

  // Only highlight space if it is within a range
  shouldHighlightSpaceAfter(index: number): boolean {
    const wordStartIndex = this.getWordIndexFromSentence(index);
    const wordEndIndex = this.getWordIndexFromSentence(index + 1) - 1;
    return this.savedRanges.some(([start, end]) => wordStartIndex >= start && wordEndIndex <= end);
  }

  // Handle mouse leave to end drag
  onMouseLeave() {
    if (this.isDragging) {
      this.endDrag(); // Cancel drag when mouse leaves the container
    }
  }

  // Handle mouse up to end drag
  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.endDrag(); // End drag when mouse button is released anywhere in the document
  }
}
