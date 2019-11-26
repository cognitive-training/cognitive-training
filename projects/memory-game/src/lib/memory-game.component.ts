import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ICard, MemoryGameService } from './memory-game.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { combineLatest } from 'rxjs';
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
					<label class="xs-hide">Paires trouvées: </label>{{ resolvedPairList.length }} /
					{{ difficulty$ | async }}
				</div>
				<button mat-raised-button color="primary" class="h3" [routerLink]="['..']">Retour</button>
			</div>
		</mat-card>
		<div class="game-container p1 justify-center">
			<div class="grid-container" [ngStyle]="gridStyle$ | async">
				<div *ngFor="let card of cards$ | async; trackBy: trackByCards" class="grid-item">
					<app-card [card]="card" (flipped)="flipCard($event)"></app-card>
				</div>
			</div>
		</div>
	`,
	providers: [MemoryGameService],
	styles: [
		`
			:host {
				height: 100%;
				display: block;
			}
			.grid-item {
				height: 100%;
				width: 100%;
			}
			.game-container {
				height: 100%;
				display: flex;
				align-items: center;
				box-sizing: border-box;
			}
			.grid-container {
				display: grid;
				justify-content: center;
				margin: 0 auto;
			}
		`
	]
})
export class MemoryGameComponent implements OnInit, OnDestroy {
	cards$ = this.memoryGame.cards$;
	resolvedPairList$ = this.memoryGame.resolvedPairList$;
	nbTries$ = this.memoryGame.nbTries$;
	difficulty$ = this.memoryGame.difficulty$;

	isXs$ = this.breakpointObserver.observe([Breakpoints.XSmall]).pipe(
		pluck('matches'),
		distinctUntilChanged()
	);

	gridStyle$ = combineLatest([this.isXs$, this.difficulty$]).pipe(
		map(([isXs, difficulty]) => {
			const nbCols = difficultyToCols[difficulty] || 7;
			// let nbRows = Math.ceil((difficulty * 2) / nbCols);
			// if (isXs) {
			// 	nbCols = Math.ceil(nbCols / 2);
			// }
			return { 'grid-template': `repeat(${nbCols}, minmax(0, 1fr)) / repeat(${nbCols}, minmax(0, 1fr))` };
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

	ngOnDestroy(): void {}

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
		const w = Math.min(event.target.innerWidth / 1.2, 800);
		this.elRef.nativeElement.querySelector('.grid-container').style.width = `${w}px`;
		this.elRef.nativeElement.querySelector('.grid-container').style.height = `${w}px`;
	}
}
