import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeiboComponent } from './weibo.component';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
import { WeiboService } from '../../services/weibo.service';
import { CurrentComponent } from './current/current.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    RouterModule.forChild([
      { path: '', component: WeiboComponent },
      { path: 'current', component: CurrentComponent }
    ]),
  ],
  declarations: [WeiboComponent, CurrentComponent],
  providers: [WeiboService]
})
export class WeiboModule { }
