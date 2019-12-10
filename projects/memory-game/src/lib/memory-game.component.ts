import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ICard, MemoryGameService } from './memory-game.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, pluck } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { MemoryGameWinDialogComponent } from './win-dialog/memory-game-win-dialog.component';

const difficultyToCols = {
	1: 2,
	2: 2,
	3: 3,
	4: 3,
	5: 4,
	6: 4,
	7: 4,
	8: 4,
	9: 5,
	10: 5
};

@Component({
	selector: 'lib-memory-game',
	template: `
		<mat-card>
			<div class="flex flex-auto justify-between items-center">
				<div class="h3"><label class="xs-hide">Coups: </label>{{ nbTries$ | async }}</div>
				<div class="h3" *ngIf="resolvedPairList$ | async as resolvedPairList">
					<label class="xs-hide">Paires trouvées: </label>{{ resolvedPairList.length }} / {{ difficulty$ | async }}
				</div>
				<button mat-raised-button color="primary" class="h3" [routerLink]="['..']">Retour</button>
			</div>
		</mat-card>
		<div class="height-fill flex items-center border-box">
			<div class="grid-container border-box mx-auto" [ngStyle]="gridStyle$ | async">
				<div *ngFor="let card of cards$ | async; trackBy: trackByCards" class="flex items-center justify-center">
					<app-card [card]="card" (flipped)="flipCard($event)"></app-card>
				</div>
			</div>
		</div>
	`,
	providers: [MemoryGameService],
	styles: [
		`
			:host {
				height: calc(100% - 68px);
				display: block;
			}
			.grid-container {
				display: grid;
			}
		`
	]
})
export class MemoryGameComponent implements OnInit {
	cards$ = this.memoryGame.cards$;
	resolvedPairList$ = this.memoryGame.resolvedPairList$;
	nbTries$ = this.memoryGame.nbTries$;
	difficulty$ = this.memoryGame.difficulty$;

	isXs$ = this.breakpointObserver.observe([Breakpoints.XSmall]).pipe(
		pluck('matches'),
		distinctUntilChanged()
	);

	resizeSubject$ = new BehaviorSubject(0);

	gridStyle$ = combineLatest([this.isXs$, this.difficulty$, this.resizeSubject$]).pipe(
		map(([isXs, difficulty, size]) => {
			let nbCols = difficultyToCols[difficulty] || 7;
			if (size <= 250) {
				nbCols = Math.min(nbCols, 3);
			} else if (size <= 400) {
				nbCols = Math.min(nbCols, 4);
			}
			let nbRows = Math.ceil((difficulty * 2) / nbCols);

			let height = nbCols === nbRows ? size : size * (nbRows / nbCols);

			if (nbCols > nbRows && isXs) {
				[nbCols, nbRows, size, height] = [nbRows, nbCols, height * 1.2, size * 1.2];
			}

			return {
				'grid-template': `repeat(${nbRows}, minmax(0, 1fr)) / repeat(${nbCols}, minmax(0, 1fr))`,
				width: `${size}px`,
				height: `${height}px`
			};
		})
	);

	constructor(
		private memoryGame: MemoryGameService,
		public dialog: MatDialog,
		private elRef: ElementRef,
		private breakpointObserver: BreakpointObserver
	) {}

	trackByCards(index: number, card: ICard) {
		return card.id;
	}

	flipCard(card: ICard) {
		this.memoryGame.selectCard(card);
	}

	ngOnInit(): void {
		this.memoryGame.win$.subscribe(([, nbTries]) => {
			this.dialog.open(MemoryGameWinDialogComponent, {
				data: { difficulty$: this.memoryGame.difficulty$, nbTries }
			});
		});
		this.onResize({ target: { innerWidth: this.elRef.nativeElement.clientWidth } });
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		const v = event.target.innerWidth >= 600 ? event.target.innerWidth / 1.1 : event.target.innerWidth;
		this.resizeSubject$.next(Math.min(v, 800));
	}
}
