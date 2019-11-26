import { Component } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { filter, toArray } from 'rxjs/operators';
import { routes } from './app-routing.module';

@Component({
	selector: 'app-root',
	template: `
		<mat-toolbar color="primary">
			<mat-toolbar-row class="flex width-fill items-center">
				<button mat-icon-button (click)="toggleSideNav()">
					<mat-icon class="header-icon">menu</mat-icon>
				</button>
				<h1 class="mat-h1 cursor-pointer" routerLink="/">Entraînement cognitif 💪🧠🕹️</h1>
				<div id="sot-header-extra" class="flex flex-auto justify-end"></div>
			</mat-toolbar-row>
		</mat-toolbar>
		<mat-sidenav-container>
			<mat-sidenav
				mode="side"
				role="navigation"
				[opened]="sideNavOpen$ | async"
				(openedStart)="openSideNav()"
				(closedStart)="closeSideNav()"
			>
				<mat-action-list>
					<a
						mat-list-item
						*ngFor="let navView of navItemList$ | async; let last = last"
						[routerLink]="navView.path"
						queryParamsHandling="preserve"
						(click)="closeSideNav()"
						routerLinkActive="active-link"
						class="text-decoration-none"
					>
						<div class="flex-auto">
							<div>{{ navView.data.labelKey }}</div>
						</div>
						<button mat-icon-button>
							<mat-icon>keyboard_arrow_right</mat-icon>
						</button>
						<mat-divider inset *ngIf="!last"></mat-divider>
					</a>
				</mat-action-list>
			</mat-sidenav>
			<mat-sidenav-content>
				<router-outlet></router-outlet>
			</mat-sidenav-content>
		</mat-sidenav-container>
	`,
	styles: [
		`
			.mat-sidenav-container {
				height: calc(100% - 56px);
			}

			.mat-toolbar {
				height: 56px !important;
				min-height: 56px !important;
			}
		`
	]
})
export class AppComponent {
	sideNavOpen$ = new BehaviorSubject<boolean>(false);

	navItemList$ = from(routes).pipe(
		filter(route => !!route.data),
		toArray()
	);

	openSideNav() {
		this.sideNavOpen$.next(true);
	}

	closeSideNav() {
		this.sideNavOpen$.next(false);
	}

	toggleSideNav() {
		this.sideNavOpen$.next(!this.sideNavOpen$.getValue());
	}
}
