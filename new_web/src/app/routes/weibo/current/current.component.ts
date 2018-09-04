import { Component, OnInit } from '@angular/core';
import { WeiboService } from '../../../services/weibo.service';
import { menuNum, banjiaUser } from '../../../config';
import { TablesService } from '../../../services/tables.service';
import * as moment from 'moment'
@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.scss']
})
export class CurrentComponent implements OnInit {
  userList: any = [];
  loading: boolean = true;
  currentTime: string = '';
  constructor(private weiboService: WeiboService, public tablesService: TablesService) {
    this.tablesService.currentMenu = menuNum.weibo_current;
  }

  ngOnInit() {
    this.getCurrentFlower()
  }

  refresh() {
    this.getCurrentFlower();
  }

  async getCurrentFlower() {
    this.loading = true;

    let data = await this.weiboService.getCurrentFlower();
    console.log(data)
    this.userList = [];
    data.forEach(element => {
      let finder = banjiaUser.find(user => {
        return user.userName == element.userName
      })
      let total_val = parseInt(element.love) * 2;
      let month_val = total_val - finder.love
      this.userList.push({
        userName: element.userName,
        love: month_val / 2,
        val: month_val,
        total_love: element.love,
        total_val: total_val

      })
    });

    this.dealArray(this.userList)
    this.loading = false;
    this.currentTime = moment().format('HH:mm')
  }

  dealArray(tableData) {
    var max;
    for (var i = 0; i < tableData.length; i++) {
      //外层循环一次，就拿arr[i] 和 内层循环arr.legend次的 arr[j] 做对比
      for (var j = i; j < tableData.length; j++) {
        if (tableData[i].val < tableData[j].val) {
          //如果arr[j]大就把此时的值赋值给最大值变量max
          max = tableData[j];
          tableData[j] = tableData[i];
          tableData[i] = max;
        }
      }
    }
  }

}
