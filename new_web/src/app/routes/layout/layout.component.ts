import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, Params, ActivatedRoute, NavigationEnd } from '@angular/router';
import { TablesService } from '../../services/tables.service';
import 'rxjs/add/operator/filter';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  @ViewChild('content') content;
  topic: string;
  constructor(private router: Router, public tablesService: TablesService, private activatedRoute: ActivatedRoute) {
    this.router.events.filter((event) => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
      //do something
      // console.log(event)
    });


    // if(width < 800){
    //   this.tablesService.tableHeight = '280px';
    // }else{
    //   this.tablesService.tableHeight = 'auto'
    // }
  }

  ngOnInit() {
    this.windowResize()
  }
  windowResize() {
    let width = window.document.body.offsetWidth;
    let heigth = window.document.body.offsetHeight - 260;
    this.tablesService.tableHeight = heigth + 'px';
  }

  ngAfterViewInit() {
    // let contentWidth = this.content.nativeElement.clientWidth;
    // if(contentWidth > 800){
    //   this.tablesService.tableHeight = 'auto'
    // }else{
    //   this.tablesService.tableHeight = '300px';
    //   console.log(this.tablesService.tableHeight)
    // }
    // console.log(contentWidth)
  }

  routeToHot() {
    this.router.navigate(["hot-search"]);
  }

  routeTochiji() {
    this.router.navigate(["chiji"]);
  }

  routeToTable() {
    this.router.navigate(["table"]);
  }

  routeToCharts() {
    this.router.navigate(["charts"]);
  }

  routeToQQmusic() {
    this.router.navigate(["qqmusic"]);
  }

  routeToWeiboData(){
    this.router.navigate(["weibo-data"]);
  }

  routeToWeiboCurrent(){
    this.router.navigate(["weibo-data/current"]);
  }
}
