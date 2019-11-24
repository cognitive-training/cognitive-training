import { Component } from '@angular/core';
import { range } from 'lodash';
import { filter, map, pluck, startWith } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'lib-stroop-menu',
	template: `
		<mat-card>
			<div class="h1">Stroop</div>
		</mat-card>
		<mat-divider></mat-divider>
		<div class="flex">
			<div class="col-6 p1">
				<h4 class="h3">Objectif</h4>
				<p class="h3">
					Blah
					<br />
					<br />
					<span class="bold">Astuce</span>: Blah.
				</p>
			</div>
			<div class="col-6 p1">
				<h4 class="h3">Paramètre du jeu</h4>
				<div class="flex flex-column" *ngIf="config$ | async as config">
					<mat-form-field>
						<mat-label>Nom du participant</mat-label>
						<input matInput [(ngModel)]="config.name" />
					</mat-form-field>
					<mat-form-field>
						<mat-label>Longueur de la série</mat-label>
						<mat-select [(value)]="config.length">
							<mat-option *ngFor="let length of lengthList" [value]="length">
								{{ length }}
							</mat-option>
						</mat-select>
					</mat-form-field>
					<div>
						<button mat-raised-button color="primary" class="h2" [routerLink]="['./game']" [queryParams]="config">
							Jouer
						</button>
					</div>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			:host {
				font-size: 20px;
			}
		`
	]
})
export class StroopMenuComponent {
	lengthList = range(2, 100);

	name$ = this.activatedRoute.queryParams.pipe(
		pluck('name'),
		filter(Boolean),
		startWith('Amandine')
	);
	length$ = this.activatedRoute.queryParams.pipe(
		pluck('length'),
		filter(Boolean),
		map(v => +v),
		startWith(this.lengthList[1])
	);

	config$ = combineLatest([this.name$, this.length$]).pipe(
		map(([name, length]) => ({
			name,
			length
		}))
	);

	constructor(private activatedRoute: ActivatedRoute) {}
}
