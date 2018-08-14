import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotSearchComponent } from './hot-search.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    RouterModule.forChild([{ path: '', component: HotSearchComponent }]),
  ],
  declarations: [HotSearchComponent]
})
export class HotSearchModule { }
