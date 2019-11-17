import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export interface RouteData {
  labelKey: string;
  labelDescriptionKey: string;
}

export type RoutesWithData = Routes & { data?: RouteData };

export const routes: RoutesWithData = [
  {
    path: 'memory',
    loadChildren: () => import('projects/memory-game/src/lib/memory-game.module').then(m => m.MemoryGameModule),
    data: {
      labelKey: 'Paires',
      labelDescriptionKey: 'Memory'
    }
  },
  {
    path: 'inhibition',
    loadChildren: () => import('projects/inhibition/src/lib/inhibition.module').then(m => m.InhibitionModule),
    data: {
      labelKey: 'Inhibition',
      labelDescriptionKey: 'Inhibition'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
