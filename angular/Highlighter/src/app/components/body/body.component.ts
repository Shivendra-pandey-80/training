import { Component } from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {
  space  = " "
  inputValue : string = `  As the evening sun dipped below the horizon, 
  casting a golden glow across the quiet town, 
  Emma sat by her window, 
  staring out at the world she had once known so well. 
  The familiar streets, 
  now bathed in the soft hues of twilight, 
  seemed distant, almost foreign.`;
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
