import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MaterialModule } from "src/app/material.module";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface EmployeeItem {
  position: number;
  name: string;
  email: string;
}

const EMPLOYEES: EmployeeItem[] = [
  { position: 1, name: 'Rick', email: 'c@c' },
  { position: 2, name: 'Ann', email: 'a@a' },
  { position: 3, name: 'Bob', email: 'b@b' },
];

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.scss']
})
export class EmployeesTable implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }
  @Input('multiple-choice') parameter: boolean;// = true;

  Change_parameter() {
    this.parameter = !this.parameter;
  }

  constructor(public dialogRef: MatDialogRef<EmployeesTable>,
    @Inject(MAT_DIALOG_DATA) public data: false) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

 displayedColumns: string[];
 dataSource = new MatTableDataSource<EmployeeItem>(EMPLOYEES);
 selection = new SelectionModel<EmployeeItem>(true, []);

 /** Whether the number of selected elements matches the total number of rows. */
 isAllSelected() {
   const numSelected = this.selection.selected.length;
   const numRows = this.dataSource.data.length;
   return numSelected === numRows;
 }

 /** Selects all rows if they are not all selected; otherwise clear selection. */
 masterToggle() {
   this.isAllSelected() ?
     this.selection.clear() :
     this.dataSource.data.forEach(row => this.selection.select(row));
 }

 /** The label for the checkbox on the passed row */
 checkboxLabel(row?: EmployeeItem): string {
   if (!row) {
     return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
   }
   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
 }
  //////////////////
 isOneSelected(row?: EmployeeItem) {
     for (let item of this.selection.selected) {
       if (item.position != row.position) {
         this.selection.deselect(item);
       }
     }
 }
 
 applyFilter(filterValue: string) {
   this.dataSource.filter = filterValue.trim().toLowerCase();
 }

 changeColumn() {
   if (this.parameter) {
     this.displayedColumns = ['select', 'name', 'email'];
   }
   else {
     this.displayedColumns = ['select_like_radio', 'name', 'email'];
   }
   return this.parameter;
 }

 //убираем радиобаттоны, вместо них делаем обработчик, в зависимости
 //от параметра: чтобы мог выбираться только 1 чекбокс

}
