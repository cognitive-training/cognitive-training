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
		<div class="flex" *ngIf="config$ | async as config">
			<div class="col-6 p1">
				<h4 class="h3">Objectif</h4>
				<p class="h3">
					Désigne la bonne image selon les règles qui te sont énoncées.
					<br />
					<br />
					<span class="bold">Astuce</span>: Prends le temps d'analyser chaque situation.
				</p>
				<div class="center"><img src="assets/img/stroop-{{ config.mode }}.png" alt="" class="col-6 mx-auto" /></div>
			</div>
			<div class="col-6 p1">
				<h4 class="h3">Paramètre du jeu</h4>
				<div class="flex flex-column">
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
					<mat-form-field>
						<mat-label>Durée d'exposition (en secondes)</mat-label>
						<mat-select [(value)]="config.duration">
							<mat-option *ngFor="let duration of durationList" [value]="duration">
								{{ duration }}
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
	durationList = range(0, 10);
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

	duration$ = this.activatedRoute.queryParams.pipe(
		pluck('duration'),
		filter(Boolean),

		map(v => +v),
		startWith(this.durationList[0])
	);

	config$ = combineLatest([this.name$, this.length$, this.mode$, this.duration$]).pipe(
		map(([name, length, mode, duration]) => ({
			name,
			length,
			mode,
			duration
		}))
	);

	constructor(private activatedRoute: ActivatedRoute) {}
}
