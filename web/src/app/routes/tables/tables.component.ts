import { Component, OnInit } from '@angular/core';
import { TablesService } from '../../services/tables.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {
  dataSet = [];
  weekFliter: string = "month";
  currentUser: any = '3';
  constructor(public tablesService: TablesService) { 
    this.tablesService.currentMenu = 1;
  }

  ngOnInit() {
    for (let i = 0; i < 30; i++) {
      this.dataSet.push({
        name: `332`,
        age: 32,
        address: `122525`
      });
    }

    this.tablesService.getWeiboData(this.weekFliter, this.currentUser);
    this.tablesService.getWeiboInfo(this.currentUser);
    // this.tablesService.getHotSearch();
  }

  changeWeek() {
    this.tablesService.getWeiboData(this.weekFliter, this.currentUser);
    this.tablesService.getWeiboInfo(this.currentUser);
  }


  changeUser(){
    console.log(this.currentUser)
    this.tablesService.getWeiboData(this.weekFliter, this.currentUser);
    this.tablesService.getWeiboInfo(this.currentUser)
  }

}
