import { Component, OnInit } from '@angular/core';
import { TablesService } from '../../services/tables.service';
import { NgxEchartsService } from 'ngx-echarts';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
  chartOption3: any;
  constructor(public tablesService: TablesService, private es: NgxEchartsService) {
    this.tablesService.currentMenu = 2;
  }

  ngOnInit() {
    // const echarts = this.es.echarts;
    this.chartOption3 = {
      color: ['#1890fc', '#bfbfbf'],
      grid: {
        left: '40',
        top: '80',
        right: '20'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['应用数量']
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      },
      yAxis: {
        name: '环比%',
        type: 'value',
      },
      series: [
        {
          name: '环比增长',
          type: 'line',
          data: [11, 11, 15, 13, 12, 13, 10, 12, 4, 9, 11, 15],
          symbolSize: 8,
          markPoint: {
            data: [
              { type: 'max', name: '最大值' },
              { type: 'min', name: '最小值' }
            ]
          },
          markLine: {
            data: [
              { type: 'average', name: '平均值' }
            ]
          }
        }
      ]
    }
  }


}
