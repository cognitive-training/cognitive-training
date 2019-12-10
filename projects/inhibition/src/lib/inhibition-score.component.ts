import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, pluck } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@Component({
	selector: 'lib-inhibition-score',
	template: `
		<div class="img-container flex justify-center items-center border-box height-fill">
			<div class="h1 center p3 mat-elevation-z10" style="margin: auto;">
				<div class="py1">
					<span style="font-size:2rem">⭐</span>
					<span style="font-size:3rem">⭐</span>
					<span style="font-size:2rem">⭐</span>
				</div>
				<h3>Bien joué {{ name$ | async }} !</h3>
				<h4>Tu as terminé la séquence</h4>
				<p>avec un score de {{ score$ | async }}/{{ length$ | async }}</p>
				<br />
				<p class="h3" *ngIf="(errorCount$ | async) > 0">
					Tu as commis {{ errorCount$ | async }} erreur<span *ngIf="(errorCount$ | async) > 1">s</span> pour la cible
				</p>
				<p class="h3" *ngIf="(missCount$ | async) > 0">
					Tu as manqué {{ missCount$ | async }} image<span *ngIf="(missCount$ | async) > 1">s</span>
				</p>
				<br />
				<button mat-raised-button color="primary" [routerLink]="['/inhibition/game']" queryParamsHandling="preserve">
					<span class="h2 py1 block">Rejouer</span>
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
