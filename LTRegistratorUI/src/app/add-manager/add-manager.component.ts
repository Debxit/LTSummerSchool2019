import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from "src/app/material.module";
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';


export interface Project {
  position: number;
  project: string;
}

const PROJECT: Project[] = [
  { position: 1, project: 'Project A' },
  { position: 2, project: 'Project B' },
  { position: 3, project: 'Project C' },
]

@Component({
  selector: 'app-add-manager',
  templateUrl: './add-manager.component.html',
  styleUrls: ['./add-manager.component.scss']
})
export class AddManagerComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor() { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  displayedColumns: string[] = ['project', 'button-add', 'delete'];
  dataSource = new MatTableDataSource<Project>(PROJECT);

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
