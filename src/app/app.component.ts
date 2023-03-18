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
export class AppComponent implements OnInit{

  constructor(private appService: AppService) {

  }

  umsaetze: any[] = [];
  chartOptions: Partial<ChartOptions> | any;
  incomeArray = new Map<string, string>();
  outcomeArray = new Map<string, string>();
  balanceArray = new Map<string, string>();
  xaxisCategories = new Map<string, string>();
  title = 'app';
  destroy$: Subject<boolean> = new Subject<boolean>();


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
          this.umsaetze.push(new Umsatz(buchungstag, gegenIban, gegenkonto, verwendungszweck, umsatz))

          // keyMap = buchungstag.substring(0,4)
          keyMap = buchungstag.substring(5,7)+ "-" + buchungstag.substring(0,4)
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
              data: Array.from(this.incomeArray.values())
            },
            {
              name: "Outcome",
              type: "column",
              data: Array.from(this.outcomeArray.values())
            },
            {
              name: "Balance",
              type: "area",
              data: Array.from(this.balanceArray.values())
            }
          ],
          chart: {
            height: 350,
            type: "line",
            stacked: false
          },
          dataLabels: {
            enabled: true,
            formatter: function (val:any) {
              return val + "€"
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
              axisTicks: {
                show: true
              },
              axisBorder: {
                show: true,
                color: "#13d734"
              },
              dataLabels: {
                enabled: true,
                formatter: function (val:any) {
                  return val + "€"
                }
              },
              labels: {
                style: {
                  colors: "#13d734"
                },
                formatter: function (val:any) {
                  return val + "€"
                }
              },
              title: {
                text: "Income",
                style: {
                  color: "#13d734"
                }
              },
              tooltip: {
                enabled: true
              }
            },
            {
              seriesName: "Income",
              opposite: true,
              axisTicks: {
                show: true
              },
              axisBorder: {
                show: true,
                color: "#e80e6a"
              },
              dataLabels: {
                enabled: true,
                formatter: function (val:any) {
                  return val + "€"
                }
              },
              labels: {
                style: {
                  colors: "#e80e6a"
                },
                formatter: function (val:any) {
                  return val + "€"
                }
              },
              title: {
                text: "Operating Cashflow",
                style: {
                  color: "#e80e6a"
                }
              }
            },
            {
              seriesName: "Revenue",
              opposite: true,
              axisTicks: {
                show: true
              },
              axisBorder: {
                show: true,
                color: "#e0145b"
              },
              dataLabels: {
                enabled: true,
                formatter: function (val:any) {
                  return val + "€"
                }
              },
              labels: {
                style: {
                  colors: "#e0145b"
                },
                formatter: function (val:any) {
                  return val + "€"
                }
              },
              title: {
                text: "Revenue (thousand crores)",
                style: {
                  color: "#e0145b"
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
        console.log(this.umsaetze);
        console.log(Array.from(this.incomeArray.values()));
        console.log(Array.from(this.outcomeArray.values()));
        console.log(Array.from(this.balanceArray.values()));
      });
  }

  ngOnInit(): void {
    this.getUmsaetze()
  }



}
