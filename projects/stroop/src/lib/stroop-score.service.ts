import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { pluck, tap } from 'rxjs/operators';
import { PatientService } from '../../../patient/src/lib/patient.service';

@Injectable({
	providedIn: 'root'
})
export class StroopScoreService {
	name$ = this.activatedRoute.queryParams.pipe(pluck('name'));

	constructor(private activatedRoute: ActivatedRoute, private patientService: PatientService) {}

	register(score) {
		this.name$
			.pipe(
				tap(name => {
					const patient = this.patientService.getPatient(name);
					const s = [...(patient.score || []), ...(patient.inhibitionScore || []), ];
					this.patientService.updatePatient(name, {
						score: undefined,
						stroopScore: [...s, { ...score, date: Date.now() }]
					});
				})
			)
			.subscribe()
			.unsubscribe();
	}
}
