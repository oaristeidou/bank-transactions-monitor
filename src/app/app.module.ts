import { NgModule  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UmsaetzeComponent } from './umsaetze/umsaetze.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { NgApexchartsModule } from "ng-apexcharts";
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";




@NgModule({
  declarations: [
    AppComponent,
    UmsaetzeComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatTableModule,
    NgApexchartsModule,
    MatRadioModule,
    MatFormFieldModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
