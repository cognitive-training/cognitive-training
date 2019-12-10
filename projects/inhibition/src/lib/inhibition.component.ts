import { Component, OnDestroy, OnInit } from '@angular/core';
import { InhibitionService } from './inhibition.service';
import { combineLatest, timer } from 'rxjs';
import { filter, map, shareReplay, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';
import { InhibitionScoreService } from './inhibition-score.service';

@Component({
	selector: 'lib-inhibition',
	template: `
		<mat-card class="hide">
			<div class="flex flex-auto justify-between items-center">
				<button
					mat-raised-button
					color="primary"
					class="h3"
					[routerLink]="['/inhibition']"
					queryParamsHandling="preserve"
				>
					Retour
				</button>
				<div class="h3 hide">{{ validCount$ | async }}</div>
				<div class="h3 hide">{{ errorCount$ | async }}</div>
				<div class="h3 hide">{{ gameOver$ | async }}</div>
			</div>
		</mat-card>
		<mat-progress-bar [value]="timeLeft$ | async" mode="determinate"></mat-progress-bar>
		<div
			*ngIf="currentVisual$ | async as visual; else defaultTemplate"
			class="img-container flex justify-center items-center border-box"
			[ngClass]="{
				valid: (!visual.target && inputValue$ | async) || (visual.target && (timeLeft$ | async) < 30)
			}"
		>
			<img
				[src]="visual.url"
				[alt]="visual.name"
				[ngClass]="{
					error: visual.target && inputValue$ | async
				}"
			/>
		</div>
		<ng-template #defaultTemplate>
			<div class="img-container flex justify-center items-center border-box">
				<div class="h1 center mat-elevation-z10 col-6 p2" style="background: white">
					La cible, pour laquelle tu ne dois pas appuyer sur espace, est :
					<br />
					<br />
					<img src="assets/img/theme/christmas/{{ target$ | async }}" width="200px" alt="" />
					<br />
					<br />
					Lorsque tu es prêt, appuies sur la touche espace pour commencer !
				</div>
			</div>
		</ng-template>
	`,
	styleUrls: [`./inhibition.component.scss`],
	providers: [InhibitionService]
})
export class InhibitionComponent {
	currentVisual$ = this.inhibitionService.currentVisual$;
	target$ = this.inhibitionService.target$;
	validCount$ = this.inhibitionService.validCount$;
	errorCount$ = this.inhibitionService.errorCount$;
	inputValue$ = this.inhibitionService.inputValue$;

	timeLeft$ = this.inhibitionService.currentVisual$.pipe(
		withLatestFrom(this.inhibitionService.duration$),
		map(([, duration]) => ({
			duration,
			refreshRate: Math.max(15, duration / Math.pow(2, duration / 1000) / 10)
		})),
		switchMap(({ duration, refreshRate }) =>
			timer(0, refreshRate).pipe(
				take(duration / refreshRate),
				map(v => Math.ceil(100 - (v / (duration / refreshRate - 1)) * 100))
			)
		),
		shareReplay(1)
	);

	gameOver$ = this.inhibitionService.gameOver$.pipe(
		filter(Boolean),
		tap(() => {
			combineLatest([
				this.inhibitionService.length$,
				this.inhibitionService.score$,
				this.inhibitionService.validCount$,
				this.inhibitionService.errorCount$,
				this.inhibitionService.initialDeckValidCount$
			])
				.pipe(
					tap(([length, score, validCount, errorCount, initialDeckValidCount]) => {
						this.scoreService.register({
							length,
							score,
							validCount,
							errorCount,
							initialDeckValidCount
						});
						this.router.navigate(['/inhibition/score'], {
							queryParamsHandling: 'merge',
							queryParams: {
								length,
								score,
								validCount,
								errorCount,
								initialDeckValidCount
							}
						});
					}),
					take(1)
				)
				.subscribe()
				.unsubscribe();
		})
	);

	constructor(
		private inhibitionService: InhibitionService,
		private scoreService: InhibitionScoreService,
		private router: Router
	) {}
}
