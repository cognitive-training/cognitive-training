import { NgModule } from '@angular/core';
import { StroopComponent } from './stroop.component';
import { StroopMenuComponent } from './stroop-menu.component';
import { CommonModule } from '@angular/common';
import { MaterialAngularModule } from '../../../material-angular/material-angular.module';
import { StroopRoutingModule } from './stroop-routing.module';
import { StroopScoreComponent } from './stroop-score.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, StroopRoutingModule, MaterialAngularModule, FormsModule],
	declarations: [StroopMenuComponent, StroopComponent, StroopScoreComponent],
	entryComponents: [StroopMenuComponent]
})
export class StroopModule {}
