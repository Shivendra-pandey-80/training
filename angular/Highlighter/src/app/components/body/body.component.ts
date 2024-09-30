import { Component } from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {
  space  = " "
  inputValue : string = ``;
  words: string[] = this.inputValue.split(' ');

  constructor(){
    
  }

  receivedText: string = '';

  // Method to receive the text from the child component
  handleTextChange(text: string) {
    this.receivedText = text;
    console.log(this.handleTextChange)
  }
  saveData() {
    this.words = this.inputValue.split(' ');
  }

  selectedOption: string = 'word'; // Default option to show

  // Function to update the selected option
  selectOption(option: string) {
    this.selectedOption = option;
  }
}
