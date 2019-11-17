import { Injectable } from '@angular/core';
import { imageList } from '../assets/img/christmas';
import { combineLatest, from, fromEvent, Observable, of } from 'rxjs';
import {
	concatMap,
	delay,
	distinctUntilChanged,
	endWith,
	filter,
	first,
	map,
	pluck,
	shareReplay,
	switchMap,
	takeWhile,
	toArray,
	withLatestFrom
} from 'rxjs/operators';
import { sample, shuffle } from 'lodash';
import { ActivatedRoute } from '@angular/router';

export interface IVisual {
	name: string;
	url?: string;
	target: boolean;
}

@Injectable({
	providedIn: 'root'
})
export class InhibitionService {
	spaceKeyDown$ = fromEvent(window, 'keydown').pipe(filter((event: KeyboardEvent) => event.keyCode === 32));

	length$ = this.activatedRoute.queryParams.pipe(
		pluck('length'),
		distinctUntilChanged()
	);
	target$ = this.activatedRoute.queryParams.pipe(
		pluck('target'),
		distinctUntilChanged()
	);
	occurence$ = this.activatedRoute.queryParams.pipe(
		pluck('occurence'),
		distinctUntilChanged()
	);
	duration$ = this.activatedRoute.queryParams.pipe(
		pluck('duration'),
		map(duration => +duration * 1000),
		distinctUntilChanged()
	);

	mapFilenameToVisual = target =>
		map(
			(fileName: string): IVisual => ({
				name: fileName,
				url: `assets/img/christmas/${fileName}`,
				target: fileName === target
			})
		);

	imageList$ = of(imageList);

	imageListWithoutTarget$ = combineLatest([this.imageList$, this.target$]).pipe(
		switchMap(([list, target]) =>
			from(list).pipe(
				filter(image => image !== target),
				toArray()
			)
		)
	);

	initialDeck$: Observable<IVisual[]> = combineLatest([
		this.length$,
		this.target$,
		this.occurence$,
		this.imageListWithoutTarget$,
		this.spaceKeyDown$.pipe(first())
	]).pipe(
		switchMap(([length, target, occurence, imageListWithoutTarget]) =>
			from(new Array(+length).fill(target)).pipe(
				map((image, index) =>
					index < Math.ceil((+occurence / 100) * length) ? image : sample(imageListWithoutTarget)
				),
				this.mapFilenameToVisual(target),
				toArray(),
				map(list => shuffle(list))
			)
		),
		shareReplay(1)
	);

	initialDeckValidCount$ = this.initialDeck$.pipe(map(list => list.filter(v => !v.target).length));

	currentVisual$: Observable<IVisual> = this.initialDeck$.pipe(
		withLatestFrom(this.duration$),
		switchMap(([visualList, duration]) =>
			from(visualList).pipe(
				endWith(null),
				concatMap((visual, index) => (index > 0 ? of(visual).pipe(delay(duration)) : of(visual)))
			)
		),
		takeWhile(v => v !== null),
		shareReplay()
	);

	constructor(private activatedRoute: ActivatedRoute) {}
}
