import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'lib-inhibition-win-dialog',
	template: `
		<h2 mat-dialog-title>Bien joué !</h2>
		<mat-dialog-content class="mat-typography">
			<h3>Tu as terminé la séquence !</h3>
			<p>Ton score est de {{ data.score$ | async }} / {{ data.length$ | async }}.</p>
			<br />
			<br />
			<p>Tu as commis {{ data.errorCount$ | async }} erreur(s) pour la cible.</p>
			<p>Tu as manqué {{ (data.initialDeckValidCount$ | async) - (data.validCount$ | async) }} image(s) valide(s).</p>
		</mat-dialog-content>
		<mat-dialog-actions align="end">
			<button mat-raised-button mat-dialog-close>Ok</button>
			<button mat-raised-button mat-dialog-close [routerLink]="['/inhibition']" queryParamsHandling="preserve">
				Rejouer
			</button>
		</mat-dialog-actions>
	`
})
export class InhibitionWinDialogComponent {
	constructor(@Inject(MAT_DIALOG_DATA) public data) {}
}
