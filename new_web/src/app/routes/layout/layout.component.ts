import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TablesService } from '../../services/tables.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(private router: Router, public tablesService: TablesService) {

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
}
