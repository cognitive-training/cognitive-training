import { Injectable } from '@angular/core';
import { imageList } from '../assets/img/christmas';
import { BehaviorSubject, combineLatest, from, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  pluck,
  scan,
  shareReplay,
  startWith,
  switchMap,
  take,
  tap,
  toArray,
  withLatestFrom
} from 'rxjs/operators';
import { shuffle } from 'lodash';
import { ActivatedRoute } from '@angular/router';

export interface ICard {
  id?: number;
  flipped: boolean;
  resolved: boolean;
  name: string;
  url?: string;
}

@Injectable()
export class MemoryGameService {
  difficulty$ = this.activatedRoute.queryParams.pipe(
    pluck('difficulty'),
    distinctUntilChanged()
  );

  initialDeck$: Observable<ICard[]> = this.difficulty$.pipe(
    tap(console.log),
    switchMap(difficulty =>
      from(shuffle(imageList)).pipe(
        take(difficulty),
        toArray()
      )
    ),
    map((result: string[]) => [...result, ...result]),
    map(result => shuffle(result)),
    switchMap(result =>
      from(result).pipe(
        map(
          (fileName: string, index): ICard => ({
            id: index,
            flipped: false,
            resolved: false,
            name: fileName,
            url: `assets/img/christmas/${fileName}`
          })
        ),
        toArray()
      )
    ),
    shareReplay(1)
  );

  selectedCards$ = new BehaviorSubject<ICard[]>([]);

  nbTries$: Observable<number> = this.selectedCards$.pipe(
    filter(v => v.length === 2),
    mapTo(1),
    scan(a => ++a, 0),
    startWith(0)
  );

  selectedPair$ = this.selectedCards$.pipe(filter(cards => cards.length > 1));

  resolvedPairList$: Observable<string[]> = this.selectedPair$.pipe(
    filter(pair => pair[0].name === pair[1].name),
    map(p => p[0].name),
    scan((a, c: string) => [...a, c], []),
    startWith([])
  );

  cards$: Observable<ICard[]> = combineLatest([this.initialDeck$, this.selectedCards$, this.resolvedPairList$]).pipe(
    switchMap(([initialDeck, selectedCards, resolvedPairList]) =>
      from(initialDeck).pipe(
        map(card => ({
          ...card,
          flipped: !!selectedCards.find(c => c.id === card.id),
          resolved: !!resolvedPairList.includes(card.name)
        })),
        toArray()
      )
    )
  );

  win$ = combineLatest([this.resolvedPairList$, this.difficulty$]).pipe(
    tap(console.log),
    map(([resolvedPairList, difficulty]) => resolvedPairList.length === +difficulty),
    filter(Boolean),
    withLatestFrom(this.nbTries$)
  );

  selectCard(card: ICard) {
    const currentValue = this.selectedCards$.getValue();
    this.selectedCards$.next(currentValue.length === 1 ? [...currentValue, card] : [card]);
  }

  constructor(private activatedRoute: ActivatedRoute) {}
}
