import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientListComponent } from './patient-list.component';
import { PatientComponent } from './patient.component';

const routes: Routes = [
	{
		path: 'details',
		component: PatientComponent
	},
	{
		path: '',
		component: PatientListComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PatientRoutingModule {}
