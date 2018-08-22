import { Component, OnInit } from '@angular/core';
import { TablesService } from '../../services/tables.service';
import * as moment from 'moment';
import { menuNum } from '../../config';
@Component({
  selector: 'app-chiji',
  templateUrl: './chiji.component.html',
  styleUrls: ['./chiji.component.scss']
})
export class ChijiComponent implements OnInit {
  userList: any = [];
  tableData: any = [];
  chartOptions: any;
  names: string[] = [];
  seriesData: any = [];
  minutes: any = [];
  tableLoading: boolean = true;
  chartLoading: boolean = true;
  constructor(private tableSev: TablesService, private tablesService: TablesService) { 
    this.tablesService.currentMenu = menuNum.chiji;
  }

  ngOnInit() {
    // this.tableSev.getChijiList();
    // this.tableSev.getChijiCurrent();
    this.init()
  }

  init() {
    this.tableLoading = true;
    this.chartLoading = true;
    this.getChijiList()
  }
  refresh(){
    this.init()
  }

  async getChijiList() {
    let currentData = await this.tableSev.getChijiCurrent();
    let userList = [];
    currentData.forEach(element => {
      this.names.push(element.rocket_girl_name)
      this.seriesData.push({
        name: element.rocket_girl_name,
        id: element.rocket_girl_id,
        data: [],
        type: 'line'
      })
      userList.push({
        id: element.rocket_girl_id,
        userName: element.rocket_girl_name,
        votes: [{
          num: element.votes,
          createdAt: `即时${moment().format('HH:mm')}`
        }]
      })
    });
    let minuteData = await this.tableSev.getChijiList();
    minuteData.forEach((item, index) => {
      if (index < minuteData.length - 1) {
        this.minutes.push(moment.unix(item.createAt).format('HH:mm'))
      }

      let girls = item.data.rcket_girls;
      girls.forEach(girl => {
        let finder = userList.find(user => {
          return user.id == girl.rocket_girl_id;
        })
        finder.votes.push({
          num: girl.votes,
          createdAt: moment.unix(item.createAt).format('HH:mm')
        })
      });
    })
    this.dealChartData(userList)

    this.addBetween(userList)
  }

  dealChartData(userList) {
    this.seriesData.forEach(element => {
      let finder = userList.find(user => {
        return user.id == element.id
      })
      let reData = finder.votes
      for (let i = reData.length - 1; i >= 2; i--) {
        const userVotes = reData[i];
        // element.data.push(userVotes.num)
        element.data.push(reData[i - 1].num - reData[i].num)
      }
    });
    this.renderChart();
    setTimeout(() => {
      this.chartLoading = false;
    }, 300);
    
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
          votes: []
        }
        element.votes.forEach((item, index) => {
          between.votes.push({
            num: item.num - next.votes[index].num,
            createdAt: item.createdAt
          })
        });
        totalArray.push(element);
        totalArray.push(between)
      }
    }
    this.tableData = totalArray;
    setTimeout(() => {
      this.tableLoading = false;
    }, 300);
  }

  renderChart() {
    let name = this.names.splice(0, 4)
    let data = this.seriesData.splice(0, 4)
    this.chartOptions = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: name
      },
      grid: {
        left: '8px',
        right: '25px',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.minutes.reverse()
      },
      yAxis: {
        type: 'value'
      },
      series: data
    };
  }
}
