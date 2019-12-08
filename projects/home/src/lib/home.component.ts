import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'lib-home',
	template: `
		<div class="flex py2">
			<mat-card
				class="col-3 mx1 cursor-pointer"
				*ngFor="let game of games"
				[routerLink]="game.link"
				[queryParams]="game.params"
			>
				<mat-card-header>
					<div mat-card-avatar class="example-header-image"></div>
					<mat-card-title>{{ game.title }}</mat-card-title>
					<mat-card-subtitle>{{ game.subtitle }}</mat-card-subtitle>
				</mat-card-header>
				<div class="flex justify-center p1">
					<img mat-card-image src="assets/img/{{ game.img }}" class="cursor-pointer" />
				</div>
				<mat-card-content>
					<p>
						{{ game.description }}
					</p>
				</mat-card-content>
				<mat-card-actions>
					<div class="justify-center flex">
						<button mat-raised-button [routerLink]="game.link" [queryParams]="game.params">Jouer</button>
					</div>
				</mat-card-actions>
			</mat-card>
		</div>
	`
})
export class HomeComponent implements OnInit {
	games = [
		{
			title: 'Jeu des paires',
			subtitle: 'Mémoire',
			description: 'Trouve toutes les paires de carte en utilisant le moins de coups possibles.',
			img: 'memory.png',
			link: '/memory'
		},
		{
			title: 'Go/NoGo',
			subtitle: 'inhibition',
			description: 'Valide les images qui te sont présentées avant la fin du temps.',
			img: 'inhibition.png',
			link: '/inhibition'
		},
		{
			title: 'Jeu des chiffres',
			subtitle: 'inhibition',
			description: 'Désigne le chiffre qui a la plus grande valeur numérique.',
			img: 'stroop-numbers.png',
			link: '/stroop'
		},
		{
			title: 'Jeu des animaux',
			subtitle: 'inhibition',
			description: "Désigne l'animal le plus grand dans la réalité.",
			img: 'stroop-animals.png',
			link: '/stroop',
			params: { mode: 'animals' }
		}
	];

	constructor() {}

	ngOnInit() {}
}
