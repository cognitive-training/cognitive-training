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
					Désigne la bonne image selon les règles qui te sont énoncées.
					<br />
					<br />
					<span class="bold">Astuce</span>: Prends le temps d'analyser chaque situation.
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
					<mat-form-field>
						<mat-label>Mode</mat-label>
						<mat-select [(value)]="config.mode">
							<mat-option *ngFor="let mode of modeList" [value]="mode">
								{{ mode }}
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
	modeList = ['numbers', 'animals'];

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

	mode$ = this.activatedRoute.queryParams.pipe(
		pluck('mode'),
		filter(Boolean),
		startWith(this.modeList[0])
	);

	config$ = combineLatest([this.name$, this.length$, this.mode$]).pipe(
		map(([name, length, mode]) => ({
			name,
			length,
			mode
		}))
	);

	constructor(private activatedRoute: ActivatedRoute) {}
}
