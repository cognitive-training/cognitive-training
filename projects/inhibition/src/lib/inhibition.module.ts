import { NgModule } from '@angular/core';
import { InhibitionComponent } from './inhibition.component';
import { InhibitionMenuComponent } from './inhibition-menu.component';
import { CommonModule } from '@angular/common';
import { MaterialAngularModule } from '../../../material-angular/material-angular.module';
import { InhibitionRoutingModule } from './inhibition-routing.module';
import { MatRippleModule } from '@angular/material';
import { InhibitionScoreComponent } from './inhibition-score.component';
import { FormsModule } from '@angular/forms';

@NgModule({
	imports: [CommonModule, InhibitionRoutingModule, MaterialAngularModule, MatRippleModule, FormsModule],
	declarations: [InhibitionMenuComponent, InhibitionComponent, InhibitionScoreComponent],
	entryComponents: [InhibitionMenuComponent]
})
export class InhibitionModule {}
