import { Component } from '@angular/core';

interface Card {
  isHidden: boolean;
  isLocked: boolean;
  word: string;
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  possibleWords: string[] = ["Zombie", "Chloe", "Reid", "Rubert", "Coffee", "Job"];
  cards: Card[] = [];
  activeSelection: boolean = false;
  activeCardIndex!: number;
  score: number = 0;
  isLoading: boolean = false;

  constructor() {
    this.createCards();
    this.shuffleCards();
  }

  createCards() {
    for (let word of this.possibleWords) {
      this.cards.push({
        isHidden: true,
        isLocked: false,
        word: word
      });

      this.cards.push({
        isHidden: true,
        isLocked: false,
        word: word
      });
    }
  }

  shuffleCards() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      let randomIndex = Math.floor(Math.random() * (i + 1));

      let temp = this.cards[i];
      this.cards[i] = this.cards[randomIndex];
      this.cards[randomIndex] = temp;
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async onCardClick(c: Card, i: number) {
    if (this.isLoading) {
      return;
    }

    c.isHidden = false;
    // first card is already flipped
    if (this.activeSelection) {
      // correct guess
      if (this.cards[this.activeCardIndex].word == c.word) {
        this.cards[this.activeCardIndex].isLocked = true;
        this.cards[i].isLocked = true;
      }
      // incorrect guess
      else {
        
        this.isLoading = true;
        await this.delay(1000);
        this.isLoading = false;
        //reset cards
        c.isHidden = true;
        this.cards[this.activeCardIndex].isHidden = true;
        // TODO need to fix the page not refreshing after reset
      }
      this.activeSelection = false;
    }
    // no cards have been flipped so far
    else {
      this.activeSelection = true;
      this.activeCardIndex = i;
    }
  }

}
