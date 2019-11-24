import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StroopMenuComponent } from '../../../stroop/src/lib/stroop-menu.component';
import { StroopComponent } from '../../../stroop/src/lib/stroop.component';
import { StroopScoreComponent } from '../../../stroop/src/lib/stroop-score.component';

const routes: Routes = [
	{
		path: '',
		component: StroopMenuComponent
	},
	{
		path: 'game',
		component: StroopComponent
	},
	{
		path: 'score',
		component: StroopScoreComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class StroopRoutingModule {}
