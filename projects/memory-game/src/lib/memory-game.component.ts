import { Component, OnDestroy, OnInit } from '@angular/core';
import { ICard, MemoryGameService } from './memory-game.service';
import { MatDialog } from '@angular/material';
import { MemoryGameWinDialogComponent } from './win-dialog/memory-game-win-dialog.component';

const difficultyToCols = {
  1: 2,
  2: 4,
  3: 3,
  4: 4,
  5: 5,
  6: 5,
  7: 5,
  8: 6,
  9: 6,
  10: 6
};

@Component({
  selector: 'lib-memory-game',
  template: `
    <mat-card>
      <div class="flex flex-auto justify-between">
        <div class="mat-h1">Memory Game</div>
        <div class="mat-h1">Coups: {{ nbTries$ | async }}</div>
        <div class="mat-h1" *ngIf="resolvedPairList$ | async as resolvedPairList">
          Paires trouvées: {{ resolvedPairList.length }} / {{ difficulty$ | async }}
        </div>
        <button mat-raised-button color="primary" [routerLink]="['..']">Retour au menu</button>
      </div>
    </mat-card>
    <mat-divider></mat-divider>
    <div class="flex flex-wrap p1 justify-center">
      <div *ngFor="let card of cards$ | async; trackBy: trackByCards" style="width: 200px; height: 200px">
        <app-card [card]="card" (flipped)="flipCard($event)"></app-card>
      </div>
    </div>
  `,
  providers: [MemoryGameService]
})
export class MemoryGameComponent implements OnInit, OnDestroy {
  difficultyToCols = difficultyToCols;
  cards$ = this.memoryGame.cards$;
  resolvedPairList$ = this.memoryGame.resolvedPairList$;
  nbTries$ = this.memoryGame.nbTries$;
  difficulty$ = this.memoryGame.difficulty$;

  constructor(private memoryGame: MemoryGameService, public dialog: MatDialog) {}

  trackByCards(index: number, card: ICard) {
    return card.id;
  }

  flipCard(card: ICard) {
    this.memoryGame.selectCard(card);
  }

  ngOnDestroy(): void {
    console.log('destroy');
  }

  ngOnInit(): void {
    this.memoryGame.win$.subscribe(([, nbTries]) => {
      this.dialog.open(MemoryGameWinDialogComponent, {
        data: { difficulty$: this.memoryGame.difficulty$, nbTries }
      });
    });
  }
}
