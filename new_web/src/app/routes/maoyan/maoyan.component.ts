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
    let list = await this.getLimitData();
    let dataSet = [];
    list.forEach(element => {
      if(element.rank == 1){
        this.dates.push(moment.unix(element.createAt).format("DD日HH:mm"))
      }
      let finder = dataSet.find(item => element.celebrityId == item.id)
      if (!finder) {
        dataSet.push({
          id: element.celebrityId,
          rank: element.rank,
          name: element.celebrityName,
          data: [element]
        })
      } else {
        finder.data.push(element)
      }
    });
    let aa = JSON.stringify(dataSet);
    console.log(JSON.parse(aa))
    this.dates.reverse()
    this.dates.splice(0, 1)
    console.log(dataSet)
    console.log(this.dates)
    dataSet.forEach(item => {
      let newArray = this.getBetweenArray(item.data);
      item.data = newArray.reverse();
    })
    

    for (var i = 0; i < dataSet.length; i++) {
      for (var j = i + 1; j < dataSet.length; j++) {
        if (dataSet[i].rank > dataSet[j].rank) {
          var t = dataSet[i];
          dataSet[i] = dataSet[j];
          dataSet[j] = t;
        }
      }
    }
    console.log(dataSet)
    this.dataSet = dataSet;
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
   * 获取当前数据
   */
  async getLimitData() {
    let res = await this.requestService.queryServer({ url: `/api/maoyan/getDataLimit`, method: "get" }, {});
    console.log(res);
    return res.msg
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
