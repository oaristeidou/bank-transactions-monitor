import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels, ApexFill,
  ApexLegend,
  ApexTitleSubtitle, ApexTooltip,
  ApexXAxis,
  ApexYAxis
} from "ng-apexcharts";
import {ApexStroke} from "ng-apexcharts/lib/model/apex-types";

export type ChartOptions = {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  markers?: any; //ApexMarkers;
  stroke?: ApexStroke; //ApexStroke;
  yaxis?: ApexYAxis | ApexYAxis[];
  dataLabels?: ApexDataLabels;
  title?: ApexTitleSubtitle;
  legend?: ApexLegend;
  fill?: ApexFill;
  tooltip?: ApexTooltip;



};
