import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export interface RouteData {
	labelKey: string;
	labelDescriptionKey: string;
}

export type RoutesWithData = Routes & { data?: RouteData };

export const routes: RoutesWithData = [
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{
		path: 'memory',
		loadChildren: () => import('projects/memory-game/src/lib/memory-game.module').then(m => m.MemoryGameModule),
		data: {
			labelKey: 'Paires',
			labelDescriptionKey: 'Memory'
		}
	},
	{
		path: 'inhibition',
		loadChildren: () => import('projects/inhibition/src/lib/inhibition.module').then(m => m.InhibitionModule),
		data: {
			labelKey: 'Inhibition',
			labelDescriptionKey: 'Inhibition'
		}
	},
	{
		path: 'stroop',
		loadChildren: () => import('projects/stroop/src/lib/stroop.module').then(m => m.StroopModule),
		data: {
			labelKey: 'Stroop',
			labelDescriptionKey: 'Stroop'
		}
	},
	{
		path: 'patient',
		loadChildren: () => import('projects/patient/src/lib/patient.module').then(m => m.PatientModule),
		data: {
			labelKey: 'Patients',
			labelDescriptionKey: 'Patients'
		}
	},
	{
		path: 'home',
		loadChildren: () => import('projects/home/src/lib/home.module').then(m => m.HomeModule)
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
