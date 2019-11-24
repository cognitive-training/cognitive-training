import { Injectable } from '@angular/core';
import { pluck } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export interface Patient {
	name: string;
	score: any[];
	inhibitionScore: any[];
}

@Injectable({
	providedIn: 'root'
})
export class PatientService {
	name$ = this.activatedRoute.queryParams.pipe(pluck('name'));

	list$ = new BehaviorSubject<Patient[]>(this.getPatientList());

	constructor(private activatedRoute: ActivatedRoute) {}

	createPatient(name): void {
		localStorage.setItem(name, JSON.stringify({}));
		this.list$.next(this.getPatientList());
	}

	updatePatient(name, value): void {
		const existing = this.getPatient(name);
		localStorage.setItem(name, JSON.stringify({ ...existing, ...value }));
		this.list$.next(this.getPatientList());
	}

	deletePatient(name): void {
		localStorage.removeItem(name);
		this.list$.next(this.getPatientList());
	}

	getPatient(name): Patient {
		const existing = localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name)) : {};
		return { name, ...existing };
	}

	getPatientList(): Patient[] {
		return Object.keys(localStorage).map(key => this.getPatient(key));
	}

	// register() {
	// 	this.name$
	// 		.pipe(
	// 			tap(name => {
	// 				const existing = this.getScore(name) ? JSON.parse(this.getScore(name)) : [];
	// 				localStorage.setItem(name, JSON.stringify([...existing, { ...score, date: Date.now() }]));
	// 			})
	// 		)
	// 		.subscribe()
	// 		.unsubscribe();
	// }
}
