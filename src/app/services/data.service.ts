import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';



@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http:HttpClient,
    private authService: AuthService) { }

  getDataSchema(bucket:string, measurement: string){
    var q1 = `from(bucket: "${bucket}")`
    var q2 = "|> range(start: 2021-08-18T15:19:05Z, stop: now())"
    var q3 = `|> filter(fn: (r) => r._measurement == "${measurement}" )`
    var q4 = '|> limit(n:1)'
    var q5 = '|> pivot( rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")'
    var q = (q1+ "\n" + q2 +"\n"+q3+"\n"+q4+"\n"+q5);
    let query = { query: q}
    
    return this.http.post<any>('/api/data', query, {
      headers: {
        'Accept': 'application/json;',
        'x-auth-token': '' + localStorage.getItem('token')
      }
    })
    .pipe(
        map(response => response));
  }

  getFilteredData(q:string){
    
    let query = { query: q}
    return this.http.post<any>('/api/data', query,  {
      headers: {
        'Accept': 'application/json',
        'x-auth-token': '' + localStorage.getItem('token')
      }
    })
    .pipe(
        map(response => response));
  }

  getBuckets(){
    
    return this.http.get<any>('/api/buckets', {
      headers: {
        'Accept': 'application/json',
        'x-auth-token': '' + localStorage.getItem('token')
      }
    })
    .pipe(
        map(response => response));
  }

  getUniqueFields(bucket:any,measurement?:any, field?: string){

    var q1 = `from(bucket: "${bucket}")`
    var q2="";
    if(measurement && field){
      q2 = `
        |> range(start: -30d)
        |> filter(fn: (r) => r._measurement == "${measurement}" )
        |> keep(columns: ["${field}"])
        |> unique(column: "${field}")
      `
    } else{
      q2 = `
        |> range(start: -30d)
        |> keep(columns: ["_measurement"])
        |> unique(column: "_measurement")
      `
    }
   
    var q = (q1+ "\n" + q2 +"\n");
    let query = { query: q}
    
    return this.http.post<any>('/api/data', query, {
      headers: {
        'Accept': 'application/json;',
        'x-auth-token': '' + localStorage.getItem('token')
      }
    })
    .pipe(
        map(response => response));
  }
  
    
  getFilteredDataFromInfluxAPI(q:any){
    let query = { query: q }
    return this.http.post(`http://localhost:8086/api/v2/query?org=${this.authService.currentUser.org}`, JSON.stringify(query),{
      responseType:'blob',
      headers:{
        'Accept': 'text/csv',
        'Authorization': 'Token ' + this.authService.currentUser.influxToken
      }
    })
    .pipe(
      map(response => response));
    }
  }
