import { Component, Input, SimpleChanges, HostListener ,EventEmitter , Output } from '@angular/core';

@Component({
  selector: 'app-word-highlighter',
  templateUrl: './word-highlighter.component.html',
  styleUrls: ['./word-highlighter.component.scss']
})
export class WordHighlighterComponent {
  space = " ";
  @Input() message: string = '';
  words: string[] = [];

  selectedWordIndices: Set<number> = new Set(); // Set to track selected word indices during drag
  savedRanges: [number, number][] = []; // 2D array to save start and end indices of selections

  // Variables to track dragging
  isDragging = false;
  dragStartIndex: number | null = null;
  dragEndIndex: number | null = null;
  isDeselecting = false; // Flag to track deselection

  @Output() savedRangesChange: EventEmitter<[number,number][]> = new EventEmitter<[number,number][]>();

  ngOnInit() {
    this.sendRangeToParent();
  }  

  // Method to emit the input text to the parent
  sendRangeToParent() {
    this.savedRangesChange.emit(this.savedRanges);
  }

  constructor() {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    this.words = this.message.split(' ');
  }

  // Handle mouse down to start selection or deselection
  startDrag(index: number) {
    this.isDragging = true;
    this.dragStartIndex = index;
    this.dragEndIndex = index;

    // If index is in a range, trigger deselection
    if (this.isInRange(index)) {
      this.isDeselecting = true; // Set the deselection flag
      this.deselectRangeContainingIndex(index); // Remove the range containing the clicked word
      this.selectedWordIndices.clear(); // Clear any temporary selections
    } else {
      this.isDeselecting = false; // Set to false when selecting
      this.updateSelectedWords(); // Start selecting new words
    }
  }

  // Handle mouse move to select multiple words
  dragOver(index: number) {
    if (this.isDragging && this.dragStartIndex !== null && !this.isDeselecting && !this.isInRange(index)) {
      this.dragEndIndex = index;
      this.updateSelectedWords();
    }
  }

  // Handle mouse up to save the selection and end drag
  endDrag() {
    if (this.isDragging && !this.isDeselecting) {
      this.saveSelectedWords(); // Save the selected words as a range if not deselecting
    }
    this.isDragging = false;
    this.isDeselecting = false;
    this.selectedWordIndices.clear(); // Clear the temporary selection
  }

  // Update the selected words based on drag range
  updateSelectedWords() {
    if (this.isDeselecting) return; // Prevent updating selection during deselection

    this.selectedWordIndices.clear(); // Clear previous selections
    if (this.dragStartIndex !== null && this.dragEndIndex !== null) {
      const start = Math.min(this.dragStartIndex, this.dragEndIndex);
      const end = Math.max(this.dragStartIndex, this.dragEndIndex);
      for (let i = start; i <= end; i++) {
        this.selectedWordIndices.add(i);
      }
    }
  }

  // Save the selected words as a range, ensuring no overlaps
  saveSelectedWords() {
    if (this.dragStartIndex !== null && this.dragEndIndex !== null) {
      const newRange: [number, number] = [
        Math.min(this.dragStartIndex, this.dragEndIndex),
        Math.max(this.dragStartIndex, this.dragEndIndex)
      ];
      this.savedRanges.push(newRange); // Add the new range
      this.savedRanges = this.savedRanges.sort((a, b) => a[0] - b[0]); // Sort by start index
    }
    this.sendRangeToParent()
  }

  // Deselect the entire range that contains the given index
  deselectRangeContainingIndex(index: number) {
    this.savedRanges = this.savedRanges.filter(([start, end]) => !(index >= start && index <= end));
  }

  // Check if a word at the given index is within any saved range
  isInRange(index: number): boolean {
    return this.savedRanges.some(([start, end]) => index >= start && index <= end);
  }

  // Check if the word is selected (within any saved range)
  isSelected(index: number): boolean {
    return this.isInRange(index);
  }

  // Only highlight space if it lies between two words that are in the same range
shouldHighlightSpaceAfter(index: number): boolean {
  // Check if the current index and the next index are part of the same range
  return this.savedRanges.some(([start, end]) => index >= start && index < end);
}


  // Handle the mouse leaving the word container to end drag
  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.endDrag(); // End drag when mouse button is released anywhere in the document
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.isDragging) {
      this.endDrag(); // Cancel drag when mouse leaves the container
    }
  }
}
