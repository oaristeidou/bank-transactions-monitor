import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'any'
})
export class AppService {

  constructor(private http: HttpClient) { }

  rootURL = '/api';

  getUmsaetze(){
    return this.http.get(this.rootURL + '/umsaetze');
  }



}
