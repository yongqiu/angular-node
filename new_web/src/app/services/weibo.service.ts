import { Injectable } from '@angular/core';
import { RequestService } from './request.service';

@Injectable()
export class WeiboService {

  constructor(private requestService: RequestService) { 

  }
  async getWeiboAllUserDayData(){
    let res = await this.requestService.queryServer({ url: `/api/weibo/getAllUserDayData`, method: 'get' },{});
    console.log(res)
    return res.msg;
  }
}
