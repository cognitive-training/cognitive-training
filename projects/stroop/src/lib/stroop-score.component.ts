import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';

@Component({
	selector: 'lib-stroop-score',
	template: `
		<mat-card>
			<div class="flex flex-auto justify-between items-center">
				<button
					mat-raised-button
					color="primary"
					class="h3"
					[routerLink]="['/stroop/']"
					queryParamsHandling="preserve"
				>
					Retour
				</button>
			</div>
		</mat-card>
		<div class="img-container flex justify-center items-center border-box">
			<div class="h1 center">
				<h2>Bien joué {{ name$ | async }} !</h2>
				<h3>Tu as terminé la séquence !</h3>
				<p>Ton score est de {{ score$ | async }}/{{ length$ | async }}.</p>
				<br />
				<button
					mat-raised-button
					color="primary"
					class="h2"
					[routerLink]="['/stroop/game']"
					queryParamsHandling="preserve"
				>
					Rejouer
				</button>
			</div>
		</div>
	`
})
export class StroopScoreComponent {
	name$ = this.activatedRoute.queryParams.pipe(pluck('name'));
	length$ = this.activatedRoute.queryParams.pipe(pluck('length'));
	score$ = this.activatedRoute.queryParams.pipe(pluck('score'));

	constructor(private activatedRoute: ActivatedRoute) {}
}
