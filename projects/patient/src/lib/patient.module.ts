import { NgModule } from '@angular/core';
import { PatientComponent } from './patient.component';
import { PatientRoutingModule } from './patient-routing.module';
import { CommonModule } from '@angular/common';
import { MaterialAngularModule } from '../../../material-angular/material-angular.module';
import { PatientListComponent } from './patient-list.component';
import { GoogleChartsModule } from 'angular-google-charts';

@NgModule({
	declarations: [PatientComponent, PatientListComponent],
	imports: [CommonModule, MaterialAngularModule, PatientRoutingModule, GoogleChartsModule.forRoot()],
	exports: [PatientComponent]
})
export class PatientModule {}
