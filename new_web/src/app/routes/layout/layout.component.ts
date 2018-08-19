import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute, NavigationEnd } from '@angular/router';
import { TablesService } from '../../services/tables.service';
import 'rxjs/add/operator/filter';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(private router: Router, public tablesService: TablesService, private activatedRoute: ActivatedRoute) {
    this.router.events.filter((event) => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
      //do something
      // console.log(event)
    });
  }

  ngOnInit() {

  }

  routeToHot() {
    this.router.navigate(["hot-search"]);
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
}
