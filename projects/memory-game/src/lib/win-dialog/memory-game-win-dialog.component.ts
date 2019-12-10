import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
	selector: 'lib-memory-game-win-dialog',
	template: `
		<div class="img-container flex justify-center items-center">
			<div class="h1 center" style="margin: auto;">
				<div class="py1">
					<span style="font-size:2rem">⭐</span>
					<span style="font-size:3rem">⭐</span>
					<span style="font-size:2rem">⭐</span>
				</div>
				<h3>Bien joué {{ data.name$ | async }} !</h3>
				<h4>Tu as trouvé les {{ data.difficulty$ | async }} paires</h4>
				<p>en {{ data.score }} coups</p>
				<br />
				<button
					mat-raised-button
					color="primary"
					[routerLink]="['/memory']"
					queryParamsHandling="preserve"
					(click)="onClick()"
				>
					<span class="h2 py1 block">Rejouer</span>
				</button>
			</div>
		</div>
	`
})
export class MemoryGameWinDialogComponent {
	constructor(public dialogRef: MatDialogRef<MemoryGameWinDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

	onClick(): void {
		this.dialogRef.close();
	}
}
