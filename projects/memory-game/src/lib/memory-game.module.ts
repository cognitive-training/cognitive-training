import { NgModule } from '@angular/core';
import { MemoryGameComponent } from './memory-game.component';
import { MemoryGameRoutingModule } from './memory-game-routing.module';
import { CommonModule } from '@angular/common';
import { CardModule } from './card/card.module';
import { MemoryGameMenuComponent } from './memory-game-menu.component';
import { MaterialAngularModule } from '../../../material-angular/material-angular.module';
import { MemoryGameWinDialogModule } from './win-dialog/memory-game-win-dialog.module';
import { MemoryGameContainerComponent } from './memory-game-container.component';
import { FormsModule } from '@angular/forms';
import { MemoryGameScoreComponent } from './memory-game-score.component';

@NgModule({
  imports: [CommonModule, MemoryGameRoutingModule, MaterialAngularModule, CardModule, MemoryGameWinDialogModule, FormsModule],
  declarations: [MemoryGameComponent, MemoryGameMenuComponent, MemoryGameContainerComponent, MemoryGameScoreComponent],
  exports: [MemoryGameComponent]
})
export class MemoryGameModule {}
