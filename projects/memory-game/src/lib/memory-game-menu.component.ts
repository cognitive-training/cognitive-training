import { Component } from '@angular/core';
import { range } from 'lodash';

@Component({
	selector: 'lib-memory-game-menu',
	template: `
		<mat-card>
			<div class="h1">Memo - Jeu des paires</div>
		</mat-card>
		<mat-divider></mat-divider>
		<div class="flex">
			<div class="col-6 p1">
				<h4 class="h3">Objectif</h4>
				<p class="h3">
					Trouve toutes les paires de carte en utilisant le moins de coups possibles.
					<br />
					<br />
					À chaque essai, tu peux retourner 2 cartes, si ce sont les mêmes alors tu as validé une paire, sinon elles
					restent cachées.
					<br />
					<br />
					<span class="bold">Astuce</span>: Mémorise l'emplacement des différentes images pour éviter de les retourner
					inutilement.
				</p>
				<div class="center"><img src="assets/img/screenshot.png" alt="" class="col-6 mx-auto" /></div>
			</div>
			<div class="col-6 p1">
				<h4 class="h3">Paramètre du jeu</h4>
				<mat-form-field>
					<mat-label>Nombre de paires</mat-label>
					<mat-select [(value)]="config.difficulty">
						<mat-option *ngFor="let difficulty of difficultyList" [value]="difficulty">
							{{ difficulty }}
						</mat-option>
					</mat-select>
				</mat-form-field>
				<div>
					<button mat-raised-button color="primary" class="h2" [routerLink]="['/game']" [queryParams]="config">
						Jouer
					</button>
				</div>
			</div>
		</div>
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
