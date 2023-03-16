import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {AppService} from "./app.service";
import {Umsatz} from "./app-state/models/Umsatz";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private appService: AppService) {}

  umsaetze: any[] = [];
  title = 'app';
  destroy$: Subject<boolean> = new Subject<boolean>();


  getUmsaetze() {
    this.appService.getUmsaetze()
      .subscribe(response => {
        for(let key in response){

          let responseElement = response as Umsatz[];
          let index = Number.parseInt(key as string);
          let buchungstag = responseElement[index].buchungstag;
          let gegenIban = responseElement[index].gegenIban;
          let gegenkonto = responseElement[index].gegenkonto;
          let verwendungszweck = responseElement[index].verwendungszweck;
          let umsatz = responseElement[index].umsatz;
          this.umsaetze.push(new Umsatz(buchungstag, gegenIban, gegenkonto, verwendungszweck, umsatz))

        }
        console.log(this.umsaetze);
      });
  }

  ngOnInit(): void {
    this.getUmsaetze()
  }



}
