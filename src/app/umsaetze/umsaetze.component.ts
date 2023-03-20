import {Component, OnInit} from '@angular/core';
import {Umsatz} from "../app-state/models/Umsatz";
import {ChartOptions} from "../app-state/models/ChartOptions";
import {AppService} from "../app.service";
import moment = require('moment');
import {Category} from "../app-state/models/Category";


@Component({
  selector: 'app-umsaetze',
  templateUrl: './umsaetze.component.html',
  styleUrls: ['./umsaetze.component.css']
})
export class UmsaetzeComponent implements OnInit{

  constructor(private appService: AppService) {
  }

  chartOptions: Partial<ChartOptions> | any;
  chartOptionsPie: Partial<ChartOptions> | any;

  isIncomeOutcomeBalanceDiagrammOn: boolean = true;
  isOutcomeDiagrammOn: boolean = false;

  umsaetze: Umsatz[] | any = [];
  displayedColumns: string[] = ['demo-buchungstag', 'demo-gegenIban', 'demo-gegenkonto', 'demo-verwendungszweck', 'demo-kategory', 'demo-umsatz'];
  incomeArray = new Map<string, string>();
  outcomeArray = new Map<string, string>();
  balanceArray = new Map<string, string>();
  kategoryArray : Category[] | any = [];
  kategoryList = new Set<string>;


  getUmsaetze() {
    this.appService.getUmsaetze()
      .subscribe(response => {
        for(let key in response){

          let timeSector = "";
          let keyMapPie = "";
          let responseElement = response as Umsatz[];
          let index = Number.parseInt(key as string);
          let buchungstag = responseElement[index].buchungstag;
          let gegenIban = responseElement[index].gegenIban;
          let gegenkonto = responseElement[index].gegenkonto;
          let verwendungszweck = responseElement[index].verwendungszweck;
          let kategory = responseElement[index].kategory;
          let umsatz = responseElement[index].umsatz;
          this.umsaetze.push(new Umsatz(new Date(buchungstag), gegenIban, gegenkonto, verwendungszweck, kategory, umsatz))

          // timeSector = buchungstag.substring(0,4)
          timeSector = buchungstag.toString().substring(5, 7) + "-" + buchungstag.toString().substring(0, 4)
          keyMapPie = buchungstag.toString().substring(5, 7) + "-" + buchungstag.toString().substring(0, 4) + "-" + kategory;

          if (this.balanceArray.has(timeSector)) {
            if (Number.parseFloat(umsatz) > 0) {
              this.incomeArray.set(timeSector, (Number.parseFloat(umsatz.replaceAll(".", "")) + Number.parseFloat(this.incomeArray.get(timeSector)!.toString())).toFixed(2));
            } else {
              this.outcomeArray.set(timeSector, (Number.parseFloat(umsatz.replaceAll(".", "")) + Number.parseFloat(this.outcomeArray.get(timeSector)!.toString())).toFixed(2));
              this.kategoryList.add(kategory);
            }
            this.balanceArray.set(timeSector, (Number.parseFloat(umsatz.replaceAll(".", "")) + Number.parseFloat(this.balanceArray.get(timeSector)!.toString())).toFixed(2));

          } else {
            this.incomeArray.set(timeSector, "0");
            this.outcomeArray.set(timeSector, "0");
            this.balanceArray.set(timeSector, "0");
            if (Number.parseFloat(umsatz) > 0) {
              this.incomeArray.set(timeSector, Number.parseFloat(umsatz.replaceAll(".", "")).toFixed(2));
            } else {
              this.outcomeArray.set(timeSector, Number.parseFloat(umsatz.replaceAll(".", "")).toFixed(2));
            }
            this.balanceArray.set(timeSector, Number.parseFloat(umsatz.replaceAll(".", "")).toFixed(2));
          }


        }
        this.setCharOptionsForMultibar();

        this.umsaetze.sort((a: { buchungstag: number; }, b: { buchungstag: number; }) => {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return b.buchungstag - a.buchungstag;
        });

        this.kategoryList.forEach(kategoryName => {
          let categoryValuesByTimeSector: string[] = [];
          let totalSum = "0";
          Array.from(this.balanceArray.keys()).forEach(value => {
            totalSum = "0";
            this.umsaetze.forEach((element: Umsatz) => {
              const timeSector = (moment(element.buchungstag)).format("MM-yyyy");
              if(kategoryName == element.kategory && timeSector == value && Number.parseFloat(element.umsatz.replaceAll(".", "")) < 0){
                totalSum = (Number.parseFloat(totalSum) + Number.parseFloat(element.umsatz.replaceAll(".", ""))).toFixed(2);
              }
            })
            categoryValuesByTimeSector.push(totalSum);
          })
          this.kategoryArray.push(new Category(kategoryName, categoryValuesByTimeSector.reverse()))
        })

        this.setCharOptionsForPie();

        console.log(this.umsaetze);
        console.log(Array.from(this.incomeArray.values()));
        console.log(Array.from(this.outcomeArray.values()));
        console.log(Array.from(this.balanceArray.values()));
        console.log(Array.from(this.kategoryList));
        console.log(Array.from(this.kategoryArray));
      });
  }

  private setCharOptionsForPie() {
    this.chartOptionsPie = {
      series: this.kategoryArray,
      chart: {
        type: "bar",
        height: 950,
        stacked: true,
        stackType: "100%"
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      xaxis: {
        categories: Array.from(this.balanceArray.keys()).reverse()
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: "right",
        offsetX: 0,
        offsetY: 50
      }
    };
  }
  private setCharOptionsForMultibar() {
    this.chartOptions = {
      series: [
        {
          name: "Income",
          type: "column",
          data: Array.from(this.incomeArray.values()).reverse(),
          color: '#0ce138'
        },
        {
          name: "Outcome",
          type: "column",
          data: Array.from(this.outcomeArray.values()).reverse(),
          color: '#e0145b'
        },
        {
          name: "Balance",
          type: "area",
          data: Array.from(this.balanceArray.values()).reverse(),
          color: '#1449e0'
        }
      ],
      chart: {
        height: 950,
        type: "line",
        stacked: false
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any) {
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
        categories: Array.from(this.balanceArray.keys()).reverse()
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
            formatter: function (val: any) {
              return val + "€"
            }
          },
          labels: {
            style: {
              colors: '#2E93fA'
            },
            formatter: function (val: any) {
              return val + " €"
            }
          },
          title: {
            text: "in Euro",
            style: {
              color: '#adada8'
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
  }

  ngOnInit(){
    this.getUmsaetze();
    this.isIncomeOutcomeBalanceDiagrammOn = true;
    this.isOutcomeDiagrammOn = false;
  }

  onValChange(value: any){
    if(value == "1"){
      this.isIncomeOutcomeBalanceDiagrammOn = true;
      this.isOutcomeDiagrammOn = false;
    } else {
      this.isIncomeOutcomeBalanceDiagrammOn = false;
      this.isOutcomeDiagrammOn = true;
    }

  }

}
