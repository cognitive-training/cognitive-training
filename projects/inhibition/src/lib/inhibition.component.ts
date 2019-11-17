import { Component, OnDestroy } from '@angular/core';
import { InhibitionService } from './inhibition.service';
import { combineLatest, merge, timer } from 'rxjs';
import {
	distinctUntilChanged,
	filter,
	finalize,
	map,
	mapTo,
	shareReplay,
	skip,
	startWith,
	switchMap,
	take,
	tap,
	withLatestFrom
} from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { InhibitionScoreService } from './inhibition-score.service';

@Component({
	selector: 'lib-inhibition',
	template: `
		<mat-card>
			<div class="flex flex-auto justify-between items-center">
				<button mat-raised-button color="primary" class="h3" [routerLink]="['..']" queryParamsHandling="preserve">
					Retour
				</button>
				<div class="h3">{{validCount$ | async}}</div>
				<div class="h3">{{errorCount$ | async}}</div>
			</div>
		</mat-card>
		<mat-progress-bar [value]="timeLeft$ | async" mode="determinate"></mat-progress-bar>
		<div
			*ngIf="currentVisual$ | async as visual; else defaultTemplate"
			class="img-container flex justify-center items-center border-box"
			[ngClass]="{
				valid: !visual.target && spaceKeyDown$ | async
			}"
		>
			<img
				[src]="visual.url"
				[alt]="visual.name"
				[ngClass]="{
					error: visual.target && spaceKeyDown$ | async
				}"
			/>
		</div>
		<ng-template #defaultTemplate>
			<div class="img-container flex justify-center items-center border-box">
				<div class="h1 center">
					La cible, pour laquelle tu ne dois pas appuyer sur espace, est :
					<br />
					<br />
					<img src="assets/img/christmas/{{ target$ | async }}" width="200px" alt="" />
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
export class InhibitionComponent implements OnDestroy {
	currentVisual$ = this.inhibitionService.currentVisual$.pipe(
		finalize(() => {
			combineLatest([
				this.inhibitionService.length$,
				this.score$,
				this.validCount$,
				this.errorCount$,
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
				.subscribe();
		}),
		shareReplay(1)
	);

	target$ = this.inhibitionService.target$;

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
		)
	);

	spaceKeyDown$ = merge(
		this.inhibitionService.spaceKeyDown$.pipe(
			skip(1),
			mapTo(true)
		),
		this.inhibitionService.currentVisual$.pipe(mapTo(false))
	).pipe(
		distinctUntilChanged(),
		shareReplay()
	);

	validCount$ = this.spaceKeyDown$.pipe(
		withLatestFrom(this.currentVisual$),
		filter(([spaceKeyDown, visual]) => spaceKeyDown && !visual.target),
		map((_, index) => ++index),
		startWith(0),
		shareReplay(1)
	);

	errorCount$ = this.spaceKeyDown$.pipe(
		withLatestFrom(this.currentVisual$),
		filter(([spaceKeyDown, visual]) => spaceKeyDown && visual.target),
		map((_, index) => ++index),
		startWith(0),
		shareReplay(1)
	);

	score$ = combineLatest([
		this.inhibitionService.length$,
		this.inhibitionService.currentVisual$.pipe(
			filter(v => !v.target),
			map((_, index) => ++index)
		),
		this.validCount$,
		this.errorCount$
	]).pipe(map(([d, v, validCount, errorCount]) => d - (v - validCount) - errorCount));

	constructor(private inhibitionService: InhibitionService, private scoreService: InhibitionScoreService, private router: Router) {}

	ngOnDestroy() {}
}
