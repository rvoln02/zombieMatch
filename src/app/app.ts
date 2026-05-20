import { Component, ChangeDetectorRef } from '@angular/core';

interface Card {
  isHidden: boolean;
  isLocked: boolean;
  url: string;
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  pictureCount: number = 8;
  cards: Card[] = [];
  preloadedImages: HTMLImageElement[] = [];
  activeSelection: boolean = false;
  activeCardIndex!: number;

  score: number = 0;
  moveCount: number = 0;
  isLoading: boolean = false;
  constructor(private cdr: ChangeDetectorRef) {
    this.preloadPictures();
    this.createCards();
    this.shuffleCards();
  }

  preloadPictures() {
    for (let i = 1; i <= this.pictureCount; i++) {
      const img = new Image();
      img.src = "kittypics/zombie" + i + ".png";

      this.preloadedImages.push(img);
    }
  }

  createCards() {
    for (let i: number = 1; i <= this.pictureCount; i++) {
      this.cards.push({
        isHidden: true,
        isLocked: false,
        url: "kittypics/zombie" + i + ".png"
      });

      this.cards.push({
        isHidden: true,
        isLocked: false,
        url: "kittypics/zombie" + i + ".png"
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
    let audio = new Audio();
    audio.src = "sfx/click.mp3";
    //audio.load();
    audio.play();

    c.isHidden = false;
    // first card is already flipped
    if (this.activeSelection) {
      this.moveCount++;
      // correct guess
      if (this.cards[this.activeCardIndex].url == c.url) {
        // Play meow sound effect
        const meowNum = Math.floor(Math.random() * 4) + 1;
        audio.src = "sfx/meow" + meowNum + ".mp3";
        //audio.load();
        audio.volume = 0.1;
        audio.play();
        this.score++;
        this.cards[this.activeCardIndex].isLocked = true;
        this.cards[i].isLocked = true;
        if (this.score == this.pictureCount) {
          audio.src = "sfx/win.mp3";
          audio.play();
          this.confettiFall();
        }
      }
      // incorrect guess
      else {
        this.isLoading = true;

        await this.delay(1000);
        
        //reset cards
        c.isHidden = true;
        this.cards[this.activeCardIndex].isHidden = true;
        
        this.isLoading = false;
        // update the page
        this.cdr.detectChanges();
      }
      this.activeSelection = false;
    }
    // no cards have been flipped so far
    else {
      this.activeSelection = true;
      this.activeCardIndex = i;
    }
  }

  confettiFall() {
    const confettiWrapper = document.querySelector('.confetti-wrapper');

    if (!confettiWrapper) {
      return;
    }

    for (let i = 0; i < 60; i++) {
      const confetti = document.createElement('div');

      confetti.classList.add('confetti-piece');
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.setProperty('--fall-duration', `${Math.random() * 3 + 3}s`);
      confetti.style.setProperty('--confetti-color', this.getRandomColor());

      confettiWrapper.appendChild(confetti);
    }
  }

  getRandomColor() {
    const colors = ['#ff6347', '#ffa500', '#32cd32', '#1e90ff', '#ff69b4'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  restartGame() {
    window.location.reload();
  }
}
