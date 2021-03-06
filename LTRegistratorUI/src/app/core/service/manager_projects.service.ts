import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { _throw } from 'rxjs-compat/observable/throw';
import { environment } from '../../../environments/environment';
import * as moment from 'moment/moment';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})

export class ManagerProjectsService {
  private projectPostUrl = environment.apiBaseUrl + `api/manager/project/`;
  constructor(
    private http: HttpClient
  ) { }

  getManagerProjects(): any {
      return this.http.get<any>(this.getManagerUrlGet());
  }

  addManagerProject(projectName: any): any {
    return this.http.post<any>(this.projectPostUrl, {name: projectName})
    .pipe(
      catchError(this.handleError)
    );
  }

  getManagerUrlGet() {
    return environment.apiBaseUrl + `api/manager/` + localStorage.getItem('userId') + `/projects`;
  }

  getMonthlyReport(date: Date) {
    return this.http.get(environment.apiBaseUrl + 'api/reports/monthly/' + moment(date).format('YYYY-MM-DD') + '/manager/' + localStorage.getItem('userId'),
    { responseType: 'arraybuffer' })
    .subscribe((response) => {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      FileSaver.saveAs(blob, 'monthly_report_' + moment(date).format('YYYY_MM') + '.xlsx')
    });
  }

  deleteProject(id: number ) {
    return this.http.delete<any>(this.deleteProjectGerUrl(id));
  }

  deleteProjectGerUrl(id:number){
    return environment.apiBaseUrl + `api/manager/project/` + id;
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` );
        alert(`Project with this name already exist, try again!`);
    }
    // return an observable with a user-facing error message
    return _throw(
      'Something bad happened; please try again later.');
  };
}
