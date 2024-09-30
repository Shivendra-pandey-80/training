import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-textphrase',
  templateUrl: './textphrase.component.html',
  styleUrls: ['./textphrase.component.scss']
})
export class TextphraseComponent {
  space  = " ";
  inputValue : string = `  As the evening sun dipped below the horizon, 
  casting a golden glow across the quiet town, 
  Emma sat by her window, 
  staring out at the world she had once known so well. 
  The familiar streets, 
  now bathed in the soft hues of twilight, 
  seemed distant, almost foreign.`;
  words: string[] = this.inputValue.split(' ');

  constructor() { }

  selectedWordIndices: Set<number> = new Set(); // Set to track selected word indices

  @Output() textChange: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit() {
    this.sendTextToParent();
  }  

  // Method to emit the input text to the parent
  sendTextToParent() {
    this.textChange.emit(this.inputValue);
  }

  // Apply Bold
  applyBold() {
    const element = document.querySelector(".text-area") as HTMLElement
    element.classList.toggle("text-area-bold");
    const btnElement = document.querySelector(".bold-btn") as HTMLElement
    btnElement.classList.toggle("active");
  }

  // Apply Italic
  applyItalic() {
    const element = document.querySelector(".text-area") as HTMLElement
    element.classList.toggle("text-area-italic");

    const btnElement = document.querySelector(".italic-btn") as HTMLElement
    btnElement.classList.toggle("active");
  }

  // Align Text
  alignText(alignment: string) {
    const element = document.querySelector(".text-area") as HTMLElement
    element.style.textAlign = alignment  
  }
}
