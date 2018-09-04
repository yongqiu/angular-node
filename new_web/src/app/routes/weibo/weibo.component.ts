import { Component, OnInit } from '@angular/core';
import { WeiboService } from '../../services/weibo.service';
import { TablesService } from '../../services/tables.service';

@Component({
  selector: 'app-weibo',
  templateUrl: './weibo.component.html',
  styleUrls: ['./weibo.component.scss']
})
export class WeiboComponent implements OnInit {
  userList: any = [
    { name: '杨超越', sid: '5644764907' },
    { name: '紫宁', sid: '2335410541' },
    { name: '赖美云', sid: '5541182601' },
    { name: '杨芸晴', sid: '2485664410' },
    { name: '摩登兄弟', sid: '5456865382' }
  ]
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
  constructor(private weiboService: WeiboService, private tablesService: TablesService) { }

  ngOnInit() {
    this.getWeiboAllUserDayData()
  }

  async getWeiboAllUserDayData() {
    let res = await this.weiboService.getWeiboAllUserDayData()
    this.weibo_interact = [];
    this.weibo_read = [];
    this.weibo_love = [];
    this.weibo_social = [];
    res.forEach(element => {
      this.weibo_interact.push({
        name: element.userName,
        interactVal: JSON.parse(element.weibo_interact).interactVal,
        interact_repost: JSON.parse(element.weibo_interact).interact_repost,
        interact_comment: JSON.parse(element.weibo_interact).interact_comment,
        interact_total: JSON.parse(element.weibo_interact).interact_total,
        interact_story: JSON.parse(element.weibo_interact).interact_story,
      })
      this.weibo_love.push({
        name: element.userName,
        loveVal: JSON.parse(element.weibo_love).loveVal,
        love_person: JSON.parse(element.weibo_love).love_person,
        love_times: JSON.parse(element.weibo_love).love_times,
        love_total: JSON.parse(element.weibo_love).love_total
      })
      this.weibo_read.push({
        name: element.userName,
        readVal: JSON.parse(element.weibo_read).readVal,
        read_blog: JSON.parse(element.weibo_read).read_blog,
        read_total: JSON.parse(element.weibo_read).read_total
      })
      this.weibo_social.push({
        name: element.userName,
        socialVal: JSON.parse(element.weibo_social).socialVal,
        social_mention: JSON.parse(element.weibo_social).social_mention,
        social_search: JSON.parse(element.weibo_social).social_search,
        social_total: JSON.parse(element.weibo_social).social_total
      })
      this.display_interact = this.weibo_interact;
      this.display_read = this.weibo_read;
      this.display_love = this.weibo_love;
      this.display_social = this.weibo_social;
    });
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

}
