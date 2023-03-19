import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {AppService} from "./app.service";
import {Umsatz} from "./app-state/models/Umsatz";
import {ChartOptions} from "./app-state/models/ChartOptions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{

  constructor(private appService: AppService) {

  }

  title = 'app';





}
