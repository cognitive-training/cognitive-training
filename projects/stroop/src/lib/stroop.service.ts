import { Injectable } from '@angular/core';
import { fromEvent, merge, Observable } from 'rxjs';
import {
	delay,
	distinctUntilChanged,
	filter,
	first,
	map,
	mapTo,
	pluck,
	shareReplay,
	startWith,
	switchMap,
	takeWhile,
	throttleTime,
	withLatestFrom
} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { range, sample } from 'lodash';

export interface Item {
	value: number;
	size: number;
	gt: false;
}

const values = range(1, 10);
const sizes = [1, 2];

const getItem = () => ({
	value: sample(values),
	size: sample(sizes)
});

const isEqualItem = (a: Item, b: Item) => a.value === b.value && a.size === b.size;
const isEqualItems = (a: Item[], b: Item[]) => [0, 1].every(i => isEqualItem(a[i], b[i]));

const isValidItem = (item, previous) =>
	item &&
	item.length === 2 &&
	item[0].value !== item[1].value &&
	item[0].size !== item[1].size &&
	(!previous || !isEqualItems(previous, item));
const firstGt = (item: Item[]) => item[0].value > item[1].value;
const firstLt = (item: Item[]) => item[0].value < item[1].value;

@Injectable({
	providedIn: 'root'
})
export class StroopService {
	spaceKeyDown$ = fromEvent(window, 'keydown').pipe(
		filter((event: KeyboardEvent) => event.keyCode === 32),
		filter(event => !event.repeat)
	);
	leftKeyDown$ = fromEvent(window, 'keydown').pipe(
		filter((event: KeyboardEvent) => event.keyCode === 37),
		filter(event => !event.repeat)
	);
	rightKeyDown$ = fromEvent(window, 'keydown').pipe(
		filter((event: KeyboardEvent) => event.keyCode === 39),
		filter(event => !event.repeat)
	);

	length$ = this.activatedRoute.queryParams.pipe(
		pluck('length'),
		map(v => +v),
		distinctUntilChanged()
	);
	mode$ = this.activatedRoute.queryParams.pipe(
		pluck('mode'),
		distinctUntilChanged()
	);

	serie$ = this.length$.pipe(
		map(length => {
			const result = [];
			for (let i = 0; i < length; i++) {
				let item;
				while (!isValidItem(item, result[i - 1])) {
					item = [getItem(), getItem()];
					item[0].gt = firstGt(item);
					item[1].gt = !item[0].gt;
				}
				result.push(item);
			}
			return result;
		})
	);

	currentItem$: Observable<Item[]> = this.serie$.pipe(
		switchMap(itemList =>
			merge(this.spaceKeyDown$.pipe(first()), this.validChoice$).pipe(
				delay(500),
				map((_, index) => (index < itemList.length ? itemList[index] : null))
			)
		),
		shareReplay(1)
	);

	choice$ = merge(this.leftKeyDown$.pipe(mapTo(firstGt)), this.rightKeyDown$.pipe(mapTo(firstLt))).pipe(shareReplay(1));

	validChoice$ = this.choice$.pipe(
		withLatestFrom(this.currentItem$),
		filter(item => item !== null),
		map(([choice, item]) => choice(item)),
		shareReplay(1)
	);

	score$ = this.validChoice$.pipe(
		filter(Boolean),
		map((_, i) => i + 1),
		startWith(0),
		shareReplay(1)
	);

	error$ = merge(this.currentItem$.pipe(mapTo(false)), this.validChoice$.pipe(map(v => !v))).pipe(shareReplay(1));

	success$ = merge(this.currentItem$.pipe(mapTo(false)), this.validChoice$).pipe(shareReplay(1));

	gameOver$ = this.currentItem$.pipe(takeWhile(v => v !== null));

	constructor(private activatedRoute: ActivatedRoute) {}
}
