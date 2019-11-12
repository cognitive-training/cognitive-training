import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICard } from '../memory-game.service';

@Component({
  selector: 'app-card',
  template: `
    <div class="card" [class.flipped]="card.flipped || card.resolved" (click)="flip(card)">
      <div class="front"><img src="{{ card.url }}" /></div>
      <div class="back"></div>
    </div>
  `,
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() card: ICard;
  @Output() flipped = new EventEmitter();

  flip(card: ICard) {
    if (!card.flipped && !card.resolved) {
      this.flipped.emit(card);
    }
  }
}
