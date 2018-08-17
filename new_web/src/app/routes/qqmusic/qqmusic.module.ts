import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QqmusicComponent } from './qqmusic.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    NgxEchartsModule,
    RouterModule.forChild([{ path: '', component: QqmusicComponent }]),
  ],
  declarations: [QqmusicComponent]
})
export class QqmusicModule { }
