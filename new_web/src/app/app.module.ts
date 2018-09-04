import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule} from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Routes, RouterModule } from '@angular/router';
import { RequestService } from './services/request.service';
import { TablesService } from './services/tables.service';
import { LayoutComponent } from './routes/layout/layout.component';

registerLocaleData(zh);
export const routes = [
  { path: '', redirectTo: 'weibo-data', pathMatch: 'full' },
  // { path: '**', redirectTo: 'table' },
  // {
  //   path: 'hot-search',
  //   children: [{ path: '', loadChildren: './routes/hot-search/hot-search.module#HotSearchModule' }]
  // },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'table', loadChildren: './routes/tables/tables.module#TablesModule' },
      { path: 'hot-search', loadChildren: './routes/hot-search/hot-search.module#HotSearchModule' },
      { path: 'charts', loadChildren: './routes/charts/charts.module#ChartsModule' },
      // { path: 'qqmusic', loadChildren: './routes/qqmusic/qqmusic.module#QqmusicModule' },
      { path: 'weibo-data', loadChildren: './routes/weibo/weibo.module#WeiboModule' },
    ]
  },
  // {
  //   path: 'settings',
  //   children: [{ path: '', loadChildren: './routes/settings/settings.module#SettingsModule' }]
  // },
  // {
  //   path: 'login',
  //   children: [{ path: '', loadChildren: './routes/login2/login2.module#Login2Module' }]
  // },
  // {
  //   path: 'select',
  //   children: [{ path: '', loadChildren: './routes/select/select.module#SelectModule' }]
  // }
];


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    NgZorroAntdModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [RequestService, TablesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
