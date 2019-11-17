import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { pluck, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class InhibitionScoreService {
	name$ = this.activatedRoute.queryParams.pipe(pluck('name'));

	constructor(private activatedRoute: ActivatedRoute) {}

	register(score) {
		this.name$
			.pipe(
				tap(name => {
					const existing = this.getScore(name) ? JSON.parse(this.getScore(name)) : [];
					localStorage.setItem(name, JSON.stringify([...existing, { ...score, date: Date.now() }]));
				})
			)
			.subscribe()
			.unsubscribe();
	}

	getScore(name) {
		return localStorage.getItem(name);
	}
}
