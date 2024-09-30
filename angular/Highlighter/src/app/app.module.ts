import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { BodyComponent } from './components/body/body.component';

import { FormsModule } from '@angular/forms';
import { SentenceHightlighterComponent } from './components/sentence-hightlighter/sentence-hightlighter.component';
import { WordHighlighterComponent } from './components/word-highlighter/word-highlighter.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BodyComponent,
    SentenceHightlighterComponent,
    WordHighlighterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
