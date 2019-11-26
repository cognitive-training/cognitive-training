import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { MaterialAngularModule } from '../../../material-angular/material-angular.module';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
	declarations: [HomeComponent],
	imports: [CommonModule, HomeRoutingModule, MaterialAngularModule],
	exports: [HomeComponent],
	bootstrap: [HomeComponent]
})
export class HomeModule {}
