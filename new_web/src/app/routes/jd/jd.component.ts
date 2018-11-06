import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import * as moment from 'moment';

@Component({
  selector: 'app-jd',
  templateUrl: './jd.component.html',
  styleUrls: ['./jd.component.scss']
})
export class JdComponent implements OnInit {
  userList: any = [];
  names: any = [];
  seriesData: any = [];
  chartOptions: any;
  dates: any = [];
  totalArray: any = [];
  tableHeight: number = 300;
  loading: boolean = true;
  constructor(private requestService: RequestService) {
    this.userList = [{
      userName: '杨超越',
      userId: 2,
    }, {
      userName: '孟美岐',
      userId: 1,
    }, {
      userName: '吴宣仪',
      userId: 3,
    }]
  }

  ngOnInit() {
    this.getOneHourData()
  }

  // refresh

  async getOneHourData() {
    this.loading = true;
    let res = await this.requestService.queryServer({ url: `/api/jd/getData`, method: 'get' }, {});
    console.log(res)
    let data = res.msg;
    data.reverse();
    this.userList.forEach(element => {
      if (element.userId) {
        this.seriesData.push({ name: element.userName })
        this.names.push(element.userName)
      }
    });
    this.userList.forEach(user => {
      user.musicNum = [];
      data.forEach(element => {
        if (element.userId == user.userId) {
          let createdAt;
          // if (timeRule == '1') {
          //   createdAt = moment.unix(element.createdAt).format('DD日HH点')
          // } else {
          //   createdAt = moment.unix(element.createdAt).format('HH:mm')
          // }
          createdAt = moment.unix(element.createdAt).format('HH:mm')
          user.musicNum.push({
            value: element.value,
            createdAt: createdAt
          })
        }
      });
    });

    this.initChartData();
    this.initTableData();
  }

  renderChart() {
    console.log(this.names)
    console.log(this.dates);
    console.log(this.seriesData)
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

  initChartData() {
    this.dates=[];
    // 生成图表数据
    this.seriesData.forEach(element => {
      element.data = [];
      element.type = 'line';
      let find = this.userList.find(item => {
        return item.userName == element.name
      })
      for (let i = 0; i < find.musicNum.length; i++) {
        if (i < find.musicNum.length - 1)
          element.data.push(find.musicNum[i + 1].value - find.musicNum[i].value)
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

  async initTableData() {
    let tableData = this.userList;
    // 表格数据
    let res = await this.requestService.queryServer({ url: `/api/jd/getCurrentData`, method: 'get' }, {});

    let ranklist = res.data;
    tableData.forEach(element => {
      let finder = ranklist.find(info => {
        return info.name == element.userName
      })
      element.musicNum.push({
        value: finder.num,
        createdAt: `即时${moment().format('HH:mm')}`
      })
      element.musicNum.reverse()
    });
    console.log(tableData)
    // 按照从小到大排序
    this.dealArray(tableData)
    // 获取差值
    this.addBetween(tableData)

  }

  dealArray(tableData) {
    var max;
    for (var i = 0; i < tableData.length; i++) {
      //外层循环一次，就拿arr[i] 和 内层循环arr.legend次的 arr[j] 做对比
      for (var j = i; j < tableData.length; j++) {
        if (tableData[i].musicNum[0].value < tableData[j].musicNum[0].value) {
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
            value: item.value - next.musicNum[index].value,
            createdAt: item.createdAt
          })
        });
        totalArray.push(element);
        totalArray.push(between)
      }
    }
    this.totalArray = totalArray;
    console.log(totalArray)
    this.loading = false
  }
}
