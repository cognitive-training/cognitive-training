import { Component } from '@angular/core';
import { Patient, PatientService } from './patient.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'lib-patient-list',
	template: `
		<div class="p1">
			<h4 class="h3">Ajouter un patient</h4>
			<div>
				<mat-form-field class="mr1">
					<mat-label>Nom du patient</mat-label>
					<input matInput (keyup.enter)="createPatient($event.target.value)" #createInput />
				</mat-form-field>
				<button mat-raised-button color="primary" (click)="createPatient(createInput.value)">Ajouter</button>
			</div>
			<div>
				<h4 class="h3">Liste des patients</h4>
				<table mat-table [dataSource]="list$ | async" class="mat-elevation-z8">
					<!-- Name Column -->
					<ng-container matColumnDef="name">
						<th mat-header-cell *matHeaderCellDef>Name</th>
						<td mat-cell *matCellDef="let patient">{{ patient.name }}</td>
					</ng-container>

					<!-- Action Column -->
					<ng-container matColumnDef="action" stickyEnd>
						<th mat-header-cell *matHeaderCellDef></th>
						<td mat-cell *matCellDef="let patient">
							<mat-menu #appMenu="matMenu">
								<button mat-menu-item (click)="deletePatient(patient)">Supprimer</button>
							</mat-menu>

							<button mat-icon-button [matMenuTriggerFor]="appMenu">
								<mat-icon>more_vert</mat-icon>
							</button>
						</td>
					</ng-container>

					<tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
					<tr mat-row *matRowDef="let row; columns: displayedColumns" [routerLink]="['./details']" [queryParams]="{name: row.name}"></tr>
				</table>
			</div>
		</div>
	`,
	styles: [
		`
			.mat-table {
				width: 100%;
			}
			td.mat-column-action {
				width: 20px;
			}
		`
	]
})
export class PatientListComponent {
	displayedColumns: string[] = ['name', 'action'];
	list$: Observable<Patient[]> = this.patientService.list$;
	constructor(private patientService: PatientService) {}

	createPatient(name) {
		if (name && name.trim() !== '') {
			this.patientService.createPatient(name);
		}
	}
	deletePatient({ name }) {
		this.patientService.deletePatient(name);
	}
}
