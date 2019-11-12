import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemoryGameWinDialogComponent } from './memory-game-win-dialog.component';
import { MaterialAngularModule } from '../../../../material-angular/material-angular.module';
import { MemoryGameRoutingModule } from '../memory-game-routing.module';

@NgModule({
  imports: [CommonModule, MaterialAngularModule, MemoryGameRoutingModule],
  declarations: [MemoryGameWinDialogComponent],
  entryComponents: [MemoryGameWinDialogComponent]
})
export class MemoryGameWinDialogModule {}
