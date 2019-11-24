import { Component } from '@angular/core';
import { range } from 'lodash';
import { imageList } from '../assets/img/christmas';
import { filter, map, pluck, startWith } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'lib-inhibition-menu',
	template: `
		<mat-card>
			<div class="h1">Inhibition</div>
		</mat-card>
		<mat-divider></mat-divider>
		<div class="flex">
			<div class="col-6 p1">
				<h4 class="h3">Objectif</h4>
				<p class="h3">
					Valide les images qui te sont présentées en appuyant sur la barre espace dans le temps imparti sauf si elles
					correspondent à l'image cible.
					<br />
					<br />
					<span class="bold">Astuce</span>: Prends ton temps pour analyser chaque image.
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
						<mat-label>Durée d'exposition (en secondes)</mat-label>
						<mat-select [(value)]="config.duration">
							<mat-option *ngFor="let duration of durationList" [value]="duration">
								{{ duration }}
							</mat-option>
						</mat-select>
					</mat-form-field>
					<mat-form-field>
						<mat-label>Image cible</mat-label>
						<mat-select [(value)]="config.target">
							<mat-option *ngFor="let image of imageList" [value]="image">
								<div class="flex items-center">
									<img src="assets/img/christmas/{{ image }}" height="20px" class="mr1" /> {{ image }}
								</div>
							</mat-option>
						</mat-select>
					</mat-form-field>
					<mat-form-field>
						<mat-label>Nombre d'occurence de l'image cible (en %)</mat-label>
						<mat-select [(value)]="config.occurence">
							<mat-option *ngFor="let occurence of occurenceList" [value]="occurence"> {{ occurence }}% </mat-option>
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
export class InhibitionMenuComponent {
	lengthList = range(2, 100);
	durationList = range(1, 10);
	occurenceList = range(0, 100);
	imageList = imageList;

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
	duration$ = this.activatedRoute.queryParams.pipe(
		pluck('duration'),
		filter(Boolean),

		map(v => +v),
		startWith(this.durationList[1])
	);
	target$ = this.activatedRoute.queryParams.pipe(
		pluck('target'),
		filter(Boolean),
		startWith(imageList[0])
	);
	occurence$ = this.activatedRoute.queryParams.pipe(
		pluck('occurence'),
		filter(Boolean),
		map(v => +v),
		startWith(this.occurenceList[1])
	);

	config$ = combineLatest([this.name$, this.length$, this.duration$, this.target$, this.occurence$]).pipe(
		map(([name, length, duration, target, occurence]) => ({
			name,
			length,
			duration,
			target,
			occurence
		}))
	);

	constructor(private activatedRoute: ActivatedRoute) {}
}
