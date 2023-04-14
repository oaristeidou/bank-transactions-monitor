import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Umsatz} from "../app-state/models/Umsatz";
import {ChartOptions} from "../app-state/models/ChartOptions";
import {AppService} from "../app.service";
import moment = require('moment');
import {Category} from "../app-state/models/Category";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";



@Component({
  selector: 'app-umsaetze',
  templateUrl: './umsaetze.component.html',
  styleUrls: ['./umsaetze.component.css']
})
export class UmsaetzeComponent implements OnInit, AfterViewInit{

  constructor(private appService: AppService) {
  }

  chartOptions: Partial<ChartOptions> | any;
  chartOptionsPie: Partial<ChartOptions> | any;
  chartOptionsIncomePie: Partial<ChartOptions> | any;

  isIncomeOutcomeBalanceDiagrammOn: boolean = true;
  isOutcomeDiagrammOn: boolean = false;
  isIncomeDiagrammOn: boolean = false;

  umsaetze: Umsatz[] | any ;
  displayedColumns: string[] = ['demo-buchungstag', 'demo-gegenIban', 'demo-gegenkonto', 'demo-verwendungszweck', 'demo-kategory', 'demo-umsatz'];
  incomeArray = new Map<string, string>();
  outcomeArray = new Map<string, string>();
  balanceArray = new Map<string, string>();
  outcomeDataCategoryArray : Category[] | any = [];
  incomeDataCategoryArray : Category[] | any = [];
  outcomeCategoryList = new Set<string>;
  incomeCategoryList = new Set<string>;
  selectedtimeSector = "monthly";

  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  getUmsaetze() {
    this.appService.getUmsaetze()
      .subscribe(response => {
        this.umsaetze = [];
        this.incomeArray = new Map<string, string>();
        this.outcomeArray = new Map<string, string>();
        this.balanceArray = new Map<string, string>();
        this.outcomeDataCategoryArray = [];
        this.incomeDataCategoryArray = [];
        this.outcomeCategoryList = new Set<string>;
        this.incomeCategoryList = new Set<string>;
        let indexID = 0;

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
          this.umsaetze.push(new Umsatz(new Date(buchungstag), gegenIban, gegenkonto, verwendungszweck, kategory, umsatz, indexID++))

          // timeSector = buchungstag.substring(0,4)
          timeSector = "";
          if (this.selectedtimeSector == "monthly") {
            timeSector = buchungstag.toString().substring(5, 7) + "-" + buchungstag.toString().substring(0, 4)
            keyMapPie = buchungstag.toString().substring(5, 7) + "-" + buchungstag.toString().substring(0, 4) + "-" + kategory;
          } else if (this.selectedtimeSector == "quarterly"){
            let month = buchungstag.toString().substring(5, 7);
            let temp = "";
            if (month == "01" || month == "02" || month == "03" ){
              temp = "Q1 ";
            } else if (month == "04" || month == "05" || month == "06" ){
              temp = "Q2 ";
            } else if (month == "07" || month == "08" || month == "09" ){
              temp = "Q3 ";
            } else if (month == "10" || month == "11" || month == "12" ){
              temp = "Q4 ";
            }
            timeSector = temp + buchungstag.toString().substring(0, 4)
            keyMapPie = temp + buchungstag.toString().substring(0, 4) + "-" + kategory;
          } else if (this.selectedtimeSector == "half-yearly"){
            let month = buchungstag.toString().substring(5, 7);
            let temp = "";
            if (month == "01" || month == "02" || month == "03" || month == "04" || month == "05" || month == "06"){
              temp = "01-06 ";
            } else if (month == "07" || month == "08" || month == "09" || month == "10" || month == "11" || month == "12"){
              temp = "07-12 ";
            }
            timeSector = temp + buchungstag.toString().substring(0, 4)
            keyMapPie = temp + buchungstag.toString().substring(0, 4) + "-" + kategory;
          } else if (this.selectedtimeSector == "yearly"){
            timeSector = buchungstag.toString().substring(0, 4)
            keyMapPie = buchungstag.toString().substring(0, 4) + "-" + kategory;
          } else {
            timeSector = buchungstag.toString().substring(5, 7) + "-" + buchungstag.toString().substring(0, 4)
            keyMapPie = buchungstag.toString().substring(5, 7) + "-" + buchungstag.toString().substring(0, 4) + "-" + kategory;
          }

          if (this.balanceArray.has(timeSector)) {
            if (Number.parseFloat(umsatz) > 0) {
              this.incomeArray.set(timeSector, (Number.parseFloat(umsatz.replaceAll(".", "")) + Number.parseFloat(this.incomeArray.get(timeSector)!.toString())).toFixed(2));
              this.incomeCategoryList.add(kategory);
            } else {
              this.outcomeArray.set(timeSector, (Number.parseFloat(umsatz.replaceAll(".", "")) + Number.parseFloat(this.outcomeArray.get(timeSector)!.toString())).toFixed(2));
              this.outcomeCategoryList.add(kategory);
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

        this.sortUmseatzeArray();

        this.setDataByCategory();

        this.setCharOptionsForPie();
        this.setCharOptionsForIncomePie();

        this.umsaetze = new MatTableDataSource<Umsatz>(this.umsaetze);
        this.umsaetze.paginator = this.paginator;

        console.log(this.umsaetze);
        console.log("incomeArray: " + Array.from(this.incomeArray.values()));
        console.log("incomeCategoryList:" + Array.from(this.incomeCategoryList.values()));
        console.log("incomeDataCategoryArray:" + Array.from(this.incomeDataCategoryArray.values()));
        console.log("outcomeArray: " + Array.from(this.outcomeArray.values()));
        console.log("balanceArray" + Array.from(this.balanceArray.values()));
        console.log("outcomeCategoryList" + Array.from(this.outcomeCategoryList));
        console.log("outcomeDataCategoryArray" + Array.from(this.outcomeDataCategoryArray));
      });
  }

  private sortUmseatzeArray() {
    this.umsaetze.sort((a: { buchungstag: number; }, b: { buchungstag: number; }) => {
      return b.buchungstag - a.buchungstag;
    });
  }

  private setDataByCategory() {
    this.outcomeCategoryList.forEach(kategoryName => {
      let categoryValuesByTimeSector: string[] = [];
      let totalSum = "0";
      Array.from(this.balanceArray.keys()).forEach(value => {
        totalSum = "0";
        this.umsaetze.forEach((element: Umsatz) => {
          let timeSector = "";
          const buchungstag = (moment(element.buchungstag)).format("yyyy-MM-DD");
          if (this.selectedtimeSector == "monthly") {
            timeSector = buchungstag.substring(5, 7) + "-" + buchungstag.toString().substring(0, 4)
          } else if (this.selectedtimeSector == "quarterly"){
            let month = buchungstag.substring(5, 7);
            let temp = "";
            if (month == "01" || month == "02" || month == "03" ){
              temp = "Q1 ";
            } else if (month == "04" || month == "05" || month == "06" ){
              temp = "Q2 ";
            } else if (month == "07" || month == "08" || month == "09" ){
              temp = "Q3 ";
            } else if (month == "10" || month == "11" || month == "12" ){
              temp = "Q4 ";
            }
            timeSector = temp + buchungstag.toString().substring(0, 4);
          } else if (this.selectedtimeSector == "half-yearly"){
            let month = buchungstag.substring(5, 7);
            let temp = "";
            if (month == "01" || month == "02" || month == "03" || month == "04" || month == "05" || month == "06"){
              temp = "01-06 ";
            } else if (month == "07" || month == "08" || month == "09" || month == "10" || month == "11" || month == "12"){
              temp = "07-12 ";
            }
            timeSector = temp + buchungstag.toString().substring(0, 4);
          } else if (this.selectedtimeSector == "yearly"){
            timeSector = buchungstag.substring(0, 4)
          } else {
            timeSector = buchungstag.substring(5, 7) + "-" + buchungstag.toString().substring(0, 4)
          }
          if (kategoryName == element.kategory && timeSector == value && Number.parseFloat(element.umsatz.replaceAll(".", "")) < 0) {
            totalSum = (Number.parseFloat(totalSum) + Number.parseFloat(element.umsatz.replaceAll(".", ""))).toFixed(2);
          }
        })
        categoryValuesByTimeSector.push(totalSum);
      })
      this.outcomeDataCategoryArray.push(new Category(kategoryName, categoryValuesByTimeSector.reverse()))
    })
    this.incomeCategoryList.forEach(kategoryName => {
      let categoryValuesByTimeSector: string[] = [];
      let totalSum = "0";
      Array.from(this.balanceArray.keys()).forEach(value => {
        this.umsaetze.forEach((element: Umsatz) => {
          let timeSector = "";
          const buchungstag = (moment(element.buchungstag)).format("yyyy-MM-DD");
          if (this.selectedtimeSector == "monthly") {
            timeSector = buchungstag.substring(5, 7) + "-" + buchungstag.toString().substring(0, 4)
          } else if (this.selectedtimeSector == "quarterly"){
            let month = buchungstag.substring(5, 7);
            let temp = "";
            if (month == "01" || month == "02" || month == "03" ){
              temp = "Q1 ";
            } else if (month == "04" || month == "05" || month == "06" ){
              temp = "Q2 ";
            } else if (month == "07" || month == "08" || month == "09" ){
              temp = "Q3 ";
            } else if (month == "10" || month == "11" || month == "12" ){
              temp = "Q4 ";
            }
            timeSector = temp + buchungstag.toString().substring(0, 4);
          } else if (this.selectedtimeSector == "half-yearly"){
            let month = buchungstag.substring(5, 7);
            let temp = "";
            if (month == "01" || month == "02" || month == "03" || month == "04" || month == "05" || month == "06"){
              temp = "01-06 ";
            } else if (month == "07" || month == "08" || month == "09" || month == "10" || month == "11" || month == "12"){
              temp = "07-12 ";
            }
            timeSector = temp + buchungstag.toString().substring(0, 4);
          } else if (this.selectedtimeSector == "yearly"){
            timeSector = buchungstag.substring(0, 4)
          } else {
            timeSector = buchungstag.substring(5, 7) + "-" + buchungstag.toString().substring(0, 4)
          }
          if (kategoryName == element.kategory && timeSector == value && Number.parseFloat(element.umsatz.replaceAll(".", "")) > 0) {
            totalSum = (Number.parseFloat(totalSum) + Number.parseFloat(element.umsatz.replaceAll(".", ""))).toFixed(2);
          }
        })
        categoryValuesByTimeSector.push(totalSum);
        totalSum = "0";
      })
      this.incomeDataCategoryArray.push(new Category(kategoryName, categoryValuesByTimeSector.reverse()))
    })
  }

  private setCharOptionsForPie() {
    this.chartOptionsPie = {
      series: this.outcomeDataCategoryArray,
      chart: {
        type: "bar",
        height: 1170,
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
  private setCharOptionsForIncomePie() {
    this.chartOptionsIncomePie = {
      series: this.incomeDataCategoryArray,
      chart: {
        type: "bar",
        height: 1170,
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
        height: 1170,
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
    this.getUmsaetze();
  }

  ngAfterViewInit() {
    this.umsaetze.paginator = this.paginator;
  }

}
