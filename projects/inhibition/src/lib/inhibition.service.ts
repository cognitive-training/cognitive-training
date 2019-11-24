import { Injectable } from '@angular/core';
import { imageList } from '../assets/img/christmas';
import { combineLatest, from, fromEvent, merge, Observable, of, timer } from 'rxjs';
import {
	distinctUntilChanged,
	filter,
	map,
	mapTo,
	pluck,
	shareReplay,
	skip,
	startWith,
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

	filenameToVisual = target => (fileName: string): IVisual => ({
		name: fileName,
		url: `assets/img/christmas/${fileName}`,
		target: fileName === target
	});

	mapFilenameToVisual = target => map(this.filenameToVisual(target));

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
		this.imageListWithoutTarget$
	]).pipe(
		switchMap(([length, target, occurence, imageListWithoutTarget]) =>
			from(new Array(+length).fill(target)).pipe(
				map((image, index) =>
					index < Math.ceil((+occurence / 100) * length) ? image : sample(imageListWithoutTarget)
				),
				this.mapFilenameToVisual(target),
				toArray(),
				map(list => shuffle(list)),
				map(list => {
					const result = [...list];
					for (let i = 1; i < result.length; i++) {
						const prev = result[i - 1];
						if (prev.name === target) continue;
						while (prev.name === result[i].name) {
							result[i] = this.filenameToVisual(target)(sample(imageListWithoutTarget));
						}
					}
					return result;
				})
			)
		),
		shareReplay(1)
	);

	initialDeckValidCount$ = this.initialDeck$.pipe(map(list => list.filter(v => !v.target).length));

	currentVisual$: Observable<IVisual> = this.initialDeck$.pipe(
		withLatestFrom(this.duration$),
		switchMap(([visualList, duration]) =>
			this.spaceKeyDown$
				.pipe(switchMap(() => timer(300, duration)))
				.pipe(map((_, index) => (index < visualList.length ? visualList[index] : null)))
		),
		takeWhile(v => v !== null),
		shareReplay(1)
	);

	inputValue$ = merge(
		this.spaceKeyDown$.pipe(
			skip(1),
			mapTo(true)
		),
		this.currentVisual$.pipe(mapTo(false))
	).pipe(
		distinctUntilChanged(),
		shareReplay(1)
	);

	validCount$ = this.inputValue$.pipe(
		withLatestFrom(this.currentVisual$),
		filter(([spaceKeyDown, visual]) => spaceKeyDown && !visual.target),
		map((_, index) => ++index),
		startWith(0),
		shareReplay(1)
	);

	errorCount$ = this.inputValue$.pipe(
		withLatestFrom(this.currentVisual$),
		filter(([spaceKeyDown, visual]) => spaceKeyDown && visual.target),
		map((_, index) => ++index),
		startWith(0),
		shareReplay(1)
	);

	score$ = combineLatest([this.length$, this.initialDeckValidCount$, this.validCount$, this.errorCount$]).pipe(
		map(([d, v, validCount, errorCount]) => +d - (v - validCount) - errorCount)
	);

	constructor(private activatedRoute: ActivatedRoute) {}
}
