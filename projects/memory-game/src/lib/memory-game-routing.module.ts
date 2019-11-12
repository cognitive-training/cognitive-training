import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemoryGameMenuComponent } from './memory-game-menu.component';
import { MemoryGameContainerComponent } from './memory-game-container.component';

const routes: Routes = [
  {
    path: '',
    component: MemoryGameMenuComponent
  },
  {
    path: 'game',
    component: MemoryGameContainerComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemoryGameRoutingModule {}
