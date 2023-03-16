import {Component, Input} from '@angular/core';
import {Umsatz} from "../app-state/models/Umsatz";



@Component({
  selector: 'app-umsaetze',
  templateUrl: './umsaetze.component.html',
  styleUrls: ['./umsaetze.component.css']
})
export class UmsaetzeComponent {

  constructor() {
  }

  @Input() umsaetze: Umsatz[] = [];
  displayedColumns: string[] = ['demo-buchungstag', 'demo-gegenIban', 'demo-gegenkonto', 'demo-verwendungszweck', 'demo-umsatz'];

}
