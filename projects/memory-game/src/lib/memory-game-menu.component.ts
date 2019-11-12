import { Component } from '@angular/core';
import { range } from 'lodash';

@Component({
  selector: 'lib-memory-game-menu',
  template: `
    <mat-card>
      <div class="mat-h1">Memory Game</div>
    </mat-card>
    <mat-divider></mat-divider>
    <mat-card>
      <mat-card-content>
        <h4 class="mat-h3">Objectif</h4>
        <p>
          Trouve toutes les paires de carte en utilisant le moins de coups possibles. À chaque essai, tu peux retourner
          2 cartes, si ce sont les mêmes elles resteront visibles, sinon elles reviendront à leur état initial.
        </p>
        <div class="flex">
          <img src="assets/img/screenshot.png" alt="" />
          <mat-card>
            <h4>Paramètre du jeu</h4>
            <mat-card-content>
              <mat-form-field>
                <mat-label>Difficulté</mat-label>
                <mat-select [(value)]="config.difficulty">
                  <mat-option *ngFor="let difficulty of difficultyList" [value]="difficulty">
                    {{ difficulty }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </mat-card-content>
            <mat-card-actions
              ><button mat-raised-button color="primary" class="mat-h1" [routerLink]="['/game']" [queryParams]="config">
                Jouer
              </button></mat-card-actions
            >
          </mat-card>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
    :host {
        font-size: 20px;
    }
    `
  ]
})
export class MemoryGameMenuComponent {
  difficultyList = range(1, 20);

  config = {
    difficulty: this.difficultyList[1]
  };
}
