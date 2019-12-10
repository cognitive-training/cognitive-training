import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'lib-memory-game-win-dialog',
  template: `
    <h2 mat-dialog-title>Bravo !</h2>
    <mat-dialog-content class="mat-typography">
      <h3>Tu as gagné !</h3>
      <p>Tu as trouvé les {{ data.difficulty$ | async }} paires en {{ data.nbTries }} coups !</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button mat-dialog-close>Ok</button>
      <button
        mat-raised-button
        mat-dialog-close
        [routerLink]="['./memory']"
      >
        Rejouer
      </button>
    </mat-dialog-actions>
  `
})
export class MemoryGameWinDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data) {}
}
