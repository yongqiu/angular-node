import { Component, OnInit } from "@angular/core";
import { RequestService } from "../../services/request.service";
import * as moment from "moment";
@Component({
  selector: "app-maoyan",
  templateUrl: "./maoyan.component.html",
  styleUrls: ["./maoyan.component.scss"]
})
export class MaoyanComponent implements OnInit {
  dataSet: any;
  currentData = [];
  chartOptions: any;
  data = [];
  ycydata = [];
  wxydata = [];
  dates = [];
  time: string;
  constructor(private requestService: RequestService) {
    this.requestService.routerName = "maoyan";
  }

  ngOnInit() {

    this.getUserData();
  }

  async getUserData() {
    await this.getData();
    console.log(this.currentData)
    let ycydata = await this.getDataByUser(2854373);
    let wxydata = await this.getDataByUser(2825632);
    let unix = []
    ycydata.forEach(info => {
      unix.push(info.createAt)
      this.dates.push(moment.unix(info.createAt).format("MM-DD HH:mm"));
    });
    this.ycydata = this.getBetweenArray(ycydata).reverse()
    this.wxydata = this.getBetweenArray(wxydata).reverse()
    let tableDate = [];
    let currentycy = this.currentData.find(item => { return item.celebrityId == 2854373 });
    console.log(currentycy)
    let currentwxy = this.currentData.find(item => { return item.celebrityId == 2825632 });
    this.time = moment().format("MM-DD HH:mm");
    let current = {
      ycy: currentycy.popValue,
      wxy: currentwxy.popValue,
      ycybet: currentycy.popValue - ycydata[0].popValue,
      wxybet: currentwxy.popValue - wxydata[0].popValue,
      createAt: this.time
    }
    
    tableDate.push(current)
    for (let i = 0; i < this.dates.length; i++) {
      if (ycydata[i + 1]) {
        tableDate.push({
          ycy: ycydata[i].popValue,
          wxy: wxydata[i].popValue,
          ycybet: ycydata[i].popValue - ycydata[i + 1].popValue,
          wxybet: wxydata[i].popValue - wxydata[i + 1].popValue,
          createAt: this.dates[i]
        })
      }

    }
    this.dataSet = tableDate
    console.log(tableDate)
    this.renderChart();
  }

  private getBetweenArray(array) {
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      if (array[i + 1]) {
        let bet = element.popValue - array[i + 1].popValue;
        newArray.push(bet)
      }

    }
    return newArray
  }
  
  /**
   * 获取当前数据
   */
  async getData() {
    let res = await this.requestService.queryServer({ url: `/api/maoyan/getCurrentData`, method: "get" }, {});
    console.log(res);
    this.currentData = [];
    let tableDate = [];
    res.data.data.celebrityList.forEach(element => {
      this.currentData.push(element);
    });
  }

  /**
   * 获取个人数据
   * @param celebrityId 
   */
  async getDataByUser(celebrityId: number) {
    let res = await this.requestService.queryServer({ url: `/api/maoyan/getDataById`, method: "get" }, { celebrityId: celebrityId });
    console.log(res);
    return res.msg;
  }

  renderChart() {
    console.log(this.ycydata);
    console.log(this.wxydata);
    let dates = this.dates.reverse()
    console.log(dates)
    this.chartOptions = {
      color: [
        "#ec5ffd", "#2c7ef1"
      ],
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["ycy", "wxy"]
      },

      xAxis: {
        type: "category",
        boundaryGap: false,
        data: dates
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          name: "ycy",
          type: "line",
          data: this.ycydata
        },
        {
          name: "wxy",
          type: "line",
          data: this.wxydata
        }
      ],
      grid: {
        left: '0px',
        // right: '25px',
        containLabel: true
      },
      dataZoom: [{
        start: 0,
        end: 100,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        },
        top: '90%',
        bottom: 8
      }],
    };
  }

}
