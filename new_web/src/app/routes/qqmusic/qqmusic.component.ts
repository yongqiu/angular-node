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
  timeRule: string = '2';
  totalArray: any = [];
  loading: boolean = true;
  time: string;
  private _diff: number;
  private get diff() {
    return this._diff;
  }
  private set diff(val) {
    this._diff = Math.floor(val);
    let days = parseInt((val / 60 / 60 / 24).toString(), 10); //计算剩余的天数 
    let hours = parseInt((val / 60 / 60 % 24).toString(), 10); //计算剩余的小时 
    let minutes = parseInt((val / 60 % 60).toString(), 10);//计算剩余的分钟 
    let seconds = parseInt((val % 60).toString(), 10);//计算剩余的秒数 
    this.time = `倒计时：${days}天${hours}小时${minutes}分钟${seconds}秒`
  }
  // 定时器
  private timer;
  constructor(public tablesService: TablesService) {
    this.tablesService.currentMenu = menuNum.qqmusic;
  }

  refresh() {
    this.getAllMusic(this.timeRule);
  }

  ngOnInit() {
    this.getAllMusic(this.timeRule);

    // this.leftTimer()

    // this.leftTimer(2018, 11, 11, 11, 11, 11)
  }

  changeTimeRule() {
    let timeRule = this.timeRule;
    this.getAllMusic(timeRule);
  }

  renderChart() {
    this.chartOptions = {
      color: [
        '#ec5ffd', '#f3a385', '#54a1d5', '#aee4bb', '#86dde1',
        '#fadb71', '#7f7be3', '#e0beef', '#95706d', '#dc69aa',
        '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
        '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
      ],
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
    this.userList = [];
    this.seriesData = [];
    this.names = [];
    this.dates = [];
    let data = [];
    if (timeRule == '1') {
      data = await this.tablesService.getAllMusicNum();
    } else {
      data = await this.tablesService.getAllMusicNumByMinute();
    }
    data.reverse();
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

  // 每一秒更新时间差
  ngAfterViewInit() {
    this.timer = setInterval(() => {
      this.diff = moment('2018-09-01 00:00').unix() - moment().unix();

    }, 1000);
  }

  // 销毁组件时清除定时器
  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

}
