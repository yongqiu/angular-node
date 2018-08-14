import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TablesService } from '../../services/tables.service';

@Component({
  selector: 'app-hot-search',
  templateUrl: './hot-search.component.html',
  styleUrls: ['./hot-search.component.scss']
})
export class HotSearchComponent implements OnInit {
  pageIndex: number = 1;
  showTotal: boolean = false;
  currentUser: any = '杨超越';
  constructor(private activatedRoute: ActivatedRoute, public tablesService: TablesService) {
    this.tablesService.currentMenu = 3;
    this.activatedRoute.queryParams.subscribe(
      (queryParams: any) => {
        console.log(queryParams.page)
        this.tablesService.searchData = [];
        this.pageIndex = 1;
        this.tablesService.searchLoading = true;
        this.tablesService.getHotSearch(this.pageIndex, this.currentUser);
      }
    )
  }

  ngOnInit() {

  }

  changeUser() {
    console.log(this.currentUser)
    this.pageIndex = 1;
    this.tablesService.searchData = [];
    this.tablesService.getHotSearch(this.pageIndex, this.currentUser);
  }

  scrollHandler(e) {
    let clientHeight = e.target.clientHeight;
    let scrollTop = e.target.scrollTop;
    let scrollHeight = e.target.scrollHeight;
    let check = scrollHeight - clientHeight;

    if (scrollTop == check) {
      console.log(e)
      this.tablesService.searchLoading = true;
      this.pageIndex = this.pageIndex + 1;
      console.log(this.pageIndex)
      if (this.pageIndex <= this.tablesService.searchTotalPage) {
        console.log(this.pageIndex)
        console.log(this.tablesService.searchTotalPage)
        this.tablesService.getHotSearch(this.pageIndex, this.currentUser)
      } else {
        this.tablesService.searchLoading = false;
        this.showTotal = true;
      }

    }
  }

}
