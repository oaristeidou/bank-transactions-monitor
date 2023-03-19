import {Component, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import {Umsatz} from "../app-state/models/Umsatz";
import {ChartOptions} from "../app-state/models/ChartOptions";
import {ChartComponent} from "ng-apexcharts";
import {AppService} from "../app.service";

@Component({
  selector: 'app-umsaetze',
  templateUrl: './umsaetze.component.html',
  styleUrls: ['./umsaetze.component.css']
})
export class UmsaetzeComponent implements OnInit{

  constructor(private appService: AppService) {
  }

  chartOptions: Partial<ChartOptions> | any;

  umsaetze: Umsatz[] | any = [];
  displayedColumns: string[] = ['demo-buchungstag', 'demo-gegenIban', 'demo-gegenkonto', 'demo-verwendungszweck', 'demo-umsatz'];
  incomeArray = new Map<string, string>();
  outcomeArray = new Map<string, string>();
  balanceArray = new Map<string, string>();


  getUmsaetze() {
    this.appService.getUmsaetze()
      .subscribe(response => {
        for(let key in response){

          let keyMap = "";
          let responseElement = response as Umsatz[];
          let index = Number.parseInt(key as string);
          let buchungstag = responseElement[index].buchungstag;
          let gegenIban = responseElement[index].gegenIban;
          let gegenkonto = responseElement[index].gegenkonto;
          let verwendungszweck = responseElement[index].verwendungszweck;
          let umsatz = responseElement[index].umsatz;
          this.umsaetze.push(new Umsatz(new Date(buchungstag), gegenIban, gegenkonto, verwendungszweck, umsatz))

          // keyMap = buchungstag.substring(0,4)
          keyMap = buchungstag.toString().substring(5,7)+ "-" + buchungstag.toString().substring(0,4)
          if (this.balanceArray.has(keyMap)){
            if (Number.parseFloat(umsatz) > 0){
              this.incomeArray.set(keyMap, (Number.parseFloat(umsatz.replaceAll(".", ""))  + Number.parseFloat(this.incomeArray.get(keyMap)!.toString())).toFixed(2));
            } else {
              this.outcomeArray.set(keyMap, (Number.parseFloat(umsatz.replaceAll(".", ""))  + Number.parseFloat(this.outcomeArray.get(keyMap)!.toString())).toFixed(2));
            }
            this.balanceArray.set(keyMap, (Number.parseFloat(umsatz.replaceAll(".", ""))  + Number.parseFloat(this.balanceArray.get(keyMap)!.toString())).toFixed(2));

          } else {
            this.incomeArray.set(keyMap, "0");
            this.outcomeArray.set(keyMap, "0");
            this.balanceArray.set(keyMap, "0");
            if (Number.parseFloat(umsatz) > 0){
              this.incomeArray.set(keyMap, Number.parseFloat(umsatz.replaceAll(".", "")).toFixed(2));
            } else {
              this.outcomeArray.set(keyMap, Number.parseFloat(umsatz.replaceAll(".", "")).toFixed(2));
            }
            this.balanceArray.set(keyMap, Number.parseFloat(umsatz.replaceAll(".", "")).toFixed(2));
          }
        }
        this.chartOptions = {
          series: [
            {
              name: "Income",
              type: "column",
              data: Array.from(this.incomeArray.values()),
              color: '#0ce138'
            },
            {
              name: "Outcome",
              type: "column",
              data: Array.from(this.outcomeArray.values()),
              color: '#e0145b'
            },
            {
              name: "Balance",
              type: "area",
              data: Array.from(this.balanceArray.values()),
              color: '#1449e0'
            }
          ],
          chart: {
            height: 550,
            type: "line",
            stacked: false
          },
          dataLabels: {
            enabled: true,
            formatter: function (val:any) {
              return val + " €"
            },
            offsetY: -6,
            style: {
              fontSize: "12px"
            }
          },
          stroke: {
            width: [1, 1, 5]
          },
          title: {
            text: "",
            align: "left",
            offsetX: 110
          },
          xaxis: {
            categories: Array.from(this.balanceArray.keys())
          },
          yaxis: [
            {
              seriesName: "Income",
              opposite: false,
              axisTicks: {
                show: true
              },
              axisBorder: {
                show: true,
                color: '#2E93fA'
              },
              dataLabels: {
                enabled: true,
                formatter: function (val:any) {
                  return val + "€"
                }
              },
              labels: {
                style: {
                  colors: '#2E93fA'
                },
                formatter: function (val:any) {
                  return val + " €"
                }
              },
              title: {
                text: "in Euro",
                style: {
                  color: '#2E93fA'
                }
              }
            }
          ],
          tooltip: {
            fixed: {
              enabled: true,
              position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
              offsetY: 30,
              offsetX: 60
            }
          },
          legend: {
            horizontalAlign: "left",
            offsetX: 40
          }
        };
        this.umsaetze.sort((a: { buchungstag: number; }, b: { buchungstag: number; }) => {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return b.buchungstag - a.buchungstag;
        });
        console.log(this.umsaetze);
        console.log(Array.from(this.incomeArray.values()));
        console.log(Array.from(this.outcomeArray.values()));
        console.log(Array.from(this.balanceArray.values()));
      });
  }

  ngOnInit(){
    this.getUmsaetze();
  }


}
