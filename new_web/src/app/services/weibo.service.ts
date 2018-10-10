import { Injectable } from '@angular/core';
import { RequestService } from './request.service';

@Injectable()
export class WeiboService {
  currentDate: string = '';
  constructor(private requestService: RequestService) {

  }
  async getWeiboAllUserDayData() {
    let res = await this.requestService.queryServer({ url: `/api/weibo/getAllUserDayData`, method: 'get' }, {});
    return res.msg;
  }
  async getCurrentFlower() {
    let res2 = await this.requestService.queryServer({ url: `/api/weibo/getLoveBySecond`, method: 'get' }, {});
    console.log(res2.data)
    return JSON.parse(res2.data[0].data);
  }

  async getStartFlower() {
    let res = await this.requestService.queryServer({ url: `/api/weibo/latest`, method: 'get' }, {});
    return JSON.parse(res.data[0].data);
  }
}
