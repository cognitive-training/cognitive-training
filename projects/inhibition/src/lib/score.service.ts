import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class InhibitionService {


	constructor(private activatedRoute: ActivatedRoute) {}
}
