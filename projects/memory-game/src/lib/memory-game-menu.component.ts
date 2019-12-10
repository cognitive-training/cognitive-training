import { Component } from '@angular/core';
import { range } from 'lodash';
import { filter, map, pluck, startWith } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'lib-memory-game-menu',
	template: `
		<mat-card>
			<div class="h1">Jeu des paires</div>
		</mat-card>
		<mat-divider></mat-divider>
		<div class="flex">
			<div class="col-6 p1">
				<h4 class="h3">Objectif</h4>
				<p class="h3">
					Trouve toutes les paires en utilisant le moins de coups possibles.
					<br />
					<br />
					À chaque essai, tu peux retourner 2 cartes, si ce sont les mêmes alors tu as validé une paire, sinon elles
					restent cachées.
					<br />
					<br />
					<span class="bold">Astuce</span>: Mémorise l'emplacement des différentes images pour éviter de les retourner
					inutilement.
				</p>
				<div class="center"><img src="assets/img/preview/memory.jpg" alt="" class="col-6 mx-auto" /></div>
			</div>
			<div class="col-6 p1">
				<h4 class="h3">Paramètre du jeu</h4>
				<div class="flex flex-column" *ngIf="config$ | async as config">
					<mat-form-field>
						<mat-label>Nom du participant</mat-label>
						<input matInput [(ngModel)]="config.name" />
					</mat-form-field>
					<mat-form-field>
						<mat-label>Nombre de paires</mat-label>
						<mat-select [(value)]="config.difficulty">
							<mat-option *ngFor="let difficulty of difficultyList" [value]="difficulty">
								{{ difficulty }}
							</mat-option>
						</mat-select>
					</mat-form-field>
					<div>
						<button mat-raised-button color="primary" class="h2" [routerLink]="['./game']" [queryParams]="config">
							Jouer
						</button>
					</div>
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

	name$ = this.activatedRoute.queryParams.pipe(
		pluck('name'),
		filter(Boolean),
		startWith('Amandine')
	);

	difficulty$ = this.activatedRoute.queryParams.pipe(
		pluck('difficulty'),
		filter(Boolean),
		map(v => +v),
		startWith(this.difficultyList[7])
	);

	config$ = combineLatest([this.name$, this.difficulty$]).pipe(
		map(([name, difficulty]) => ({
			name,
			difficulty
		}))
	);

	constructor(private activatedRoute: ActivatedRoute) {}
}
