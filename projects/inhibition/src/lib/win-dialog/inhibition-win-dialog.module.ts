import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialAngularModule } from '../../../../material-angular/material-angular.module';
import { InhibitionWinDialogComponent } from './inhibition-win-dialog.component';
import { InhibitionRoutingModule } from '../inhibition-routing.module';

@NgModule({
	imports: [CommonModule, MaterialAngularModule, InhibitionRoutingModule],
	declarations: [InhibitionWinDialogComponent],
	entryComponents: [InhibitionWinDialogComponent]
})
export class InhibitionWinDialogModule {}
