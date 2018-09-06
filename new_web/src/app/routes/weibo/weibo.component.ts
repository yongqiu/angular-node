import { Component, OnInit } from '@angular/core';
import { WeiboService } from '../../services/weibo.service';
import { TablesService } from '../../services/tables.service';
import * as moment from 'moment';
import { menuNum } from '../../config';

@Component({
  selector: 'app-weibo',
  templateUrl: './weibo.component.html',
  styleUrls: ['./weibo.component.scss']
})
export class WeiboComponent implements OnInit {
  userList: any = [];
  loading: boolean = true;
  sortName = null;
  sortValue = null;
  dataList: any = [];
  weibo_interact: any = [];
  weibo_love: any = [];
  weibo_read: any = [];
  weibo_social: any = [];
  display_interact: any = [];
  display_love: any = [];
  display_read: any = [];
  display_social: any = [];
  currentDate: string;
  constructor(private weiboService: WeiboService, private tablesService: TablesService) {
    this.tablesService.currentMenu = menuNum.weibo;
  }

  ngOnInit() {
    this.getWeiboAllUserDayData()

  }

  async getWeiboAllUserDayData() {
    let userList = await this.weiboService.getWeiboAllUserDayData()
    this.currentDate = moment.unix(userList[0].createdAt).subtract(1, 'days').format('MM月DD日');

    let unix = moment.unix(userList[0].createdAt)
    console.log(unix)
    this.weibo_interact = [];
    this.weibo_read = [];
    this.weibo_love = [];
    this.weibo_social = [];
    userList.forEach(element => {
      this.userList.push({
        name: element.userName,
        score: element.totalVal,
        interactVal: JSON.parse(element.weibo_interact).interactVal,
        readVal: JSON.parse(element.weibo_read).readVal,
        loveVal: JSON.parse(element.weibo_love).loveVal,
        socialVal: JSON.parse(element.weibo_social).socialVal
      })
      this.weibo_interact.push({
        name: element.userName,
        score: JSON.parse(element.weibo_interact).interactVal,
        interact_repost: JSON.parse(element.weibo_interact).interact_repost,
        interact_comment: JSON.parse(element.weibo_interact).interact_comment,
        interact_total: JSON.parse(element.weibo_interact).interact_total,
        interact_story: JSON.parse(element.weibo_interact).interact_story,
      })
      this.weibo_love.push({
        name: element.userName,
        score: JSON.parse(element.weibo_love).loveVal,
        love_person: JSON.parse(element.weibo_love).love_person,
        love_times: JSON.parse(element.weibo_love).love_times,
        love_total: JSON.parse(element.weibo_love).love_total
      })
      this.weibo_read.push({
        name: element.userName,
        score: JSON.parse(element.weibo_read).readVal,
        read_blog: JSON.parse(element.weibo_read).read_blog,
        read_total: JSON.parse(element.weibo_read).read_total
      })
      this.weibo_social.push({
        name: element.userName,
        score: JSON.parse(element.weibo_social).socialVal,
        social_mention: JSON.parse(element.weibo_social).social_mention,
        social_search: JSON.parse(element.weibo_social).social_search,
        social_total: JSON.parse(element.weibo_social).social_total
      })

    });
    this.dealArray(this.userList)
    this.dealArray(this.weibo_interact)
    this.dealArray(this.weibo_love)
    this.dealArray(this.weibo_read)
    this.dealArray(this.weibo_social)
    this.display_interact = this.weibo_interact;
    this.display_read = this.weibo_read;
    this.display_love = this.weibo_love;
    this.display_social = this.weibo_social;
    this.loading = false;
  }

  sort(sort: { key: string, value: string }, data: any, display_data): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.search(data, display_data);
  }
  search(data, display_data): void {
    /** sort data **/
    if (this.sortName && this.sortValue) {
      display_data = data.sort((a, b) => (this.sortValue === 'ascend') ? (a[this.sortName] > b[this.sortName] ? 1 : -1) : (b[this.sortName] > a[this.sortName] ? 1 : -1));
    } else {
      display_data = data;
    }
  }

  dealArray(tableData) {
    var max;
    for (var i = 0; i < tableData.length; i++) {
      //外层循环一次，就拿arr[i] 和 内层循环arr.legend次的 arr[j] 做对比
      for (var j = i; j < tableData.length; j++) {
        if (tableData[i].score < tableData[j].score) {
          //如果arr[j]大就把此时的值赋值给最大值变量max
          max = tableData[j];
          tableData[j] = tableData[i];
          tableData[i] = max;
        }
      }
    }
  }

}
