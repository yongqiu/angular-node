import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import * as moment from 'moment';
@Component({
  selector: 'app-maoyan',
  templateUrl: './maoyan.component.html',
  styleUrls: ['./maoyan.component.scss']
})
export class MaoyanComponent implements OnInit {
  dataSet: any;
  currentData: string;
  constructor(private requestService: RequestService) {
    this.requestService.routerName = 'maoyan'
   }

  ngOnInit() {
    this.getData()
  }

  async getData(){
    let res = await this.requestService.queryServer({ url: `/api/maoyan/getCurrentData`, method: 'get' }, { });
    console.log(res)
    this.dataSet = [];
    res.data.data.celebrityList.forEach(element => {
      this.dataSet.push(element)
    });
    this.currentData = moment().format('YYYY-MM-DD HH:mm')
  }
}
