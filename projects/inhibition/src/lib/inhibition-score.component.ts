import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, pluck } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@Component({
	selector: 'lib-inhibition-score',
	template: `
		<mat-card>
			<div class="flex flex-auto justify-between items-center">
				<button mat-raised-button color="primary" class="h3" [routerLink]="['..']" queryParamsHandling="preserve">
					Retour
				</button>
			</div>
		</mat-card>
		<div class="img-container flex justify-center items-center border-box">
			<div class="h1 center">
				<h2>Bien joué {{ name$ | async }} !</h2>
				<h3>Tu as terminé la séquence !</h3>
				<p>Ton score est de {{ score$ | async }} / {{ length$ | async }}.</p>
				<br />
				<p>
					Tu as commis {{ errorCount$ | async }} erreur<span *ngIf="(errorCount$ | async) > 1">s</span> pour la cible.
				</p>
				<p>Tu as manqué {{ missCount$ | async }} image<span *ngIf="(missCount$ | async) > 1">s</span>.</p>
				<br />
				<button
					mat-raised-button
					color="primary"
					class="h2"
					[routerLink]="['/inhibition/game']"
					queryParamsHandling="preserve"
				>
					Rejouer
				</button>
			</div>
		</div>
	`
})
export class InhibitionScoreComponent {
	name$ = this.activatedRoute.queryParams.pipe(pluck('name'));
	length$ = this.activatedRoute.queryParams.pipe(pluck('length'));
	score$ = this.activatedRoute.queryParams.pipe(pluck('score'));
	errorCount$ = this.activatedRoute.queryParams.pipe(pluck('errorCount'));
	initialDeckValidCount$ = this.activatedRoute.queryParams.pipe(pluck('initialDeckValidCount'));
	validCount$ = this.activatedRoute.queryParams.pipe(pluck('validCount'));
	missCount$ = combineLatest([this.initialDeckValidCount$, this.validCount$]).pipe(map(([a, b]) => +a - +b));
	constructor(private activatedRoute: ActivatedRoute) {}
}
