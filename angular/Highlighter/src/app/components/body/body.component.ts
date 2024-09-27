import { Component } from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {
  space  = " "
  inputValue : string = "shiv akhila is bad";
  words: string[] = this.inputValue.split(' ');

  constructor(){
    
  }
  selectedWordIndices: Set<number> = new Set(); // Set to track selected word indices
  saveData() {
    this.words = this.inputValue.split(' ');
  }

  selectWord(index: number) {
    console.log("entered select")
    if (this.selectedWordIndices.has(index)) {
      this.selectedWordIndices.delete(index); // Deselect if already selected
    } else {
      this.selectedWordIndices.add(index); // Select if not selected
    }
    console.log(this.selectedWordIndices)
  }

  isSelected(index: number): boolean {
    return this.selectedWordIndices.has(index); // Check if word is selected
  }

  shouldHighlightSpaceAfter(index: number): boolean {
    // Highlight space only if current word and next word are both selected
    return this.isSelected(index) && this.isSelected(index + 1);
  }

  selectedOption: string = 'word'; // Default option to show

  // Function to update the selected option
  selectOption(option: string) {
    this.selectedOption = option;
  }
}
