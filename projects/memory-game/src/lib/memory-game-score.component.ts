import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';

@Component({
	selector: 'lib-memory-game-score',
	template: `
		<div class="img-container flex justify-center items-center border-box height-fill">
			<div class="h1 center p3 mat-elevation-z10" style="margin: auto;">
				<div class="py1">
					<span style="font-size:2rem">⭐</span>
					<span style="font-size:3rem">⭐</span>
					<span style="font-size:2rem">⭐</span>
				</div>
				<h3>Bien joué {{ name$ | async }} !</h3>
				<h4>Tu as trouvé les {{ difficulty$ | async }} paires</h4>
				<p>en {{ score$ | async }} coups</p>
				<br />
				<button mat-raised-button color="primary" [routerLink]="['/memory/game']" queryParamsHandling="preserve">
					<span class="h2 py1 block">Rejouer</span>
				</button>
			</div>
		</div>
	`
})
export class MemoryGameScoreComponent {
	name$ = this.activatedRoute.queryParams.pipe(pluck('name'));
	difficulty$ = this.activatedRoute.queryParams.pipe(pluck('difficulty'));
	score$ = this.activatedRoute.queryParams.pipe(pluck('score'));

	constructor(private activatedRoute: ActivatedRoute) {}
}
