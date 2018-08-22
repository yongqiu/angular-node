import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { serverUrl } from '../config';
import * as moment from 'moment';

@Injectable()
export class TablesService {
  weiboData: any = [];
  suerData: any = [];
  weibo_title: string = '';
  // 热搜
  searchTotal: number = 0;
  searchData: any = [];
  searchTotalPage: number = 0;
  searchLoading: boolean = false;

  // 成员
  userList: any = [];

  tableHeight: any = '300px';

  currentMenu: number = 1;
  constructor(private requestService: RequestService) {
    this.userList = [{
      userName: '杨超越',
      key: 3,
      singerid: 2141375
    }, {
      userName: '孟美岐',
      key: 1,
      singerid: 0
    }, {
      userName: '吴宣仪',
      key: 2,
      singerid: 0
    }, {
      userName: '段奥娟',
      key: 4,
      singerid: 2141373
    }, {
      userName: 'yamy',
      key: 5,
      singerid: 1512412
    }, {
      userName: '赖美云',
      key: 6,
      singerid: 2141459
    }, {
      userName: '紫宁',
      key: 7,
      singerid: 0
    }, {
      userName: 'sunnee',
      key: 8,
      singerid: 1530392
    }, {
      userName: '李紫婷',
      key: 9,
      singerid: 2141486
    }, {
      userName: '傅菁',
      key: 10,
      singerid: 2141458
    }, {
      userName: '徐梦洁',
      key: 11,
      singerid: 2141386
    }
    ]
  }
  public async getWeiboData(weekFliter: string, userNum: string) {
    let res = await this.requestService.queryServer({ url: `/api/weibo/data`, method: 'get' }, { weekFliter: weekFliter, userNum: userNum });
    let weiboData = [];
    let data = JSON.parse(res.data)
    data.list.forEach(element => {
      weiboData.push({
        create_date: moment.unix(element.create_date).format('MM-DD'),
        weibo_read: element.weibo_read,
        weibo_int: element.weibo_int,
        weibo_love: element.weibo_love
      })
    });
    this.weibo_title = data.list[0].weibo_total.title;
    this.weiboData = weiboData;
  }

  public async getWeiboInfo(userNum: string) {
    let res = await this.requestService.queryServer({ url: `/api/weibo/info`, method: 'get' }, { userNum: userNum });
    let data = JSON.parse(res.data)
    let suerData = [];
    data.list.forEach(element => {
      suerData.push({
        create_date: moment.unix(element.create_date).format('MM-DD'),
        super_rank: element.super_rank,
        super_fans: element.super_fans,
        super_read: element.super_read,
        doki_fans: `${parseInt((element.doki_fans / 10000).toString())}万`
      })
    });
    this.suerData = suerData;
  }

  public async getHotSearch(page: number, name: string) {
    let encode = encodeURI(name)
    let hotUrl = `/api/weibo/getHotSearch`
    let res = await this.requestService.queryServer({ url: hotUrl, method: 'get' }, { page: page, name: encode });
    let data = JSON.parse(res.data);
    this.searchTotal = data.total;
    this.searchTotalPage = Math.ceil(data.total / 20)
    setTimeout(() => {
      data.rows.forEach(element => {
        this.searchData.push({
          firstRankingTime: moment.unix(element.firstRankingTime).format('YYYY-MM-DD'),
          keywords: element.keywords,
          searchNums: element.searchNums,
          topRanking: element.topRanking,
          duration: this.secondToDate(element.duration)
        });
      });
      this.searchLoading = false;
    }, 300);
  }

  public async getMusicInfo() {
    let url = `/api/getMusicInfo`
    let res = await this.requestService.queryServer({ url: url, method: 'get' }, {});
  }

  secondToDate(result) {
    var h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
    var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
    return result = h + "小时" + m + "分";
  }

  // 获取最后80条信息
  getAllMusicNum() {
    let url = `/api/qqmusic/getAlluserNum`
    return this.requestService.queryServer({ url: url, method: 'get' }, {}).then(res => {
      return res.msg;
    })
  }

  getAllMusicNumByMinute() {
    let url = `/api/qqmusic/getUserNumByMinute`
    return this.requestService.queryServer({ url: url, method: 'get' }, {}).then(res => {
      return res.msg;
    })
  }

  // 获取当前时间的信息
  getCurrentMusicNum() {
    let url = `/api/qqmusic/getNowData`;
    return this.requestService.queryServer({ url: url, method: 'get' }, {}).then(res => {
      if (res.code == 200) {
        return JSON.parse(res.data)
      }
    })
  }

}
