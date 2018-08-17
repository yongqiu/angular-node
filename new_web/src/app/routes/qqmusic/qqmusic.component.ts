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
        right: '4%',
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
    console.log(this.seriesData)
    console.log(this.names)
    console.log(this.dates)


    this.renderChart()

  }

}
