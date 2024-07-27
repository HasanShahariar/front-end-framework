import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetupRoutingModule } from './setup-routing.module';
import { CollegeComponent } from './pages/college/college.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    CollegeComponent
  ],
  imports: [
    CommonModule,
    SetupRoutingModule,
    NgbModule,
  ]
})
export class SetupModule { }
