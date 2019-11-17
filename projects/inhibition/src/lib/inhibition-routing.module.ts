import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InhibitionMenuComponent } from './inhibition-menu.component';
import { InhibitionComponent } from './inhibition.component';
import { InhibitionScoreComponent } from './inhibition-score.component';

const routes: Routes = [
	{
		path: '',
		component: InhibitionMenuComponent
	},
	{
		path: 'game',
		component: InhibitionComponent
	},
	{
		path: 'score',
		component: InhibitionScoreComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class InhibitionRoutingModule {}
