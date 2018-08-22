import { Component, OnInit } from '@angular/core';
import { TablesService } from '../../services/tables.service';
import * as moment from 'moment';
import { menuNum } from '../../config';

@Component({
  selector: 'app-qqmusic',
  templateUrl: './qqmusic.component.html',
  styleUrls: ['./qqmusic.component.scss']
})
export class QqmusicComponent implements OnInit {
  userList: any = [];
  dataSet = [];
  chartOptions: any;
  names: any = [];
  seriesData: any = [];
  dates: any = [];
  tableHeight: number = 300;
  timeRule: string = '1';
  totalArray: any = [];
  loading: boolean = true;
  constructor(public tablesService: TablesService) {
    this.tablesService.currentMenu = menuNum.qqmusic;
  }

  refresh() {
    this.getAllMusic(this.timeRule);
  }

  ngOnInit() {
    this.getAllMusic(this.timeRule);
  }

  changeTimeRule() {
    let timeRule = this.timeRule;
    this.getAllMusic(timeRule);
  }

  renderChart() {
    this.chartOptions = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: this.names
      },
      grid: {
        left: '8px',
        right: '25px',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.dates
      },
      yAxis: {
        type: 'value'
      },
      series: this.seriesData
    };
  }

  async getAllMusic(timeRule: string) {
    this.loading = true;
    let data = [];
    if (timeRule == '1') {
      data = await this.tablesService.getAllMusicNum();
    } else {
      data = await this.tablesService.getAllMusicNumByMinute();
    }
    data.reverse();
    this.userList = [];
    this.seriesData = [];
    this.names = [];
    let userList = this.tablesService.userList;
    userList.forEach(element => {
      if (element.singerid) {
        this.userList.push(element);
        this.seriesData.push({ name: element.userName })
        this.names.push(element.userName)
      }
    });
    this.userList.forEach(user => {
      user.musicNum = [];
      data.forEach(element => {
        if (element.singerid == user.singerid) {
          let createdAt;
          if (timeRule == '1') {
            createdAt = moment.unix(element.createdAt).format('DD日HH点')
          } else {
            createdAt = moment.unix(element.createdAt).format('HH:mm')
          }
          user.musicNum.push({
            singer_call_num: element.singer_call_num,
            createdAt: createdAt
          })
        }
      });
    });
    
    this.initChartData();
    this.initTableData();
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  initChartData() {
    // 生成图表数据
    this.seriesData.forEach(element => {
      element.data = [];
      element.type = 'line';
      let find = this.userList.find(item => {
        return item.userName == element.name
      })
      for (let i = 0; i < find.musicNum.length; i++) {
        const num = find.musicNum[i];
        if (i < find.musicNum.length - 1)
          element.data.push(find.musicNum[i + 1].singer_call_num - find.musicNum[i].singer_call_num)
      }
      // find.musicNum.forEach(num => {
      //   element.data.push(num.singer_call_num)
      // });
    });
    this.dates = [];
    this.userList[0].musicNum.forEach(info => {
      this.dates.push(info.createdAt)
    });
    this.dates.splice(0, 1)
    this.renderChart()
  }

  initTableData() {
    let tableData = this.userList;
    // 表格数据
    this.tablesService.getCurrentMusicNum().then(res => {
      let ranklist = res.requestSingerCallList.data.ranklist;
      tableData.forEach(element => {
        let finder = ranklist.find(info => {
          return info.singerid == element.singerid
        })
        element.musicNum.push({
          singer_call_num: finder.singer_call_num,
          createdAt: `即时${moment().format('HH:mm')}`
        })
        element.musicNum.reverse()
      });
      // 按照从小到大排序
      this.dealArray(tableData)
      // 获取差值
      this.addBetween(tableData)
    })
  }

  dealArray(tableData) {
    var max;
    for (var i = 0; i < tableData.length; i++) {
      //外层循环一次，就拿arr[i] 和 内层循环arr.legend次的 arr[j] 做对比
      for (var j = i; j < tableData.length; j++) {
        if (tableData[i].musicNum[0].singer_call_num < tableData[j].musicNum[0].singer_call_num) {
          //如果arr[j]大就把此时的值赋值给最大值变量max
          max = tableData[j];
          tableData[j] = tableData[i];
          tableData[i] = max;
        }
      }
    }
  }

  addBetween(tableData) {
    let totalArray = [];
    for (let i = 0; i < tableData.length; i++) {
      const element = tableData[i];
      if (i == tableData.length - 1) {
        totalArray.push(element)
      } else {
        var next = tableData[i + 1];
        var between = {
          userName: '差值',
          musicNum: []
        }
        element.musicNum.forEach((item, index) => {
          between.musicNum.push({
            singer_call_num: item.singer_call_num - next.musicNum[index].singer_call_num,
            createdAt: item.createdAt
          })
        });
        totalArray.push(element);
        totalArray.push(between)
      }
    }
    this.totalArray = totalArray;
  }

}
