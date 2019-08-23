import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { DateAdapter } from '@angular/material';

import { UserService } from '../core/service/user.service';
import { EmployeeService } from '../core/service/employee.service';
import { Project } from '../core/models/project.model';
import { Day } from '../core/models/day.model';
import { Task } from '../core/models/task.model';
import { TaskNote } from '../core/models/taskNote.model';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  // days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  //TODO: date получать из datepicker
  taskForm: FormGroup;
  //FIXME: заполнять выбранную неделю, вместо текущей
  // curr: Date = new Date();//текущая дата в формате "Tue Aug 13 2019 21:30:08 GMT+0300 (Москва, стандартное время)"
  week: Day[] = [];
  task: Task[];
  projects: Project[];
  userId: number;
  projectId: number;
  startDate: any;
  endDate: any;
  canPut: boolean = true;//post или пут запрос
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private employeeService: EmployeeService
    ///  private dateAdapter: DateAdapter<any>
  ) { }
  ngOnInit() {
    this.userId = this.userService.getUserId();
    this.initForm();
    this.getProject();
    //this.dateAdapter.setLocale('ru-Latn');
    this.getWeek();
  }
  previousWeek() {//выбранный день -7 назад
    this.week = [];
    for (let i = 0; i < 7; i++) {
      this.taskForm.controls[`day${i}`].setValue("");
    }
    let curr = new Date(this.taskForm.get('currentWeek').value);
    let first = curr.getDate() - 7;
    let day = new Date(curr.setDate(first));
    this.taskForm.patchValue({
      currentWeek: day
    }, { onlySelf: true })
    this.getWeek();
  }
  getWeek() {//получить текущую неделю
    //FIXME: ночью неверные значения
    this.week = [];
    for (let i = 0; i < 7; i++) {
      this.taskForm.controls[`day${i}`].setValue("");
    };
    let curr = new Date(this.taskForm.get('currentWeek').value);
    for (let i = 1; i <= 7; i++) {//getDate() - Получить число месяца, от 1 до 31.
      let first = curr.getDate() - curr.getDay() + i;//getDay() - Получить номер дня в неделе.(от 0(вс) до 6 (сб)). В итоге получаем дни с пн по вс
      curr.setDate(first);//преобразуем и получаем только число
      let day = curr.toISOString().slice(0, 10);
      let newDay = new Day(day, i);
      this.week.push(newDay);//добавить в массив дней недели
    };
  }
  nextWeek() {//выбранный +7 вперед
    this.week = [];
    for (let i = 0; i < 7; i++) {
      this.taskForm.controls[`day${i}`].setValue("");
    }
    let curr = new Date(this.taskForm.get('currentWeek').value);
    let first = curr.getDate() + 7;
    let day = new Date(curr.setDate(first));
    this.taskForm.patchValue({
      currentWeek: day
    }, { onlySelf: true })
    this.getWeek();
  }

  getTotalHours() {//часы за неделю
    let sum = +0;
    for (let i = 0; i < 7; i++) {
      sum += this.taskForm.controls[`day${i}`].value;
    }
    this.taskForm.controls[`total`].setValue(`${sum}`);
  }

  // get
  getTasks(): void {
    this.employeeService.getTasks(+localStorage.getItem('userId'), this.taskForm.controls['type'].value.id, this.week[0].date, this.week[6].date)
      .subscribe(tasks => {
        this.task = tasks;
        tasks.map(
          (task: any) => {
            task.taskNotes.map((taskNote: any) => {
              let index = this.week.findIndex(item => item.date == taskNote.day.slice(0, 10));
              this.taskForm.controls[`day${index}`].setValue(taskNote.hours);
            }
            );
          }
        );
        this.canPut = true;//если прошло, то делаем put запросы
        this.getTotalHours();
      });
  }
  //post
  addTask() {
    let newTaskNotes: TaskNote[] = [];
    for (let i = 0; i < 7; i++) {
      if (this.taskForm.controls[`day${i}`].value != "") {
        newTaskNotes.push(new TaskNote(0, this.week[i].date, this.taskForm.controls[`day${i}`].value));
      }
    }
    const newTask = new Task(+localStorage.getItem('userId'), this.taskForm.controls['type'].value.name, newTaskNotes, []);

    this.employeeService.addTask(+localStorage.getItem('userId'), this.taskForm.controls['type'].value.id, newTask)
      .subscribe(() => { });
  }
  // put
  editTask() {
    let newTaskNotes: TaskNote[] = [];
    for (let i = 0; i < 7; i++) {
      if (this.taskForm.controls[`day${i}`].value != "") {
        newTaskNotes.push(new TaskNote(0, this.week[i].date, this.taskForm.controls[`day${i}`].value));
      }
    }
    const newTask = new Task(+localStorage.getItem('userId'), this.taskForm.controls['type'].value.name, newTaskNotes, []);
    this.employeeService.editTask(+localStorage.getItem('userId'), this.task[0].id, newTask)
      .subscribe(() => { });
  }
  //delete
  delete(): void {
    // this.vacations = this.vacations.filter(v => v !== vacation);
    this.employeeService.deleteTask(+this.userId, this.task[0].id).subscribe();
  }

  private getProject() {
    this.userService.getUserInfo().subscribe(user => {
      this.projects = user.projects;
      //this.taskForm.controls[`type`].patchValue(`${user.projects[0].name}`);
    });
  }
  private initForm(): void {
    this.taskForm = this.fb.group({
      type: "",
      currentWeek: new Date(),
      day0: "",
      day1: "",
      day2: "",
      day3: "",
      day4: "",
      day5: "",
      day6: "",
      total: "",
    });
  }
}
