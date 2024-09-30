import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { BodyComponent } from './components/body/body.component';

import { FormsModule } from '@angular/forms';
import { SentenceHightlighterComponent } from './components/sentence-hightlighter/sentence-hightlighter.component';
import { WordHighlighterComponent } from './components/word-highlighter/word-highlighter.component';
import { ParaHighlighterComponent } from './components/para-highlighter/para-highlighter.component';
import { TextphraseComponent } from './components/textphrase/textphrase.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BodyComponent,
    SentenceHightlighterComponent,
    WordHighlighterComponent,
    ParaHighlighterComponent,
    TextphraseComponent
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
