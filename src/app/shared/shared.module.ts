import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { CrudModule } from '../modules/crud/crud.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectionInterceptor } from './services/change-ditection-interceptor';
import { ClickOutsideDirective } from './services/click.outside.directive';
import { KeeniconComponent } from './components/keenicon/keenicon.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ClickOutsideDirective,
    KeeniconComponent,
    // ChangeDetectionInterceptor
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    CrudModule,
    NgSelectModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule
    
  ],
  exports:[
    CrudModule,
    NgSelectModule,
    NgbModule,
    ClickOutsideDirective,
    KeeniconComponent,
    ReactiveFormsModule,
    FormsModule
    // ChangeDetectionInterceptor
  ]
})
export class SharedModule { }
