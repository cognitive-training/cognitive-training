import { Component } from '@angular/core';

@Component({
	selector: 'lib-home',
	template: `
		<div class="flex flex-wrap justify-center py1">
			<div class="md-col-3 sm-col-6 col-12 p1 border-box" *ngFor="let game of games">
				<mat-card class="cursor-pointer border-box height-fill" [routerLink]="game.link" [queryParams]="game.params">
					<mat-card-header>
						<mat-card-title>{{ game.title }}</mat-card-title>
						<mat-card-subtitle>{{ game.subtitle }}</mat-card-subtitle>
					</mat-card-header>
					<div class="flex justify-center p1">
						<img mat-card-image src="assets/img/preview/{{ game.img }}" class="cursor-pointer" />
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
		</div>
	`
})
export class HomeComponent {
	games = [
		{
			title: 'Jeu des paires',
			subtitle: 'Mémoire',
			description: 'Trouve toutes les paires en utilisant le moins de coups possibles !',
			img: 'memory.jpg',
			link: '/memory'
		},
		{
			title: 'Go/NoGo',
			subtitle: 'inhibition',
			description: 'Valide les images avant la fin du temps !',
			img: 'inhibition.jpg',
			link: '/inhibition'
		},
		{
			title: 'Jeu des chiffres',
			subtitle: 'inhibition',
			description: 'Désigne le chiffre qui a la plus grande valeur numérique !',
			img: 'stroop-numbers.jpg',
			link: '/stroop'
		},
		{
			title: 'Jeu des animaux',
			subtitle: 'inhibition',
			description: "Trouve l'animal le plus grand !",
			img: 'stroop-animals.jpg',
			link: '/stroop',
			params: { mode: 'animals' }
		}
	];
}
