import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-correctanswer',
  templateUrl: './correctanswer.component.html',
  styleUrls: ['./correctanswer.component.scss']
})

export class CorrectanswerComponent {
  @Input() ranges: [number, number][] = []; // Predefined valid ranges
  @Input() message: string = ''; // Input message to split into words
  words: string[] = []; // Words split from the message
  correctAnswers: [number, number][] = []; // Array to store the correct answer ranges (final selections)
  maxAnswers: number = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (this.message) {
      this.words = this.message.split(' ');
    }
  }

  // Check if a word index is within any of the predefined valid ranges
  isInRange(index: number): boolean {
    return this.ranges.some(([start, end]) => index >= start && index <= end);
  }

  // Mouse down event to start selection, only within allowed ranges
  onMouseDown(index: number): void {
    // Find the range that contains the clicked word
    const range = this.ranges.find(([start, end]) => index >= start && index <= end);
    
    if (range) {
      // If the word is in range, save the range as a correct answer
      this.saveCorrectAnswer(range);
    }
  }

  // Save the range as a correct answer if it's not already saved
  saveCorrectAnswer(range: [number, number]): void {
    const isAlreadyCorrect = this.correctAnswers.some(([start, end]) => start === range[0] && end === range[1]);
    
    // If it's not already saved as a correct answer, add it to correctAnswers
    if (!isAlreadyCorrect) {
      this.correctAnswers.push(range);
    }
  }

  // Update maximum answers allowed when user changes input
  onMaxAnswersChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.maxAnswers = parseInt(inputElement.value, 10) || 0;
  }

  // Check if a word index is part of the correct answers (final selections)
  isCorrectAnswer(index: number): boolean {
    return this.correctAnswers.some(([start, end]) => index >= start && index <= end);
  }

  // Clear all selected correct answers (reset the correct answers)
  clearCorrectAnswers(): void {
    this.correctAnswers = [];
  }
}
