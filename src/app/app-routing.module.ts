import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export interface RouteData {
  labelKey: string;
  labelDescriptionKey: string;
}

export type RoutesWithData = Routes & { data?: RouteData };

export const routes: RoutesWithData = [
  {
    path: '',
    loadChildren: () => import('projects/memory-game/src/lib/memory-game.module').then(m => m.MemoryGameModule),
    data: {
      labelKey: 'Memory Game',
      labelDescriptionKey: 'Memory Game'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
