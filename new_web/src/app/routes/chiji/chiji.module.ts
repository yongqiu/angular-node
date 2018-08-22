import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChijiComponent } from './chiji.component';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxEchartsModule } from 'ngx-echarts';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    NgxEchartsModule,
    RouterModule.forChild([{ path: '', component: ChijiComponent }]),
  ],
  declarations: [ChijiComponent]
})
export class ChijiModule { }
