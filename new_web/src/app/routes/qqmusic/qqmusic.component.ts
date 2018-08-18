import { Component, OnInit } from '@angular/core';
import { TablesService } from '../../services/tables.service';
import * as moment from 'moment';

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
  tableData: any = [];
  constructor(public tablesService: TablesService) {

  }

  ngOnInit() {
    this.getAllMusic();
    for (let i = 0; i < 10; i++) {
      this.dataSet.push({
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`
      });
    }
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
        left: '3%',
        right: '5%',
        bottom: '3%',
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

  async getAllMusic() {
    let data = await this.tablesService.getAllMusicNum();
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
          user.musicNum.push({
            singer_call_num: element.singer_call_num,
            createdAt: moment.unix(element.createdAt).format('MM-DD HH:mm')
          })
        }
      });
    });
    this.initChartData();
    this.initTableData();
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
    this.tableData = [];
    // 表格数据
    this.tablesService.getCurrentMusicNum().then(res => {
      let ranklist = res.requestSingerCallList.data.ranklist;
      tableData.forEach(element => {
        let finder = ranklist.find(info => {
          return info.singerid == element.singerid
        })
        element.musicNum.push({
          singer_call_num: finder.singer_call_num,
          createdAt: moment().format('MM-DD HH:mm')
        })
        element.musicNum.reverse()
      });
      this.dealArray(tableData)


      this.tableData = tableData;
    })
  }

  dealArray(tableData){
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

}
