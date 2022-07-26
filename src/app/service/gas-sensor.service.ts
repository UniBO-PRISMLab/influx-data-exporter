import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class GasSensorService {

  constructor(
    private http: HttpClient,
    private authService: AuthService) {
  }

 /* url = this.authService.currentUser.url;
  org = this.authService.currentUser.db;
  token = this.authService.currentUser.influxToken;*/
  org = this.authService.currentUser.db;
  getGasSensors(bucket?:string) { 
    var q1 = `from(bucket: "${bucket}")`
    var q2 = "|> range(start: 2021-08-18T15:19:05Z, stop: now())"
    var q3 = '|> limit(n:1)'
    var query = JSON.stringify(q1+ "\n" + q2 +"\n"+q3);
    
    
    /*var query= JSON.stringify(`from(bucket: "example") 
    |> range(start: 2021-08-18T15:19:05Z, stop: now())
    |> filter(fn: (r) =>
        r._measurement == "g_sensor" and
        float(v: r.temperature) < 27
    )`);*/
    
    return this.http.get<any>(`/api/data?query=${query}`, {
      headers: {
        'Accept': 'application/json',
        'x-auth-token': '' + localStorage.getItem('token')
      }
    })
    .pipe(
        map(response => response));
  }

  getFilteredData(q:any){
   let query = JSON.stringify(q);
    return this.http.get<any>(`/api/data?query=${query}`, {
      headers: {
        'Accept': 'application/json',
        'x-auth-token': '' + localStorage.getItem('token')
      }
    })
    .pipe(
        map(response => response));
  }

  getBuckets(org:string){
    return this.http.get<any>(`${this.authService.currentUser.url}/api/v2/buckets?org=${this.org}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Token ' + this.authService.currentUser.influxToken
      }
    })
    .pipe(
        map(response => response));
  }

  getFilteredDataFromInfluxAPI(q:any){
    let query = { query: q }

    return this.http.post("http://localhost:8086/api/v2/query?org=ORG2", JSON.stringify(query),{
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
