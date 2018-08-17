import { Component, OnInit } from '@angular/core';
import { TablesService } from '../../services/tables.service';
import { NgxEchartsService } from 'ngx-echarts';
import { menuNum } from '../../config';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
  chartOption3: any;
  currentUser: any = '3';

  // 互动: 
  weibo_int: any = [];
  weibo_read: any = [];
  weibo_love: any = [];

  month: any = [];
  constructor(public tablesService: TablesService) {
    this.tablesService.currentMenu = menuNum.charts;
  }

  ngOnInit() {
    // const echarts = this.es.echarts;
    this.changeUser()
  }

  getChartOption(type: string) {
    let data = [];
    let title = '';
    let month = this.month;
    switch (type) {
      case 'weibo_int':
        data = this.weibo_int;
        title = '总互动量'
        break;
      case 'weibo_read':
        data = this.weibo_read;
        title = '总阅读量'
        break;
      case 'weibo_love':
        data = this.weibo_love;
        title = '爱慕值'
        break;

      default:
        break;
    }
    return {
      color: ['#1890fc', '#bfbfbf'],
      grid: {
        left: '60',
        top: '45',
        right: '20'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: [title]
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: month
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: title,
          type: 'line',
          data: data,
        }
      ]
    }
  }

  async changeUser() {
    await this.tablesService.getWeiboData("month", this.currentUser);
    // await this.tablesService.getWeiboInfo(this.currentUser)
    let weiboData = this.tablesService.weiboData;
    this.weibo_int = [];
    this.weibo_read = [];
    this.weibo_love = [];
    this.month = [];
    weiboData.forEach(element => {
      this.weibo_int.push(element.weibo_int.interact);
      this.weibo_read.push(element.weibo_read.num);
      this.weibo_love.push(element.weibo_love.close);
      this.month.push(element.create_date)
    });
  }


}
