import { Component } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { filter, toArray } from 'rxjs/operators';
import { routes } from './app-routing.module';

@Component({
	selector: 'app-root',
	template: `
		<mat-toolbar color="accent">
			<mat-toolbar-row class="flex width-fill items-center">
				<button mat-icon-button (click)="toggleSideNav()">
					<mat-icon class="header-icon">menu</mat-icon>
				</button>
				<h1 class="mat-h1 cursor-pointer" routerLink="/">Cognitive Training</h1>
				<div id="sot-header-extra" class="flex flex-auto justify-end"></div>
			</mat-toolbar-row>
		</mat-toolbar>
		<mat-sidenav-container>
			<mat-sidenav
				mode="over"
				role="navigation"
				[opened]="sideNavOpen$ | async"
				(openedStart)="openSideNav()"
				(closedStart)="closeSideNav()"
			>
				<mat-action-list>
					<div class="p2 bold">STIMULATION COGNITIVE</div>
					<div class="p2 bold">Inhibition</div>
					<a
						mat-list-item
						routerLink="inhibition"
						queryParamsHandling="preserve"
						(click)="closeSideNav()"
						routerLinkActive="active-link"
						class="text-decoration-none"
					>
						<div class="flex-auto">
							<div>Go/NoGo</div>
						</div>
						<button mat-icon-button>
							<mat-icon>keyboard_arrow_right</mat-icon>
						</button>
						<mat-divider></mat-divider>
					</a>
					<a
						mat-list-item
						routerLink="stroop"
						queryParamsHandling="preserve"
						[queryParams]="{ mode: 'numbers' }"
						(click)="closeSideNav()"
						routerLinkActive="active-link"
						class="text-decoration-none"
					>
						<div class="flex-auto">
							<div>Chiffres</div>
						</div>
						<button mat-icon-button>
							<mat-icon>keyboard_arrow_right</mat-icon>
						</button>
						<mat-divider></mat-divider>
					</a>
					<a
						mat-list-item
						routerLink="stroop"
						queryParamsHandling="preserve"
						[queryParams]="{ mode: 'animals' }"
						(click)="closeSideNav()"
						routerLinkActive="active-link"
						class="text-decoration-none"
					>
						<div class="flex-auto">
							<div>Animaux</div>
						</div>
						<button mat-icon-button>
							<mat-icon>keyboard_arrow_right</mat-icon>
						</button>
						<mat-divider></mat-divider>
					</a>
					<div class="p2 bold">Mémoire</div>
					<a
						mat-list-item
						routerLink="memory"
						queryParamsHandling="preserve"
						(click)="closeSideNav()"
						routerLinkActive="active-link"
						class="text-decoration-none"
					>
						<div class="flex-auto">
							<div>Jeu des paires</div>
						</div>
						<button mat-icon-button>
							<mat-icon>keyboard_arrow_right</mat-icon>
						</button>
						<mat-divider></mat-divider>
					</a>
					<div class="p2 bold">PATIENTS</div>
					<a
						mat-list-item
						routerLink="patient"
						queryParamsHandling="preserve"
						(click)="closeSideNav()"
						routerLinkActive="active-link"
						class="text-decoration-none"
					>
						<div class="flex-auto">
							<div>Profils</div>
						</div>
						<button mat-icon-button>
							<mat-icon>keyboard_arrow_right</mat-icon>
						</button>
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
