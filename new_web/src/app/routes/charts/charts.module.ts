import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsComponent } from './charts.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    NgxEchartsModule,
    RouterModule.forChild([{ path: '', component: ChartsComponent }])
  ],
  declarations: [ChartsComponent]
})
export class ChartsModule { }
