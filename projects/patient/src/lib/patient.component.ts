import { Component } from '@angular/core';
import { Patient, PatientService } from './patient.service';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

@Component({
	selector: 'lib-patient',
	template: `
		<mat-card>
			<div class="flex flex-auto justify-between items-center">
				<button mat-raised-button color="primary" class="h3" [routerLink]="['..']">
					Retour
				</button>
			</div>
		</mat-card>
		<div class="p1">
			<h4 class="h2">{{ name$ | async }}</h4>
			<div>
				<h4 class="h3">Score</h4>
				<h4 class="h4">Inhibition</h4>
				<google-chart
					*ngIf="data$ | async as data"
					title="Score en fonction de la longueur de la série"
					type="ScatterChart"
					[data]="data"
					[firstRowIsData]="true"
					[dynamicResize]="true"
					[options]="dataOptions$ | async"
				></google-chart>
				<google-chart
					*ngIf="data2$ | async as data2"
					title="Progression du score avec les répétitions"
					type="LineChart"
					[data]="data2"
					[firstRowIsData]="true"
					[dynamicResize]="true"
					[options]="data2Options$ | async"
				></google-chart>
			</div>
		</div>
	`,
	styles: [
		`
			google-chart {
				width: 100%;
			}
		`
	]
})
export class PatientComponent {
	name$: Observable<Patient> = this.patientService.name$;

	patient$ = this.patientService.name$.pipe(map(name => this.patientService.getPatient(name)));

	data$ = this.patient$.pipe(
		filter(patient => !!patient.inhibitionScore),
		map(patient => patient.score.map(s => [+s.length, (s.score / +s.length) * 100]))
	);

	data2$ = this.patient$.pipe(
		filter(patient => !!patient.inhibitionScore),
		map(patient => patient.score.map((s, i) => [+i, (s.score / +s.length) * 100])),
	);

	dataOptions$ = this.data$.pipe(
		map(data => ({
			animation: {
				duration: 1000,
				easing: 'out'
			},
			legend: 'none',
			hAxis: { title: 'longueur', minValue: 0, maxValue: 50 },
			vAxis: { title: 'score', minValue: 0, maxValue: 100 }
		}))
	);

	data2Options$ = this.data2$.pipe(
		map(data => ({
			animation: {
				duration: 1000,
				easing: 'out'
			},
			legend: 'none',
			curveType: 'function',
			hAxis: { title: 'répétition', minValue: 0, maxValue: data.length - 1 },
			vAxis: { title: 'score', minValue: 0, maxValue: 100 }
		}))
	);

	constructor(private patientService: PatientService) {}
}
