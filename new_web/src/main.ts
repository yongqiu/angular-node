import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  console.log('Welcome to YcY数据站');
  console.log('weibo：onepickycy');
  window.console.log = function () { };
  window.console.info = function () { };
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
