import { Component, OnDestroy } from '@angular/core';
import { Item, StroopService } from './stroop.service';
import { endWith, filter, finalize, mapTo, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StroopScoreService } from './stroop-score.service';
import { combineLatest, Observable } from 'rxjs';

@Component({
	selector: 'lib-stroop',
	template: `
		<mat-card class="hide">
			<div class="flex flex-auto justify-between items-center">
				<button mat-raised-button color="primary" class="h3" [routerLink]="['/stroop']" queryParamsHandling="preserve">
					Retour
				</button>
				<div class="h3">{{ score$ | async }}</div>
			</div>
		</mat-card>
		<div class="game-container flex justify-center items-center border-box" *ngIf="!(gameOver$ | async)">
			<div *ngIf="currentItem$ | async as item; else defaultTemplate" class="flex justify-around flex-auto items-center">
				<div
					[ngClass]="[
						'number-' + item[0].value,
						'number-scale-' + item[0].size,
						(item[0].gt && success$ | async) ? 'animated fast pulse' : '',
						(item[1].gt && error$ | async) ? 'animated fast shake' : ''
					]"
					class="number"
				>
					<div *ngIf="(mode$ | async) === 'numbers'">{{ item[0].value }}</div>
					<img *ngIf="(mode$ | async) === 'animals'" src="assets/svg/{{ item[0].value }}.svg" alt=""/>
				</div>
				<div
					[ngClass]="[
						'number-' + item[1].value,
						'number-scale-' + item[1].size,
						(item[1].gt && success$ | async) ? 'animated fast pulse' : '',
						(item[0].gt && error$ | async) ? 'animated fast shake' : ''
					]"
					class="number"
				>
					<div *ngIf="(mode$ | async) === 'numbers'">{{ item[1].value }}</div>
					<img *ngIf="(mode$ | async) === 'animals'" src="assets/svg/{{ item[1].value }}.svg" alt=""/>
				</div>
			</div>
		</div>
		<ng-template #defaultTemplate>
			<div class="h1 center intro p2">
				Appuie sur la flèche gauche ou droite correspondant à la position de l'élément le plus grand.
				<br />
				<br />
				Lorsque tu es prêt, appuies sur la touche espace pour commencer !
			</div>
		</ng-template>
	`,
	styleUrls: [`./stroop.component.scss`],
	providers: [StroopService]
})
export class StroopComponent {
	currentItem$: Observable<Item[]> = this.stroopService.currentItem$;
	mode$ = this.stroopService.mode$;
	score$ = this.stroopService.score$;
	error$ = this.stroopService.error$;
	success$ = this.stroopService.success$;
	gameOver$ = this.stroopService.gameOver$.pipe(
		filter(Boolean),
		tap(() => {
			setTimeout(() => {
				combineLatest([this.stroopService.score$, this.stroopService.length$])
					.pipe(
						tap(([score, length]) => {
							this.scoreService.register({
								score,
								length
							});
							this.router.navigate(['/stroop/score'], {
								queryParamsHandling: 'merge',
								queryParams: {
									score,
									length
								}
							});
						}),
						take(1)
					)
					.subscribe();
			});
		}),
		mapTo(false),
		endWith(true)
	);

	constructor(private stroopService: StroopService, private scoreService: StroopScoreService, private router: Router) {}
}
