import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetupRoutingModule } from './setup-routing.module';
import { NgbModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';

import { CrudModule } from '../crud/crud.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BrowserModule } from '@angular/platform-browser';

import { SharedModule } from 'src/app/shared/shared.module';
import { CollegeComponent } from './pages/college/college.component';


@NgModule({
  declarations: [
    CollegeComponent,
  ],
  imports: [
    CommonModule,
    SetupRoutingModule,
    NgbModule,
    SharedModule,
    CrudModule,
    SweetAlert2Module.forChild(),
    // NgbPagination
  ]
})
export class SetupModule { }
