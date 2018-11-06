import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JdComponent } from './jd.component';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    NgxEchartsModule,
    RouterModule.forChild([{ path: '', component: JdComponent }]),
  ],
  declarations: [JdComponent]
})
export class JdModule { }
