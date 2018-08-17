import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, URLSearchParams, RequestOptions, ResponseContentType } from '@angular/http';
import { HttpClient } from "@angular/common/http";
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/toPromise';
import { HttpParams } from '@angular/common/http';
// import { create } from 'domain';
import { HttpHeaders } from '@angular/common/http';
import { HttpEventType } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';


@Injectable()
export class RequestService {

  private token: string;
  public http: Http;
  public httpClient: HttpClient;
  public errorCodeMap: Map<string, string>;
  public TenantId: any;

  constructor(private injector: Injector, private router: Router) {
    // super(injector);
    this.http = injector.get(Http);
    this.httpClient = injector.get(HttpClient);
    this.errorCodeMap = new Map();
  }

  // getPers(): number[] {
  //   const perString = localStorage.getItem('pers');
  //   return JSON.parse(perString) as number[];
  // }

  // setPers(pids: number[]) {
  //   localStorage.setItem('pers', JSON.stringify(pids));
  // }{"TenantId": this.TenantId}

  public isQuerySuccess(res): boolean {
    return (res && res.code && (1 === res.code));
  }

  public query(url: string, method: string, param: any): Promise<any> {
    return this.queryServer({ url: url, method: method }, param);
  }

  public queryServer(query: { url: string, method: string }, param: any, headers = {}): Promise<any> {
    switch (query.method) {
      case 'post': {
        const headerOptions = new RequestOptions({ headers: this.createHeaders(headers) });
        return this.http.post(query.url, param, headerOptions).toPromise()
          .then(this.checkResponeCode.bind(this)).catch(this.handleError);
      }
      case 'post-form-data': {
        const headerOptions = new RequestOptions({ headers: this.createHeaders2() });
        return this.http.post(query.url, param, headerOptions).toPromise()
          .then(this.checkResponeCode.bind(this)).catch(this.handleError);
      }
      case 'get-blob': {
        const form = this.createRequstParam(param);
        return this.http.get(query.url, { search: form, headers: this.createHeaders(headers), responseType: ResponseContentType.Blob }).toPromise();
      }
      case 'get':
      default: {
        const form = this.createRequstParam(param);
        return this.http.get(query.url, { search: form, headers: this.createHeaders(headers) }).toPromise()
          .then(this.checkResponeCode.bind(this)).catch(this.handleError);
      }
      case 'put': {
        const headerOptions = new RequestOptions({ headers: this.createHeaders(headers) });
        return this.http.put(query.url, param, headerOptions).toPromise()
          .then(this.checkResponeCode.bind(this)).catch(this.handleError);
      }
      case 'delete': {
        const form = this.createRequstParam(param);
        return this.http.delete(query.url, { search: form, headers: this.createHeaders(headers), responseType: ResponseContentType.Blob }).toPromise();
      }
    }
  }

  // 头文件
  private createHeaders2() {
    const headers = new Headers();
    headers.append('TenantId', this.TenantId);
    return headers;
  }

  private createRequstParam(data: { any }): any {
    const params = new URLSearchParams();
    for (const key in data) {
      params.set(key, data[key]);
    }
    return params;
  }

  private createHeaders(headerObj) {
    const headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    for (const key in headerObj) {
      headers.append(key, headerObj[key]);
    }
    return headers;
  }

  private checkResponeCode(res: Response) {
    const serverResponse = res.json();
    if (serverResponse.code == 1000) {
      // this.router.navigate(["login"]);
    }
    return serverResponse;
  }

  private handleError(error: Response | any): boolean {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    // Observable.throw(errMsg);
    return false;
  }

  public request(url: string, param: any, reportProgress: boolean = false) {
    let headers = new HttpHeaders().append('Content-Type', 'application/x-www-form-urlencoded');
    let httpRequest = new HttpRequest('post', url, { headers: headers, body: param, reportProgress: reportProgress });
    return this.httpClient.request(httpRequest).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        const percentDone = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
      }
    });
  }


  private creatParam4(data: { any }): any {
    let params = new HttpParams();
    for (const key in data) {
      params = params.set(key, data[key]);
    }

    return params;
  }

  private checkCode4(res: any) {
    if (res.code == 1000) {
    }
    return res;
  }

}
