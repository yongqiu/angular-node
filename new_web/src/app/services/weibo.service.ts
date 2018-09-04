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
    let res = await this.requestService.queryServer({ url: `/api/weibo/loveCurrent`, method: 'get' }, {});
    console.log(res.data)
    return JSON.parse(res.data);
  }

}
