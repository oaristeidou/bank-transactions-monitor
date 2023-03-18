import {Component, Input, NgZone, ViewChild} from '@angular/core';
import {Umsatz} from "../app-state/models/Umsatz";
import {ChartOptions} from "../app-state/models/ChartOptions";
import {ChartComponent} from "ng-apexcharts";

@Component({
  selector: 'app-umsaetze',
  templateUrl: './umsaetze.component.html',
  styleUrls: ['./umsaetze.component.css']
})
export class UmsaetzeComponent {

  constructor() {
  }
  @Input() chartOptions: Partial<ChartOptions> | any;

  @Input() umsaetze: Umsatz[] | any;
  displayedColumns: string[] = ['demo-buchungstag', 'demo-gegenIban', 'demo-gegenkonto', 'demo-verwendungszweck', 'demo-umsatz'];

}
